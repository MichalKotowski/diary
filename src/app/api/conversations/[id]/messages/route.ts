import { prisma } from "@/lib"
import { NextResponse } from "next/server"
import { createMessage } from "@/lib"
import { getConversationHistory } from "@/lib"
import { runOllama } from "@/lib"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const messages = await prisma.message.findMany({
    where: { conversationId: Number(params.id) },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const { conversationId, message } = await req.json()
  if (!message) return NextResponse.json({ error: "Invalid message" }, { status: 400 })

  try {
    // 1. Save user message
    await createMessage({ conversationId, role: "user", content: message })

    // 2. Get full context
    const formattedMessages = await getConversationHistory(conversationId)

    // 3. Run Ollama
    const output = await runOllama(formattedMessages)

    // 4. Save AI message
    await createMessage({ conversationId, role: "assistant", content: output })

    // 5. Return result
    return NextResponse.json({ reply: output })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message", details: error }, { status: 500 })
  }
}
