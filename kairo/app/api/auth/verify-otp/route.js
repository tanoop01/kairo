import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createToken, createUserPayload } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, otp } = body;

    // Validation
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Check hardcoded OTP from environment variable
    const HARDCODED_OTP = process.env.HARDCODED_OTP || '123456';
    
    if (otp !== HARDCODED_OTP) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Mark phone as verified
    user.profile.isPhoneVerified = true;
    user.lastLoginAt = new Date();
    await user.save();

    // Create JWT token
    const userPayload = createUserPayload(user);
    const token = createToken(userPayload);

    return NextResponse.json(
      {
        message: 'Phone number verified successfully!',
        token,
        user: userPayload,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}