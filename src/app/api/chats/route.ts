import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

// Get all chats
export async function GET() { 
  const chats = await prisma.chat.findMany({
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(chats)
}

// Create a new chat
export async function POST() {
  const chat = await prisma.chat.create({
    data: {
      title: "New Chat",
    },
  })

  return NextResponse.json(chat)
}