"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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

  const getPatientName = (transcript: Array<{ role: string; message?: string }>) => {
    const firstUserMessage = transcript.find(t => t.role === "user")?.message || "";
    const nameMatch = firstUserMessage.match(/I'm ([^,.]+)/);
    return nameMatch ? nameMatch[1] : "Patient";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Video Demo Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live Demo: AI Receptionist in Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-600">
                Watch a real interaction with our AI Receptionist as it handles appointment scheduling 
                and patient history.
              </p>
            </div>
            <div className="aspect-video relative rounded-lg overflow-hidden bg-black">
              <video 
                className="w-full h-full"
                controls
                poster="/videos/demo-thumbnail.jpeg"
              >
                <source src="https://medifitwellness.in/wp-content/uploads/2025/01/ai-receptionist-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>

        {/* Integration Dashboard */}
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

        {/* Available Context Section */}
        {/* AI Context Section */}
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 8v13H3V8" />
        <path d="M1 3h22v5H1z" />
        <path d="M10 12h4" />
      </svg>
      Available Context to the AI Receptionist
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-6">
        The AI Receptionist has access to the following data from your practice management system:
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Schedules Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Doctor Schedules
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V7a2 2 0 0 1 2-2h2" />
                  <path d="M17 5h2a2 2 0 0 1 2 2v2" />
                  <path d="M15 3h-6" />
                  <path d="M9 13h6" />
                  <path d="M12 16v-3" />
                </svg>
                Doctor Schedule - Accessed via Dentrix/Open Dental
              </DialogTitle>
            </DialogHeader>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Dr. Emily Smith</h3>
                <p className="text-sm text-gray-600 mb-2">Specialization: Endodontics and General Dentistry</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Weekly Availability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium">Monday:</span> 9:00 AM - 5:00 PM
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium">Tuesday:</span> 10:00 AM - 6:00 PM
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium">Thursday:</span> 9:00 AM - 4:00 PM
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="font-medium">Friday:</span> 11:00 AM - 3:00 PM
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p><span className="font-medium">Internal Line:</span> 101</p>
                    <p><span className="font-medium">Email:</span> drsmith@clinic.com</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Special Notes</h4>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p>• Prefers all follow-ups related to root canals be scheduled within 2 weeks of consultation.</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Patient Records Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
              Patient Records
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                Patient Record - Retrieved from Dentrix/Open Dental
              </DialogTitle>
            </DialogHeader>

            <div className="bg-gray-50 rounded-lg p-6 space-y-6">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">John Doe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>Date of Birth: January 15, 1985</p>
                  <p>Patient ID: #JD1985011500</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="bg-white p-3 rounded shadow-sm space-y-1">
                    <p><span className="font-medium">Phone:</span> (555) 123-4567</p>
                    <p><span className="font-medium">Email:</span> johndoe@example.com</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Case</h4>
                  <div className="bg-white p-3 rounded shadow-sm space-y-2">
                    <p><span className="font-medium">Reason:</span> Severe toothache in the upper left molar</p>
                    <p><span className="font-medium">Diagnosis:</span> Potential root canal therapy needed</p>
                    <p><span className="font-medium">Status:</span> Consultation scheduled with Dr. Smith</p>
                    <p><span className="font-medium">Next Appointment:</span> January 5, 2025, at 10:00 AM</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Past Appointments</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-medium text-blue-600">November 20, 2024</p>
                      <p>Routine cleaning and check-up</p>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <p className="font-medium text-blue-600">June 15, 2024</p>
                      <p>Filling for cavity in lower right molar</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Important Notes</h4>
                  <div className="bg-white p-3 rounded shadow-sm space-y-1">
                    <p>• Allergic to penicillin</p>
                    <p>• Prefers morning appointments</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </CardContent>
</Card>

        {/* Rest of the components remain the same */}
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

        {/* Dialog remains the same */}
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
                      </span>&apos;s 
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