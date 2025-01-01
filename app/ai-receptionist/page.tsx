"use client";

import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useState } from "react";
import Link from "next/link";

export default function AIReceptionist() {
  const [hasPermission, setHasPermission] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log("Connected"),
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message) => console.log("Message:", message),
    onError: (error) => console.error("Error:", error),
  });

  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      console.error("Failed to get microphone permission:", error);
      setHasPermission(false);
    }
  }, []);

  const startConversation = useCallback(async () => {
    try {
      if (!hasPermission) {
        await requestMicrophonePermission();
      }
      if (!process.env.NEXT_PUBLIC_AGENT_ID) {
        throw new Error("Agent ID is not defined");
      }
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_AGENT_ID,
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }, [conversation, hasPermission, requestMicrophonePermission]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>AI Receptionist</CardTitle>
            <CardDescription>
              Talk to our AI receptionist to schedule appointments, ask questions, or get assistance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button
                    onClick={startConversation}
                    disabled={conversation.status === "connected"}
                    size="lg"
                  >
                    {hasPermission ? "Start Conversation" : "Allow Microphone"}
                  </Button>
                  <Button
                    onClick={stopConversation}
                    disabled={conversation.status !== "connected"}
                    variant="outline"
                    size="lg"
                  >
                    End Conversation
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Status: {conversation.status === "connected" ? "Connected" : "Ready"}
                  </p>
                  {conversation.status === "connected" && (
                    <p className="text-sm text-blue-600">
                      AI is {conversation.isSpeaking ? "speaking" : "listening"}...
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">How it works:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. Click &quot;Allow Microphone&quot; to grant voice access</li>
                  <li>2. Start the conversation with the AI receptionist</li>
                  <li>3. Speak naturally to schedule appointments or ask questions</li>
                  <li>4. The AI will respond with a natural voice</li>
                </ul>
              </div>
            </div>
            <div className="mt-5 flex flex-col items-center gap-4">
            <Link href="/ai-receptionist/data" className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">See Data</Link>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}