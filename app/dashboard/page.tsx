// app/dashboard/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscriptionTier } from "@/types";

async function getUserSubscription(userId: string): Promise<SubscriptionTier> {
  // Mock function - in reality, this would fetch from your database
  console.log(`Fetching subscription for user ID: ${userId}`);
  return 'premium';
}

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Not signed in</div>;
  }

  // Mock subscription - in reality, fetch this from your database
  const subscriptionTier = await getUserSubscription(user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Welcome, {user.firstName}</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Plan:</span>
                  <span className="capitalize">{subscriptionTier}</span>
                </div>
                {subscriptionTier === 'free' && (
                  <Button>Upgrade to Premium</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Auto-Coaching Access */}
          <Card>
            <CardHeader>
              <CardTitle>AI Auto-Coaching</CardTitle>
              <CardDescription>24/7 AI-powered coaching assistance</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptionTier === 'premium' ? (
                <Link href="/ai-auto-coaching">
                  <Button className="w-full">Access AI Coach</Button>
                </Link>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-gray-600">Upgrade to access AI coaching</p>
                  <Button variant="outline">Upgrade Now</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}