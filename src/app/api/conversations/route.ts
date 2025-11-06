import { prisma } from "@/lib"
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
export async function POST() {
  try {
    // Get today's date boundaries
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Count how many conversations already exist today
    const countToday = await prisma.conversation.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

     // Generate the title (e.g., "2025-11-06 #4")
    const todayStr = startOfDay.toISOString().split("T")[0]
    const title = `${todayStr} #${countToday + 1}`

    // Create the conversation
    const conversation = await prisma.conversation.create({
      data: { title },
    })

    revalidatePath(`/entry/${conversation.id}`) // pre-warm page path
    revalidatePath(`/entry/${conversation.id}`) // pre-warm page path
    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation", details: error }, { status: 500 })
  }
}