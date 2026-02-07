import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

// DEV MODE: Must match login page
const DEV_MODE = true;

export function useAuth() {
  const { user, setUser, setLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        let firebaseUid: string | null = null;

        if (DEV_MODE) {
          // Check dev mode auth first
          firebaseUid = localStorage.getItem('dev_firebase_uid');
        }

        // If not in dev mode or no dev auth, check Firebase
        if (!firebaseUid) {
          const firebaseUser = auth.currentUser;
          if (firebaseUser) {
            firebaseUid = firebaseUser.uid;
          }
        }

        if (firebaseUid) {
          // Fetch user from Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUid)
            .single();

          if (data && !error) {
            const kairoUser: User = {
              id: data.id,
              phoneNumber: data.phone_number,
              name: data.name,
              city: data.city,
              state: data.state,
              role: data.role,
              preferredLanguage: data.preferred_language,
              isVerified: data.is_verified,
              trustScore: data.trust_score,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            };
            setUser(kairoUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    if (DEV_MODE) {
      // In dev mode, load once on mount and listen to storage changes
      loadUser();
      
      const handleStorageChange = () => {
        loadUser();
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    } else {
      // Production: Use Firebase auth state listener
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // Fetch user from Supabase
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebaseUser.uid)
            .single();

          if (data && !error) {
            const kairoUser: User = {
              id: data.id,
              phoneNumber: data.phone_number,
              name: data.name,
              city: data.city,
              state: data.state,
              role: data.role,
              preferredLanguage: data.preferred_language,
              isVerified: data.is_verified,
              trustScore: data.trust_score,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            };
            setUser(kairoUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
        setInitializing(false);
      });

      return () => unsubscribe();
    }
  }, [setUser, setLoading]);

  return { user, initializing };
}
