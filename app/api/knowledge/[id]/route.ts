import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    // Extract the 'id' parameter from the request URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    await prisma.knowledgeBase.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Knowledge entry deleted" });
  } catch (error) {
    console.error("Error deleting entry:", error);
    return NextResponse.json({ error: "Error deleting entry" }, { status: 500 });
  }
}