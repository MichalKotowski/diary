import { prisma } from "@/lib"

export async function saveTags(conversationId: number, tags: string[]) {
  if (!tags.length) return

  // Deduplicate & normalize
  const uniqueTags = [...new Set(tags.map((t) => t.toLowerCase()))]

  const tagRecords = await Promise.all(
    uniqueTags.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  )

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
    },
  })
}

export async function getTagsByConversation(conversationId: number) {
  return prisma.tag.findMany({
    where: { 
      conversations: {
        some: { 
          id: conversationId 
        }
      } 
    } 
  })
}