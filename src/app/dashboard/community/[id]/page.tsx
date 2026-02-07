'use client';

import { useParams } from 'next/navigation';
import { usePetition } from '@/hooks/usePetitions';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, MapPin, Calendar, CheckCircle, Share2, 
  ArrowLeft, AlertCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { 
  formatDate, 
  formatSignatureCount, 
  getCategoryDisplay, 
  getStatusColor, 
  getStatusDisplay 
} from '@/lib/utils';

export default function CommunityPetitionDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { petition, loading, refetch } = usePetition(params.id as string);
  const [hasSigned, setHasSigned] = useState(false);
  const [signing, setSigning] = useState(false);

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
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign petition',
        variant: 'destructive',
      });
    } finally {
      setSigning(false);
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
        <Link href="/dashboard/community">
          <Button variant="kairo">Back to Community</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/dashboard/community">
        <Button variant="ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

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
          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">
              {petition.description}
            </p>
          </div>

          {!hasSigned && user?.id !== petition.creatorId && (
            <div className="pt-8 border-t">
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

          {hasSigned && (
            <div className="pt-8 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">You've signed this petition</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
