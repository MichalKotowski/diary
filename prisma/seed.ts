import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const conversationData: Prisma.ConversationModel[] = [
  {
    title: "Test #1",
    id: 1,
    createdAt: new Date(),
  },
  {
    title: "Test #2",
    id: 2,
    createdAt: new Date(),
  },
];

export async function main() {
  for (const u of conversationData) {
    await prisma.conversation.create({ data: u });
  }
}

main();