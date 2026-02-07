'use client';

import { usePetitions } from '@/hooks/usePetitions';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, TrendingUp, CheckCircle, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatSignatureCount, getCategoryDisplay, getStatusColor, getStatusDisplay, formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { petitions, loading } = usePetitions({ creatorId: user?.id });
  const { petitions: allPetitions } = usePetitions();

  const myPetitionsCount = petitions.length;
  const totalSignatures = petitions.reduce((sum, p) => sum + p.signatureCount, 0);
  const resolvedCount = petitions.filter(p => p.status === 'resolved').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="kairo-gradient rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-lg opacity-90 mb-6">
          Ready to create change in {user?.city}?
        </p>
        <Link href="/dashboard/create-petition">
          <Button size="lg" variant="secondary">
            <Plus className="w-5 h-5 mr-2" />
            Start a New Petition
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          label="My Petitions"
          value={myPetitionsCount}
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          label="Total Signatures"
          value={formatSignatureCount(totalSignatures)}
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-orange-600" />}
          label="Resolved"
          value={resolvedCount}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          label="Impact Score"
          value={totalSignatures * 10}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <QuickActionCard
          title="AI Rights Assistant"
          description="Get legal guidance in seconds"
          icon={<FileText className="w-8 h-8" />}
          href="/dashboard/ai-assistant"
        />
        <QuickActionCard
          title="City Issues Map"
          description="See what's happening locally"
          icon={<FileText className="w-8 h-8" />}
          href="/dashboard/city-map"
        />
        <QuickActionCard
          title="Browse Petitions"
          description="Support community causes"
          icon={<FileText className="w-8 h-8" />}
          href="/dashboard/community"
        />
      </div>

      {/* My Petitions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Recent Petitions</CardTitle>
              <CardDescription>Track your civic actions</CardDescription>
            </div>
            <Link href="/dashboard/petitions">
              <Button variant="ghost">View All <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : petitions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">You haven't created any petitions yet</p>
              <Link href="/dashboard/create-petition">
                <Button variant="kairo">Create Your First Petition</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {petitions.slice(0, 3).map((petition) => (
                <Link key={petition.id} href={`/dashboard/petitions/${petition.id}`}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{petition.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {petition.description.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatSignatureCount(petition.signatureCount)} signatures</span>
                          <span>•</span>
                          <span>{getCategoryDisplay(petition.category)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(petition.createdAt)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(petition.status)}`}>
                        {getStatusDisplay(petition.status)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Petitions */}
      <Card>
        <CardHeader>
          <CardTitle>Trending in {user?.city}</CardTitle>
          <CardDescription>Popular petitions in your area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allPetitions
              .filter(p => p.location.city === user?.city)
              .slice(0, 3)
              .map((petition) => (
                <Link key={petition.id} href={`/dashboard/community/${petition.id}`}>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-1">{petition.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-medium text-kairo-orange">
                        {formatSignatureCount(petition.signatureCount)} signatures
                      </span>
                      <span>•</span>
                      <span>by {petition.creator.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="opacity-75">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ title, description, icon, href }: any) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="text-kairo-orange mb-4">{icon}</div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
