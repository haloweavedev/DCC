// app/api/knowledge/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    await prisma.knowledgeBase.delete({
      where: {
        id: id
      }
    });

    return NextResponse.json({ message: "Knowledge entry deleted" });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ error: "Error deleting entry" }, { status: 500 });
  }
}