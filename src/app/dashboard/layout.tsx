'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Map, MessageSquare, LogOut, Plus, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { usePetitions } from '@/hooks/usePetitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatSignatureCount, getCategoryDisplay, getStatusColor, getStatusDisplay } from '@/lib/utils';

// DEV MODE: Must match login page and useAuth
const DEV_MODE = true;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && !user) {
      router.push('/auth/login');
    }
  }, [user, initializing, router]);

  const handleLogout = async () => {
    if (DEV_MODE) {
      // Dev mode: Clear localStorage
      localStorage.removeItem('dev_firebase_uid');
      localStorage.removeItem('dev_phone_number');
    } else {
      // Production: Sign out from Firebase
      await signOut(auth);
    }
    router.push('/');
  };

  if (initializing || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kairo-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 kairo-gradient rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold kairo-text-gradient">KAIRO</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.city}, {user.state}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <NavLink href="/dashboard" icon={<TrendingUp className="w-5 h-5" />} label="Dashboard" />
            <NavLink href="/dashboard/ai-assistant" icon={<MessageSquare className="w-5 h-5" />} label="AI Rights Assistant" />
            <NavLink href="/dashboard/petitions" icon={<FileText className="w-5 h-5" />} label="My Petitions" />
            <NavLink href="/dashboard/create-petition" icon={<Plus className="w-5 h-5" />} label="Create Petition" />
            <NavLink href="/dashboard/city-map" icon={<Map className="w-5 h-5" />} label="City Issues" />
            <NavLink href="/dashboard/community" icon={<Users className="w-5 h-5" />} label="Community" />
          </aside>

          {/* Main Area */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="text-gray-600">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
