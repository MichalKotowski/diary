import { NextResponse } from "next/server"
import { processConversation } from "@/lib"

export async function POST(req: Request) {
  const { conversationId } = await req.json()
  if (isNaN(conversationId)) {
    return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 })
  }

  try {
    const result = await processConversation(conversationId)
    return NextResponse.json({
      success: true,
      message: "Conversation processed successfully",
      summary: result.summary,
      tags: result.tags,
    })
  } catch (error) {
    console.error("Error processing conversation:", error)
    return NextResponse.json({ error: "Failed to process conversation" }, { status: 500 })
  }
}