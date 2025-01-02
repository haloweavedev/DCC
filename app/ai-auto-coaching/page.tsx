"use client";

import { useChat } from "ai/react";
import { useState, useEffect } from "react";
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
  correctAnswer?: string;
}

interface ParsedContent {
  relevantSources?: RelevantSource[];
  response?: string;
  suggestedResources?: string[];
  learningCheck?: LearningCheck;
}

// Utility function to parse markdown-style bold text
function parseMarkdownBold(text: string) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      return <strong key={index} className="font-semibold">{content}</strong>;
    }
    return part;
  });
}

function MessageContent({ content }: { content: string }) {
  try {
    const jsonContent: ParsedContent = JSON.parse(content);

    return (
      <div className="space-y-4">
        {jsonContent.relevantSources && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <Book className="w-4 h-4" />
              Relevant Sources in our KnowledgeBase:
            </div>
            {jsonContent.relevantSources.map((source, idx) => (
              <div key={idx} className="ml-6 text-sm">
                <div className="font-medium text-blue-800">
                  {source.title} ({source.type})
                </div>
                <div className="text-blue-600">{parseMarkdownBold(source.relevance)}</div>
              </div>
            ))}
          </div>
        )}

        {jsonContent.response && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 mt-1 text-gray-500" />
              <div className="prose prose-sm max-w-none">
                {jsonContent.response.split("\n").map((paragraph, idx) => (
                  <p key={idx}>{parseMarkdownBold(paragraph)}</p>
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
              {jsonContent.suggestedResources.map((resource, idx) => (
                <li key={idx} className="text-green-600 text-sm flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" /> {parseMarkdownBold(resource)}
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
              <p className="text-purple-800 font-medium">
                {parseMarkdownBold(jsonContent.learningCheck.question)}
              </p>
              <div className="space-y-1">
                {jsonContent.learningCheck.options.map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 text-sm rounded-lg hover:bg-purple-100 text-purple-700 transition-colors"
                  >
                    {parseMarkdownBold(option)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } catch {
    return <div className="prose prose-sm max-w-none">{parseMarkdownBold(content)}</div>;
  }
}

export default function AIAutoCoaching() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }

      setIsChecking(false);
    }

    checkAccess();
  }, [isLoaded, isSignedIn, router]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: JSON.stringify({
          response: `Hello! I'm your AI Coach. I can help you with:\n\n1. Front Office Management\n2. Patient Scheduling\n3. Communication Skills\n\nWhat topic would you like to explore?`,
          suggestedResources: [
            "Front Office Communication Guide",
            "Patient Scheduling Best Practices",
            "Front Office Communication Tips",
          ],
        }),
      },
    ],
  });

  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your AI Coach...</p>
        </div>
      </div>
    );
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