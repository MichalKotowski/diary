'use client'

import { useState, useEffect } from 'react'
import { useSummarizeHandler } from '@/hooks'

type ConversationSummaryProps = {
	conversationId?: number
}

const ConversationSummary = ({ conversationId }: ConversationSummaryProps) => {
	const [summary, setSummary] = useState('')
	const { getSummary, hasSummary } = useSummarizeHandler(conversationId)

	// On mount, check if conversation has a summary
	useEffect(() => {
		if (!conversationId) return

		const fetchSummaryStatus = async () => {
			const isLocked = await hasSummary()

			if (isLocked) {
				const text = await getSummary()
				setSummary(text)
			}
		}

		fetchSummaryStatus()
	}, [conversationId, hasSummary, getSummary])

	if (!conversationId) return null

	return (
		<div>
			<h3>Summary</h3>
			<p>{summary}</p>
		</div>
	)
}

export default ConversationSummary
