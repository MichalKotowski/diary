import { prisma } from "@/lib"
import { runOllama } from "@/lib"
import { getConversationHistory } from "@/lib"

async function extractTags(conversationText: string): Promise<string[]> {
  const prompt = `
    Extract 3–5 concise, general tags summarizing the following conversation.
    Respond with a comma-separated list only.

    Conversation:
    ${conversationText}
  `

  const output = await runOllama(prompt)

  return output
    .split(/,|\n/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
}

async function generateSummary(conversationText: string): Promise<string> {
  const prompt = `
    Summarize this conversation in 3–5 concise sentences.
    Focus on the main ideas and insights, not greetings or small talk.
    
    Conversation:
    ${conversationText}
  `
  const summary = await runOllama(prompt)
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