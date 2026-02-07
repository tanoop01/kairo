'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, MapPin, Calendar, TrendingUp, Mail, Share2, 
  CheckCircle, AlertCircle, ArrowLeft, MessageSquare 
} from 'lucide-react';
import { usePetition } from '@/hooks/usePetitions';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  formatDate, 
  formatSignatureCount, 
  getCategoryDisplay, 
  getStatusColor, 
  getStatusDisplay,
  generateMailtoLink 
} from '@/lib/utils';
import { generateAuthorityEmail, suggestAuthorities } from '@/lib/ai';
import Link from 'next/link';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { petition, loading, refetch } = usePetition(params.id as string);

  const [hasSigned, setHasSigned] = useState(false);
  const [signing, setSigning] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateContent, setUpdateContent] = useState('');
  const [suggestedAuthority, setSuggestedAuthority] = useState('');
  const [loadingAuthority, setLoadingAuthority] = useState(false);

  useEffect(() => {
    if (petition && user) {
      checkIfSigned();
    }
  }, [petition, user]);

  const checkIfSigned = async () => {
    if (!petition || !user) return;

    const { data } = await supabase
      .from('signatures')
      .select('id')
      .eq('petition_id', petition.id)
      .eq('user_id', user.id)
      .single();

    setHasSigned(!!data);
  };

  const handleSign = async () => {
    if (!user || !petition) return;

    setSigning(true);
    try {
      const { error } = await supabase.from('signatures').insert({
        petition_id: petition.id,
        user_id: user.id,
        is_verified: user.isVerified,
      });

      if (error) throw error;

      toast({
        title: 'Petition Signed!',
        description: 'Your signature has been added successfully',
      });

      setHasSigned(true);
      await refetch();
    } catch (error: any) {
      console.error('Error signing petition:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign petition',
        variant: 'destructive',
      });
    } finally {
      setSigning(false);
    }
  };

  const handleGetAuthoritySuggestion = async () => {
    if (!petition) return;

    setLoadingAuthority(true);
    try {
      const suggestion = await suggestAuthorities(
        petition.category,
        petition.location.state,
        petition.location.city
      );
      setSuggestedAuthority(suggestion);
    } catch (error) {
      console.error('Error getting authority suggestion:', error);
    } finally {
      setLoadingAuthority(false);
    }
  };

  const handleSendToAuthority = async () => {
    if (!petition) return;

    try {
      const { subject, body } = await generateAuthorityEmail(
        petition.title,
        petition.description,
        petition.signatureCount,
        `${petition.location.city}, ${petition.location.state}`
      );

      // For demo, we'll show the email in a mailto link
      // In production, integrate with actual authority database
      const mailtoLink = generateMailtoLink(
        'authority@example.com', // Replace with actual authority email
        subject,
        body
      );

      window.location.href = mailtoLink;

      // Update petition status
      await supabase
        .from('petitions')
        .update({ 
          sent_to_authority: true, 
          sent_at: new Date().toISOString(),
          status: 'sent_to_authority' 
        })
        .eq('id', petition.id);

      toast({
        title: 'Opening Email Client',
        description: 'Your email client will open with the petition ready to send',
      });

      await refetch();
    } catch (error) {
      console.error('Error preparing email:', error);
      toast({
        title: 'Error',
        description: 'Failed to prepare email',
        variant: 'destructive',
      });
    }
  };

  const handlePostUpdate = async () => {
    if (!user || !petition || !updateContent.trim()) return;

    try {
      const { error } = await supabase.from('petition_updates').insert({
        petition_id: petition.id,
        type: 'progress',
        content: updateContent,
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Update Posted',
        description: 'Your update has been shared with all supporters',
      });

      setUpdateContent('');
      setShowUpdateForm(false);
      await refetch();
    } catch (error) {
      console.error('Error posting update:', error);
      toast({
        title: 'Error',
        description: 'Failed to post update',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kairo-orange" />
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Petition Not Found</h2>
        <Link href="/dashboard">
          <Button variant="kairo">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCreator = user?.id === petition.creatorId;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/petitions">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Petitions
        </Button>
      </Link>

      {/* Header Card */}
      <Card className="border-2 border-kairo-orange">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(petition.status)}`}>
                  {getStatusDisplay(petition.status)}
                </span>
                <span className="text-sm text-gray-600">{getCategoryDisplay(petition.category)}</span>
              </div>
              <CardTitle className="text-3xl mb-2">{petition.title}</CardTitle>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-kairo-orange">
                    {formatSignatureCount(petition.signatureCount)} signatures
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(petition.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {petition.location.city}, {petition.location.state}
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">
              {petition.description}
            </p>
          </div>

          {!hasSigned && !isCreator && (
            <div className="mt-8 pt-8 border-t">
              <Button
                onClick={handleSign}
                disabled={signing}
                size="lg"
                variant="kairo"
                className="w-full md:w-auto"
              >
                {signing ? 'Signing...' : 'Sign This Petition'}
              </Button>
            </div>
          )}

          {hasSigned && !isCreator && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You've signed this petition</span>
              </div>
            </div>
          )}

          {isCreator && (
            <div className="mt-8 pt-8 border-t space-y-4">
              <div className="flex gap-4">
                {!petition.sentToAuthority && petition.signatureCount >= 10 && (
                  <>
                    {!suggestedAuthority ? (
                      <Button
                        onClick={handleGetAuthoritySuggestion}
                        disabled={loadingAuthority}
                        variant="outline"
                      >
                        {loadingAuthority ? 'Finding Authority...' : 'Find Right Authority'}
                      </Button>
                    ) : (
                      <Button onClick={handleSendToAuthority} variant="kairo">
                        <Mail className="w-4 h-4 mr-2" />
                        Send to Authority
                      </Button>
                    )}
                  </>
                )}
                <Button onClick={() => setShowUpdateForm(!showUpdateForm)} variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Post Update
                </Button>
              </div>

              {suggestedAuthority && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Suggested Authority:</h4>
                    <p className="text-sm whitespace-pre-wrap">{suggestedAuthority}</p>
                  </CardContent>
                </Card>
              )}

              {showUpdateForm && (
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="update">Post an Update</Label>
                      <Textarea
                        id="update"
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        placeholder="Share progress, responses, or new developments..."
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handlePostUpdate} variant="kairo">
                        Post Update
                      </Button>
                      <Button onClick={() => setShowUpdateForm(false)} variant="ghost">
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Creator Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Started by</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 kairo-gradient rounded-full flex items-center justify-center text-white font-bold text-xl">
              {petition.creator.name[0]}
            </div>
            <div>
              <div className="font-semibold">{petition.creator.name}</div>
              <div className="text-sm text-gray-600">
                {petition.creator.city}, {petition.creator.state}
                {petition.creator.isVerified && (
                  <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates Timeline */}
      {petition.updates && petition.updates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Updates</CardTitle>
            <CardDescription>Latest developments on this petition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {petition.updates.map((update: any) => (
                <div key={update.id} className="border-l-2 border-kairo-orange pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-kairo-orange uppercase">
                      {update.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(update.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{update.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signatures */}
      <Card>
        <CardHeader>
          <CardTitle>Signatures ({formatSignatureCount(petition.signatureCount)})</CardTitle>
          <CardDescription>People who support this petition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {petition.signatures.slice(0, 12).map((sig: any) => (
              <div key={sig.id} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {sig.user?.name?.[0] || '?'}
                </div>
                <div className="text-sm truncate">{sig.user?.name || 'Anonymous'}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
