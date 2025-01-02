"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Book, MessageCircle, CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";

interface RelevantSource {
  title: string;
  type: string;
  relevance: string;
}

interface LearningCheck {
  question: string;
  options: string[];
}

interface ParsedContent {
  relevantSources?: RelevantSource[];
  response?: string;
  suggestedResources?: string[];
  learningCheck?: LearningCheck;
}

function MessageContent({ content }: { content: string }) {
  try {
    const jsonContent: ParsedContent =
      typeof content === "string" ? JSON.parse(content) : content;

    return (
      <div className="space-y-4">
        {jsonContent.relevantSources && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <Book className="w-4 h-4" />
              Relevant Sources:
            </div>
            {jsonContent.relevantSources.map((source: RelevantSource, idx: number) => (
              <div key={idx} className="ml-6 text-sm">
                <div className="font-medium text-blue-800">
                  {source.title} ({source.type})
                </div>
                <div className="text-blue-600">{source.relevance}</div>
              </div>
            ))}
          </div>
        )}

        {jsonContent.response && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 mt-1 text-gray-500" />
              <div className="prose prose-sm max-w-none">
                {jsonContent.response.split("\n").map((paragraph: string, idx: number) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {jsonContent.suggestedResources && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
              <Lightbulb className="w-4 h-4" />
              Suggested Resources:
            </div>
            <ul className="ml-6 space-y-1">
              {jsonContent.suggestedResources.map((resource: string, idx: number) => (
                <li key={idx} className="text-green-600 text-sm flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> {resource}
                </li>
              ))}
            </ul>
          </div>
        )}

        {jsonContent.learningCheck && (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-700 font-medium mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Quick Learning Check:
            </div>
            <div className="ml-6 space-y-2">
              <p className="text-purple-800 font-medium">{jsonContent.learningCheck.question}</p>
              <div className="space-y-1">
                {jsonContent.learningCheck.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 text-sm rounded-lg hover:bg-purple-100 text-purple-700 transition-colors"
                    onClick={() => {
                      // Handle learning check option click
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch (e) {
    return <div className="prose prose-sm max-w-none">{content}</div>;
  }
}

export default function AIAutoCoaching() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isChecking, setIsChecking] = useState(true);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello ${user?.firstName}! I'm your AI Coach. I can help you with:
        
1. Front Office Management
2. Patient Scheduling
3. Communication Skills

What topic would you like to explore?`,
      },
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
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              AI Coach Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-6 mb-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      m.role === "user"
                        ? "bg-blue-500 text-white ml-4"
                        : "bg-white shadow-sm border mr-4"
                    }`}
                  >
                    {m.role === "user" ? (
                      <div className="prose prose-sm max-w-none text-white">{m.content}</div>
                    ) : (
                      <MessageContent content={m.content} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-4 sticky bottom-0 bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask your AI coach..."
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}