import { Conversation } from '@/types'
import { fetcher } from '@/utils'
import useSWR from 'swr'

export const useConversation = (conversationId?: number) => {
	const key = conversationId ? `/api/conversations/${conversationId}` : null
	const { data, error, mutate, isLoading } = useSWR<Conversation>(key, fetcher)

	return {
		messages: data?.messages,
		locked: data?.locked,
		isLoading,
		isError: error,
		refresh: mutate,
		hasSummary: !!data?.summary,
		summary: data?.summary?.content ?? '',
		tags: data?.tags ?? [],
	}
}
