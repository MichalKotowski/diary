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
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
        },
        summary: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        tags: {
          select: { name: true },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      locked: conversation.locked,
      messages: conversation.messages,
      summary: conversation.summary,
      tags: conversation.tags.map((t) => t.name),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 })
  }
}