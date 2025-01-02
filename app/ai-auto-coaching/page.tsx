// app/ai-auto-coaching/page.tsx
'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { SubscriptionTier } from '@/types';

async function checkUserSubscription(userId: string): Promise<SubscriptionTier> {
  // Mock function - in reality, this would fetch from your database
  return 'premium';
}

export default function AIAutoCoaching() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded || !isSignedIn || !user) {
        router.push('/sign-in');
        return;
      }

      const subscription = await checkUserSubscription(user.id);
      if (subscription !== 'premium') {
        router.push('/dashboard');
        return;
      }

      setIsChecking(false);
    }

    checkAccess();
  }, [isLoaded, isSignedIn, user, router]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${user?.firstName}! I'm your AI Coach. I can help you with:
        
1. Front Office Management
2. Patient Scheduling
3. Communication Skills

What topic would you like to explore?`
      }
    ],
  });

  if (!isLoaded || isChecking) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      m.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask your AI coach..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}