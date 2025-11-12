export const dynamic = 'force-dynamic' // <- ensures runtime rendering, no ISR caching
export const revalidate = 0

import { Chat } from '@/components'

const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
	const { id } = await params

	return <Chat conversationId={Number(id)} />
}

export default Page
