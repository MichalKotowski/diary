import { NextResponse } from "next/server"
import { prisma } from "@/lib"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const conversationId = Number(id)
  if (isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
  }
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        summary: true,
        tags: true,
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: conversation.id,
      summary: conversation.summary,
      tags: conversation.tags.map((t) => t.name),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
  }
}