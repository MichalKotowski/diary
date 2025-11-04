import { NextResponse } from "next/server"
import { spawn } from "child_process"

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid messages array" }, { status: 400 })
  }

  // Flatten messages into a chat-style prompt
  const formattedMessages = messages
    .map((msg: { role: string; content: string }) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
    .join("\n") + "\nAssistant:"

  return new Promise((resolve) => {
    const process = spawn("ollama", ["run", "mistral"]);
    let output = "";

    process.stdin.write(formattedMessages);
    process.stdin.end();

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.on("close", () => {
      resolve(NextResponse.json({ reply: output.trim() }));
    });

    process.on("error", (err) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }));
    });
  });
}
