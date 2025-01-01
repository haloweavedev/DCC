"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConversationSummary {
  conversation_id: string;
  start_time_unix_secs: number;
  call_duration_secs: number;
  status: string;
  call_successful: string;
  message_count: number;
}

interface ConversationDetails {
  transcript: Array<{
    role: string;
    message?: string;
    time_in_call_secs: number;
  }>;
  analysis?: {
    transcript_summary?: string;
    data_collection_results?: Record<string, any>;
  };
}

export default function DebugConversationPage() {
  const [successfulConversations, setSuccessfulConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuccessfulConversations = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log("Fetching conversations...");
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`,
        {
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const successful = data.conversations.filter(
        (conv: ConversationSummary) => conv.call_successful === "success"
      );
      setSuccessfulConversations(successful);
      console.log("Successful conversations:", successful);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      setLoading(true);
      console.log("Fetching conversation details:", conversationId);
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Conversation details:", data);
      setSelectedConversation(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div>
                  <Button 
                    onClick={fetchSuccessfulConversations}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Fetch Successful Conversations"}
                  </Button>
                </div>

                {error && (
                  <div className="text-red-500 bg-red-50 p-4 rounded">
                    <h3 className="font-bold">Error:</h3>
                    <p>{error}</p>
                  </div>
                )}

                {successfulConversations.length > 0 && (
                  <div>
                    <h3 className="font-bold mb-2">Successful Conversations:</h3>
                    <div className="space-y-2">
                      {successfulConversations.map((conv) => (
                        <div 
                          key={conv.conversation_id}
                          className="p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
                          onClick={() => fetchConversationDetails(conv.conversation_id)}
                        >
                          <p>ID: {conv.conversation_id}</p>
                          <p>Duration: {conv.call_duration_secs}s</p>
                          <p>Messages: {conv.message_count}</p>
                          <p>Time: {new Date(conv.start_time_unix_secs * 1000).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Conversation Details</DialogTitle>
                    </DialogHeader>
                    {selectedConversation && (
                      <div className="space-y-4">
                        {selectedConversation.analysis?.transcript_summary && (
                          <div>
                            <h3 className="font-bold">Summary:</h3>
                            <p className="bg-gray-50 p-2 rounded">
                              {selectedConversation.analysis.transcript_summary}
                            </p>
                          </div>
                        )}
                        
                        {selectedConversation.analysis?.data_collection_results && (
                          <div>
                            <h3 className="font-bold">Data Collection Results:</h3>
                            <pre className="bg-gray-50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(selectedConversation.analysis.data_collection_results, null, 2)}
                            </pre>
                          </div>
                        )}

                        <div>
                          <h3 className="font-bold">Transcript:</h3>
                          <div className="space-y-2">
                            {selectedConversation.transcript.map((entry, index) => (
                              <div 
                                key={index}
                                className={`p-2 rounded ${
                                  entry.role === "agent" ? "bg-blue-50" : "bg-gray-50"
                                }`}
                              >
                                <p className="font-semibold">{entry.role}</p>
                                <p>{entry.message || "No message"}</p>
                                <p className="text-sm text-gray-500">
                                  Time: {entry.time_in_call_secs}s
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}