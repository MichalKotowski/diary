import { NextResponse } from "next/server"
import { spawn } from "child_process"
import { createMessage } from "@/lib/db/messageEntities"
import { getConversationHistory } from "@/lib/db/conversationEntities"

export async function POST(req: Request) {
  const { conversationId, message } = await req.json()
  if (!message) return NextResponse.json({ error: "Invalid message" }, { status: 400 })

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
}

async function runOllama(formattedMessages: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("ollama", ["run", "mistral"])
    let output = ""

    process.stdin.write(formattedMessages)
    process.stdin.end()

    process.stdout.on("data", (data) => (output += data.toString()))
    process.on("close", () => resolve(output.trim()))
    process.on("error", (err) => reject(err))
  })
}