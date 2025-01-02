"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for demo
const mockResources = [
  {
    id: '1',
    title: 'Front Office Excellence Course',
    type: 'course',
    description: 'Comprehensive training for dental front office staff',
    modules: [
      'Communication Fundamentals',
      'Patient Scheduling',
      'Insurance Handling'
    ],
    status: 'published',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Patient Communication Templates',
    type: 'template',
    description: 'Ready-to-use templates for common patient interactions',
    status: 'published',
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    title: 'Practice Growth Strategy Guide',
    type: 'guide',
    description: 'Step-by-step guide for growing your dental practice',
    status: 'draft',
    createdAt: '2024-01-03'
  }
];

export default function ResourcesPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showModuleDialog, setShowModuleDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Mock API call for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setTitle("");
    setDescription("");
    setType("");
    setUrl("");
    setIsCreating(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Learning Resources</h1>
          <p className="text-gray-600">Manage educational content and materials</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Add New Resource Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
              <CardDescription>
                Create learning materials for dental professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Front Office Training Course"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter resource description..."
                  />
                </div>

                {type === 'video' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video URL</label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <Button type="submit" disabled={isCreating} className="w-full">
                  {isCreating ? "Creating..." : "Create Resource"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resources List */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Library</CardTitle>
              <CardDescription>
                Manage and organize learning materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResources.map((resource) => (
                  <div key={resource.id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{resource.title}</h3>
                          {getStatusBadge(resource.status)}
                        </div>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Manage</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{resource.title}</DialogTitle>
                            <DialogDescription>
                              Type: {resource.type}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {resource.modules ? (
                              <>
                                <h4 className="font-medium">Modules</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {resource.modules.map((module, index) => (
                                    <li key={index} className="text-gray-600">{module}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <p className="text-gray-600">{resource.description}</p>
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline">Edit</Button>
                              <Button>Publish</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Created on {resource.createdAt}
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