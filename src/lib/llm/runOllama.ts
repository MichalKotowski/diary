import { LLMMessage } from '@/types'
import { spawn } from 'child_process'

export async function runOllama(messages: LLMMessage[]): Promise<string> {
	return new Promise((resolve, reject) => {
		// Spawn the Ollama CLI
		const process = spawn('ollama', ['run', 'mistral'])

		let output = ''
		let errorOutput = ''

		// Listen for stdout
		process.stdout.on('data', (data) => {
			output += data.toString()
		})

		// Listen for stderr
		process.stderr.on('data', (data) => {
			errorOutput += data.toString()
		})

		// Handle process close
		process.on('close', (code) => {
			if (code === 0) {
				try {
					// Parse JSON output if needed
					const parsed = JSON.parse(output)
					resolve(parsed?.output ?? '') // adjust according to Ollama CLI response
				} catch {
					resolve(output.trim())
				}
			} else {
				reject(new Error(errorOutput || `Ollama exited with code ${code}`))
			}
		})

		process.on('error', (err) => reject(err))

		// Pass the messages as JSON string to stdin
		process.stdin.write(JSON.stringify({ messages }))
		process.stdin.end()
	})
}
