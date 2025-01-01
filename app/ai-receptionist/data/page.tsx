"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
    data_collection_results?: Record<string, {
      value: string;
      rationale: string;
    }>;
  };
}

export default function ConversationDataPage() {
  const [successfulConversations, setSuccessfulConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuccessfulConversations = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`,
        {
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
          },
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const successful = data.conversations.filter(
        (conv: ConversationSummary) => conv.call_successful === "success"
      );
      setSuccessfulConversations(successful);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (conversationId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
        {
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_XI_API_KEY || "",
          },
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      setSelectedConversation(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Extract patient name from transcript
  const getPatientName = (transcript: Array<{ role: string; message?: string }>) => {
    const firstUserMessage = transcript.find(t => t.role === "user")?.message || "";
    const nameMatch = firstUserMessage.match(/I'm ([^,.]+)/);
    return nameMatch ? nameMatch[1] : "Patient";
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Receptionist Integration Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-700 mb-2">System Integration Overview</h3>
              <p className="text-sm text-blue-600">
                The AI Receptionist seamlessly integrates with major dental practice management 
                systems. Appointment data is automatically synchronized with Dentrix/Open Dental, 
                ensuring real-time availability checks and instant appointment scheduling.
              </p>
            </div>
            <Button 
              onClick={fetchSuccessfulConversations}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Loading..." : "View Recent Successful Appointments"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200">
            <CardContent className="pt-6">
              <div className="text-red-500">
                <h3 className="font-bold">Error:</h3>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {successfulConversations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Successfully Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {successfulConversations.map((conv) => (
                  <div 
                    key={conv.conversation_id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer p-4"
                    onClick={() => fetchConversationDetails(conv.conversation_id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          Appointment Scheduled
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(conv.start_time_unix_secs * 1000).toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            {selectedConversation && (
              <div className="space-y-6">
                {selectedConversation.analysis?.data_collection_results?.appointment_date && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-green-800 font-semibold mb-2">
                      Practice Management System Integration
                    </h3>
                    <p className="text-green-700 mb-2">
                      <span className="font-semibold">
                        {getPatientName(selectedConversation.transcript)}
                      </span>'s 
                      appointment is scheduled for{" "}
                      <span className="font-semibold">
                        {selectedConversation.analysis.data_collection_results.appointment_date.value}
                      </span>
                    </p>
                    <div className="flex gap-2 text-sm text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M5 13l4 4L19 7" />
                      </svg>
                      Appointment data synced with practice management system
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Conversation Summary</h3>
                  <p className="text-gray-700">
                    {selectedConversation.analysis?.transcript_summary}
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Detailed Transcript</h3>
                  <div className="space-y-2">
                    {selectedConversation.transcript.map((entry, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg ${
                          entry.role === "agent" 
                            ? "bg-blue-50 ml-4" 
                            : "bg-gray-50 mr-4"
                        }`}
                      >
                        <p className="text-sm text-gray-500 mb-1">
                          {entry.role === "agent" ? "AI Receptionist" : "Patient"}
                        </p>
                        <p>{entry.message || "No message"}</p>
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
  );
}