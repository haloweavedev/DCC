// app/api/knowledge/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const knowledge = await prisma.knowledgeBase.create({
      data: {
        title: body.title,
        content: body.content,
        type: body.type,
        sourceUrl: body.sourceUrl,
        addedBy: "demo-admin", // For demo purposes
        isActive: true
      }
    });
    return NextResponse.json(knowledge);
  } catch (error) {
    console.error('Error creating knowledge:', error);
    return NextResponse.json({ error: "Error creating knowledge entry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await prisma.knowledgeBase.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching knowledge:', error);
    return NextResponse.json({ error: "Error fetching knowledge entries" }, { status: 500 });
  }
}