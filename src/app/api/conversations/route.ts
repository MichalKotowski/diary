import prisma from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Get all conversations
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations", details: error }, { status: 500 })
  }
}

// Create a new conversation
export async function POST(req: Request) {
  const { title } = await req.json()

  try {
    const conversation = await prisma.conversation.create({
      data: {
        title: title || "Untitled",
      },
    })

    revalidatePath(`/entry/${conversation.id}`) // pre-warm page path
    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation", details: error }, { status: 500 })
  }
}