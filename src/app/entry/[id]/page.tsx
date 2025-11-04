export const dynamic = 'force-dynamic' // <- ensures runtime rendering, no ISR caching
export const revalidate = 0

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
	const { id } = await params

	const entry = await prisma.conversation.findUnique({
		where: { id: Number(id) },
		include: { messages: true },
	})

	console.log(entry)

	if (!entry) return notFound()

	return (
		<div>
			{entry.messages.map((message) => (
				<li key={message.id}>{message.content}</li>
			))}
		</div>
	)
}

export default Page
