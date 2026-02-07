import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Petition, PetitionCategory, PetitionStatus } from '@/types';
import { usePetitionStore } from '@/store/petitionStore';

interface UsePetitionsOptions {
  category?: PetitionCategory;
  status?: PetitionStatus;
  city?: string;
  state?: string;
  creatorId?: string;
}

export function usePetitions(options: UsePetitionsOptions = {}) {
  const { petitions, setPetitions, setLoading } = usePetitionStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPetitions();
  }, [options.category, options.status, options.city, options.state, options.creatorId]);

  async function fetchPetitions() {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('petitions')
        .select(`
          *,
          creator:users(*)
        `)
        .order('created_at', { ascending: false });

      if (options.category) {
        query = query.eq('category', options.category);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }
      if (options.city) {
        query = query.eq('city', options.city);
      }
      if (options.state) {
        query = query.eq('state', options.state);
      }
      if (options.creatorId) {
        query = query.eq('creator_id', options.creatorId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const formattedPetitions: Petition[] = (data || []).map(mapPetitionFromDB);
      setPetitions(formattedPetitions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { petitions, loading: usePetitionStore.getState().isLoading, error, refetch: fetchPetitions };
}

export function usePetition(id: string) {
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPetition();
  }, [id]);

  async function fetchPetition() {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('petitions')
        .select(`
          *,
          creator:users(*),
          signatures(*, user:users(*)),
          evidence(*),
          petition_authorities(authority:authorities(*)),
          petition_updates(*, created_by_user:users(*))
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        setPetition(mapPetitionFromDB(data));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { petition, loading, error, refetch: fetchPetition };
}

function mapPetitionFromDB(data: any): Petition {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: {
      latitude: parseFloat(data.location_lat),
      longitude: parseFloat(data.location_lng),
      city: data.city,
      state: data.state,
      address: data.address,
      pincode: data.pincode,
    },
    creatorId: data.creator_id,
    creator: data.creator ? {
      id: data.creator.id,
      phoneNumber: data.creator.phone_number,
      name: data.creator.name,
      city: data.creator.city,
      state: data.creator.state,
      role: data.creator.role,
      preferredLanguage: data.creator.preferred_language,
      isVerified: data.creator.is_verified,
      trustScore: data.creator.trust_score,
      createdAt: new Date(data.creator.created_at),
      updatedAt: new Date(data.creator.updated_at),
    } : {} as any,
    signatures: data.signatures || [],
    signatureCount: data.signature_count,
    evidence: data.evidence || [],
    targetAuthorities: data.petition_authorities?.map((pa: any) => pa.authority) || [],
    status: data.status,
    updates: data.petition_updates || [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    sentToAuthority: data.sent_to_authority,
    sentAt: data.sent_at ? new Date(data.sent_at) : undefined,
    responseReceived: data.response_received,
    resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
    language: data.language,
  };
}
