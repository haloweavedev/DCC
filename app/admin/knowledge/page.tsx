"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KnowledgeBase } from "@/types";

export default function KnowledgeBasePage() {
  // Move state inside component
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeBase[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Fetch function to get the knowledge entries
  const fetchKnowledge = async () => {
    try {
      const response = await fetch('/api/knowledge');
      if (!response.ok) throw new Error('Failed to fetch knowledge');
      const data = await response.json();
      setKnowledgeEntries(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch knowledge entries on component load
  useEffect(() => {
    fetchKnowledge();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          type,
          sourceUrl: type === 'youtube' ? sourceUrl : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to add knowledge');

      // Refresh the knowledge list after adding
      await fetchKnowledge();

      // Reset the form
      setTitle("");
      setContent("");
      setType("");
      setSourceUrl("");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete of knowledge entry
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/knowledge/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete entry');
        
        // Refresh the list after deletion
        await fetchKnowledge();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Knowledge Base Management</h1>
          <p className="text-gray-600">Add and manage content for the AI assistant</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Add New Knowledge Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Knowledge</CardTitle>
              <CardDescription>
                Add content that will be used by the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Front Office Best Practices"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="youtube">YouTube Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === 'youtube' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">YouTube URL</label>
                    <Input
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                    <label className="text-sm font-medium">Video Transcript/Content</label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter video transcript or key points..."
                    />
                  </div>
                ) : type === 'document' ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Document</label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => console.log(e.target.files)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter knowledge base content..."
                    />
                  </div>
                )}

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? "Processing..." : "Add to Knowledge Base"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Knowledge List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Knowledge</CardTitle>
              <CardDescription>
                Previously added knowledge base entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {knowledgeEntries.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{entry.title}</h3>
                        <p className="text-sm text-gray-500">Type: {entry.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Added by {entry.addedBy} on {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}