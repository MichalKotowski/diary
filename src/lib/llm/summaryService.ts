import { prisma } from '@/lib'
import { runOllama } from '@/lib'
import { getConversationHistory } from '@/lib'
import { LLMMessage } from '@/types'

async function extractTags(messages: LLMMessage[]): Promise<string[]> {
	const systemPrompt = {
		role: 'system',
		content: `
      You are an analytical observer summarizing a conversation between a user and an attentive companion.

      Extract **3–5 concise, general tags** that describe the core emotional themes, topics, or intentions present in this conversation.

      Formatting rules:
      - Tags must be lowercase.
      - Use underscores instead of spaces (e.g., "self_reflection", "career_uncertainty").
      - Respond **only** with a comma-separated list of tags, no extra text or explanations.`.trim(),
	}

	const formatted = [
		systemPrompt,
		...messages.map((m) => ({
			role: m.role,
			content: m.content,
		})),
	]

	const output = await runOllama(formatted)

	return output
		.split(/,|\n/)
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean)
}

async function generateSummary(messages: LLMMessage[]): Promise<string> {
	const systemPrompt = {
		role: 'system',
		content: `
      You are an insightful and emotionally grounded summarizer.
      
      Write a clear, human-readable summary of this conversation in **3–5 sentences**.
      Focus on main ideas, emotional undertones, and key realizations.
      Avoid greetings, small talk, and filler.
      Write neutrally and precisely — calm, thoughtful, and emotionally aware, not dramatic.`.trim(),
	}

	const formatted = [
		systemPrompt,
		...messages.map((m) => ({
			role: m.role,
			content: m.content,
		})),
	]

	const summary = await runOllama(formatted)
	return summary.trim()
}

export async function processConversation(conversationId: number) {
	const conversationText = await getConversationHistory(conversationId)

	// 1. Generate summary
	const summaryText = await generateSummary(conversationText)

	// 2. Store summary
	const summary = await prisma.summary.create({
		data: { content: summaryText },
	})

	// 3. Extract tags
	const tagNames = await extractTags(conversationText)

	// 4. Upsert tags and link them to conversation
	const tagRecords = await Promise.all(
		tagNames.map(async (name) => {
			const tag = await prisma.tag.upsert({
				where: { name },
				update: {},
				create: { name },
			})

			return tag
		})
	)

	// 5. Connect everything together
	await prisma.conversation.update({
		where: { id: conversationId },
		data: {
			summary: { connect: { id: summary.id } },
			tags: { set: tagRecords.map((t) => ({ id: t.id })) },
			locked: true,
		},
	})

	return { summary: summaryText, tags: tagNames }
}
