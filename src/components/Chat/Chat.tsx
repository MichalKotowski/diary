'use client'

import { ConversationLog, ConversationSummary } from '@/components'
import { MessageInput } from '@/components'
import {
	useConversation,
	useMessageHandler,
	useSummarizeHandler,
} from '@/hooks'
import { useEffect, useState } from 'react'
import { Message } from '@/types'
import { getLastChatState } from '@/stores'
import styles from './Chat.module.scss'

type ChatProps = {
	conversationId?: number
}

const Chat = ({ conversationId }: ChatProps) => {
	const { messages, summary, locked, refresh } = useConversation(conversationId)
	const [messagesState, setMessagesState] = useState<Message[]>(() =>
		getLastChatState(conversationId)
	)
	const { summarize, loading: summarizing } = useSummarizeHandler({
		conversationId,
		refresh,
	})
	const { sendMessage, loading: sending } = useMessageHandler({
		initialConversationId: conversationId,
		refresh,
		setMessages: setMessagesState,
	})

	// Sync with SWR whenever conversation updates (after refresh)
	useEffect(() => {
		const updateMessages = () => {
			if (messages) setMessagesState(messages)
		}

		updateMessages()
	}, [messages])

	return (
		<>
			<ConversationLog
				messages={messagesState}
				isLoading={sending}
				isLocked={locked}
			/>
			<MessageInput
				messages={messagesState}
				sendMessage={sendMessage}
				summarize={summarize}
				isLoading={sending || summarizing}
				isLocked={locked}
			/>
			<ConversationSummary summary={summary} />
		</>
	)
}

export default Chat
