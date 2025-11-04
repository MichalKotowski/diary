import prisma from "@/lib/prisma"

export async function createConversation(title: string) {
  return prisma.conversation.create({
    data: { title },
  })
}

export async function getConversationHistory(id: number) {
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  })

  // Figure out a good format for the model
  const formatted = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n")

  return formatted
}