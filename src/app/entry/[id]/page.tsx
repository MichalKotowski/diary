export const dynamic = 'force-dynamic' // <- ensures runtime rendering, no ISR caching
export const revalidate = 0

import { prisma } from '@/lib'
import Container from '@mui/material/Container'
import { notFound } from 'next/navigation'
import { Chat } from '@/components'

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
	const { id } = await params

	const entry = await prisma.conversation.findUnique({
		where: { id: Number(id) },
		include: { messages: true },
	})

	if (!entry) return notFound()

	return <Chat messages={entry.messages} conversationId={Number(id)} />
}

export default Page
