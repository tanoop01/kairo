'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// DEV MODE: Bypass Firebase OTP for testing
const DEV_MODE = true;
const DEV_OTP = '241240';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Profile data for new users
  const [profileData, setProfileData] = useState({
    name: '',
    city: '',
    state: '',
    role: 'other' as any,
    preferredLanguage: 'en' as any,
  });

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
    }
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid 10-digit phone number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (DEV_MODE) {
        // Dev mode: Skip Firebase and proceed to OTP step
        setStep('otp');
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code',
        });
      } else {
        setupRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;
        const formattedPhone = `+91${phoneNumber}`;
        
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(result);
        setStep('otp');
        
        toast({
          title: 'OTP Sent',
          description: 'Please check your phone for the verification code',
        });
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) return;

    setLoading(true);
    try {
      if (DEV_MODE) {
        // Dev mode: Check hardcoded OTP
        if (otp !== DEV_OTP) {
          toast({
            title: 'Invalid OTP',
            description: 'Please enter the correct verification code',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // Create a mock Firebase UID based on phone number
        const mockFirebaseUid = `dev_${phoneNumber}`;

        // Check if user exists in our database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', mockFirebaseUid)
          .single();

        if (existingUser) {
          // User exists, store mock auth and redirect
          localStorage.setItem('dev_firebase_uid', mockFirebaseUid);
          localStorage.setItem('dev_phone_number', `+91${phoneNumber}`);
          router.push('/dashboard');
        } else {
          // New user, store mock auth and show profile form
          localStorage.setItem('dev_firebase_uid', mockFirebaseUid);
          localStorage.setItem('dev_phone_number', `+91${phoneNumber}`);
          setStep('profile');
        }
      } else {
        if (!confirmationResult) return;
        
        const result = await confirmationResult.confirm(otp);
        const user = result.user;

        // Check if user exists in our database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('firebase_uid', user.uid)
          .single();

        if (existingUser) {
          // User exists, redirect to dashboard
          router.push('/dashboard');
        } else {
          // New user, show profile form
          setStep('profile');
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Invalid OTP',
        description: 'Please enter the correct verification code',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!profileData.name || !profileData.city || !profileData.state) {
      toast({
        title: 'Incomplete Profile',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let firebaseUid: string;
      let phoneNum: string;

      if (DEV_MODE) {
        // Dev mode: Use stored mock credentials
        firebaseUid = localStorage.getItem('dev_firebase_uid') || `dev_${phoneNumber}`;
        phoneNum = localStorage.getItem('dev_phone_number') || `+91${phoneNumber}`;
      } else {
        const user = auth.currentUser;
        if (!user) throw new Error('No authenticated user');
        firebaseUid = user.uid;
        phoneNum = user.phoneNumber || '';
      }

      const { error } = await supabase.from('users').insert({
        firebase_uid: firebaseUid,
        phone_number: phoneNum,
        name: profileData.name,
        city: profileData.city,
        state: profileData.state,
        role: profileData.role,
        preferred_language: profileData.preferredLanguage,
        is_verified: true,
        verification_type: 'phone',
        verified_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: 'Welcome to KAIRO!',
        description: 'Your profile has been created successfully',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div id="recaptcha-container" />
      
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 kairo-gradient rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to KAIRO</CardTitle>
            <CardDescription>
              {step === 'phone' && 'Sign in with your phone number'}
              {step === 'otp' && 'Enter the verification code'}
              {step === 'profile' && 'Complete your profile'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 'phone' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex mt-2">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                      +91
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="rounded-l-none"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button onClick={sendOTP} disabled={loading} className="w-full" variant="kairo">
                  {loading ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="mt-2"
                  />
                </div>
                <Button onClick={verifyOTP} disabled={loading} className="w-full" variant="kairo">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button variant="ghost" onClick={() => setStep('phone')} className="w-full">
                  Change Phone Number
                </Button>
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={profileData.state}
                      onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">I am a...</Label>
                  <select
                    id="role"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value as any })}
                    className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="student">Student</option>
                    <option value="worker">Worker</option>
                    <option value="woman">Woman</option>
                    <option value="business">Business Owner</option>
                    <option value="senior_citizen">Senior Citizen</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <select
                    id="language"
                    value={profileData.preferredLanguage}
                    onChange={(e) => setProfileData({ ...profileData, preferredLanguage: e.target.value as any })}
                    className="w-full mt-2 h-10 rounded-md border border-input bg-background px-3"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>
                <Button onClick={createProfile} disabled={loading} className="w-full" variant="kairo">
                  {loading ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
