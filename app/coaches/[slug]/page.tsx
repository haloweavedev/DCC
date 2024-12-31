// app/coaches/[slug]/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coach } from "@/types";

const coachDetails: Coach = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Practice Management",
  bio: "15+ years experience helping dental practices optimize their operations and growth strategies.",
  imageUrl: "/coaches/sarah.jpg",
  expertise: ["Team Building", "Financial Planning", "Patient Experience"],
  rating: 4.9,
  totalSessions: 234,
  about: "Dr. Sarah Johnson is a recognized expert in dental practice management with over 15 years of experience. She has helped transform more than 200 dental practices across the country, focusing on operational efficiency, team development, and sustainable growth strategies.",
  approach: "My coaching approach combines data-driven analysis with practical, implementable solutions. I believe in creating customized strategies that align with each practices unique goals and challenges.",
  availability: [
    "Monday: 9 AM - 5 PM EST",
    "Wednesday: 10 AM - 6 PM EST",
    "Friday: 9 AM - 3 PM EST"
  ],
  testimonials: [
    {
      text: "Dr. Johnsons guidance helped us increase our practice revenue by 40% in just one year!",
      author: "Dr. Mark Wilson",
      role: "Practice Owner, Seattle"
    },
    {
      text: "The team building strategies we learned transformed our office culture completely.",
      author: "Dr. Lisa Chen",
      role: "Practice Owner, Chicago"
    }
  ]
};

export default function CoachProfile() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-32 w-32">
              <AvatarImage src={coachDetails.imageUrl} alt={coachDetails.name} />
              <AvatarFallback>{coachDetails.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{coachDetails.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{coachDetails.specialty}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {coachDetails.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg">⭐ {coachDetails.rating}</span>
                <span className="text-lg">{coachDetails.totalSessions} sessions</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto">
                  Schedule Coaching Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Schedule with {coachDetails.name}</DialogTitle>
                  <DialogDescription>
                    Choose a time that works best for your coaching session.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slot1">Tomorrow 10:00 AM</SelectItem>
                        <SelectItem value="slot2">Tomorrow 2:00 PM</SelectItem>
                        <SelectItem value="slot3">Friday 11:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => alert("Booking confirmed! (Demo)")}>
                    Confirm Booking
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - About & Approach */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">About</h2>
                <p className="text-gray-600">{coachDetails.about}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Coaching Approach</h2>
                <p className="text-gray-600">{coachDetails.approach}</p>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Client Testimonials</h2>
                <div className="space-y-6">
                {coachDetails.testimonials?.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-gray-600 italic mb-2">"{testimonial.text}"</p>
                      <p className="text-sm font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Availability & Booking */}
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Availability</h2>
                <ul className="space-y-2">
                {coachDetails.availability?.map((slot, index) => (
                    <li key={index} className="text-gray-600">{slot}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}