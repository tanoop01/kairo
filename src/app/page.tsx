'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Target, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (!initializing && user) {
      router.push('/dashboard');
    }
  }, [user, initializing, router]);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kairo-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Hero Section */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 kairo-gradient rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold kairo-text-gradient">KAIRO</span>
        </div>
        <Link href="/auth/login">
          <Button variant="kairo">Get Started</Button>
        </Link>
      </nav>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Converting Awareness into 
            <span className="kairo-text-gradient"> Government Action</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            India's first civic operating system that bridges citizens and government 
            accountability. Know your rights, raise your voice, and create real change.
          </p>
          <Link href="/auth/login">
            <Button size="lg" variant="kairo" className="text-lg px-8">
              Start Your Petition <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Know Your Rights"
            description="AI-powered legal assistant in your language"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Build Community"
            description="Connect with fellow citizens on local issues"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Direct Authority"
            description="Send petitions directly to decision-makers"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Track Impact"
            description="See real resolutions and outcomes"
          />
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <StatCard number="10K+" label="Active Citizens" />
          <StatCard number="500+" label="Petitions Created" />
          <StatCard number="150+" label="Issues Resolved" />
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-16">How KAIRO Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard number={1} title="Verify Identity" description="Sign up with your phone number" />
            <StepCard number={2} title="Know Rights" description="Get legal guidance from AI assistant" />
            <StepCard number={3} title="Create Petition" description="AI helps draft your petition" />
            <StepCard number={4} title="Get Action" description="Send to authorities & track resolution" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 kairo-gradient rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Create Change?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Indians taking civic action
          </p>
          <Link href="/auth/login">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Join KAIRO Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 KAIRO - India's Civic Operating System</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-kairo-orange mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <div className="text-4xl font-bold kairo-text-gradient mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg relative">
      <div className="absolute -top-4 left-6 w-8 h-8 kairo-gradient rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
