// app/api/resources/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        content: body.content,
        status: "draft"
      }
    });
    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json({ error: "Error creating resource" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json({ error: "Error fetching resources" }, { status: 500 });
  }
}