import { spawn } from "child_process"

export async function runOllama(formattedMessages: string): Promise<string> {
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
