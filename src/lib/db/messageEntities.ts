import prisma from "@/lib/prisma"

export async function createMessage({
  conversationId,
  role,
  content,
}: {
  conversationId: number
  role: "user" | "assistant"
  content: string
}) {
  return prisma.message.create({
    data: { conversationId, role, content },
  })
}

export async function getMessagesByConversation(conversationId: number) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  })
}