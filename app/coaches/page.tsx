"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coach } from "@/types";
import Link from "next/link";
import { useState } from "react";

// Dummy coach data
const coaches = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Practice Management",
    bio: "15+ years experience helping dental practices optimize their operations and growth strategies.",
    imageUrl: "/coaches/sarah.jpg",
    expertise: ["Team Building", "Financial Planning", "Patient Experience"],
    rating: 4.9,
    totalSessions: 234
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Front Office Excellence",
    bio: "Expert in modernizing front office operations and implementing efficient systems.",
    imageUrl: "/coaches/michael.jpg",
    expertise: ["Patient Communication", "Scheduling Optimization", "Technology Integration"],
    rating: 4.8,
    totalSessions: 189
  },
  {
    id: 3,
    name: "Dr. Alicia Gomez",
    specialty: "Practice Management",
    bio: "Former private practice owner who now specializes in guiding new dentists through startup challenges.",
    imageUrl: "/coaches/alicia.jpg",
    expertise: ["Branding", "Hiring & Onboarding", "Software Selection"],
    rating: 4.7,
    totalSessions: 150
  },
  {
    id: 4,
    name: "Dr. Ben Thompson",
    specialty: "Front Office Excellence",
    bio: "Known for transforming chaotic front offices into well-oiled machines, improving patient satisfaction.",
    imageUrl: "/coaches/ben.jpg",
    expertise: ["Phone Etiquette", "Appointment Flow", "Insurance Verification"],
    rating: 4.6,
    totalSessions: 212
  },
  {
    id: 5,
    name: "Dr. Priya Patel",
    specialty: "Practice Management",
    bio: "Helps clinics scale by analyzing key KPIs and implementing effective systems for sustainable growth.",
    imageUrl: "/coaches/priya.jpg",
    expertise: ["Financial Analysis", "Growth Strategy", "Patient Retention"],
    rating: 4.9,
    totalSessions: 310
  },
  {
    id: 6,
    name: "Dr. Matthew Lee",
    specialty: "Front Office Excellence",
    bio: "Focuses on integrating technology into the front office to streamline patient scheduling and billing.",
    imageUrl: "/coaches/matthew.jpg",
    expertise: ["Tech Integration", "EHR Optimization", "Online Booking"],
    rating: 4.5,
    totalSessions: 98
  },
  {
    id: 7,
    name: "Dr. Emily Rodgers",
    specialty: "Practice Management",
    bio: "Specializes in team leadership and building a positive culture that retains top talent.",
    imageUrl: "/coaches/emily.jpg",
    expertise: ["Leadership", "Culture Building", "Staff Training"],
    rating: 4.8,
    totalSessions: 275
  },
  {
    id: 8,
    name: "Dr. Carlos Navarro",
    specialty: "Practice Management",
    bio: "Expert in creating patient-centric workflows that boost satisfaction and drive word-of-mouth referrals.",
    imageUrl: "/coaches/carlos.jpg",
    expertise: ["Patient Experience", "Workflow Efficiency", "Referral Strategies"],
    rating: 4.7,
    totalSessions: 187
  },
  {
    id: 9,
    name: "Dr. Olivia Brooks",
    specialty: "Front Office Excellence",
    bio: "Passionate about customer service best practices and front-desk communication protocols.",
    imageUrl: "/coaches/olivia.jpg",
    expertise: ["Customer Service", "Front-Desk Protocol", "Conflict Resolution"],
    rating: 4.6,
    totalSessions: 120
  }
];

export default function CoachesDirectory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
  
    const filteredCoaches = coaches.filter((coach) => {
      const matchesSearch =
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = !selectedSpecialty || coach.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  
    const BookingDialog = ({ coach }: { coach: Coach }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Schedule Coaching</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule with {coach.name}</DialogTitle>
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
    );
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl font-bold">Find Your Perfect Coach</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search coaches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="max-w-[200px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="Practice Management">Practice Management</SelectItem>
                  <SelectItem value="Front Office Excellence">Front Office Excellence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
  
          {/* Coaches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <Link href="/coaches/dr-sarah-johnson" key={coach.id} className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={coach.imageUrl} alt={coach.name} />
                      <AvatarFallback>
                        {coach.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{coach.name}</CardTitle>
                      <CardDescription>{coach.specialty}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{coach.bio}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {coach.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">⭐ {coach.rating}</span>
                      <span className="text-sm text-gray-600">{coach.totalSessions} sessions</span>
                    </div>
                    <BookingDialog coach={coach} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }