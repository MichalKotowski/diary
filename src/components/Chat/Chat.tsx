'use client'

import { useEffect, useState } from 'react'
import { ConversationLog } from '@/components'
import { MessageInput } from '@/components'
import { Message } from '@/types'
import styles from './Chat.module.scss'

type ChatProps = {
	messages?: Message[]
	conversationId?: number
}

const Chat = ({ messages = [], conversationId }: ChatProps) => {
	const [messagesState, setMessagesState] = useState<Message[]>(messages)

	useEffect(() => {
		setMessagesState(messages)
	}, [messages])

	return (
		<>
			<ConversationLog messages={messagesState} />
			<MessageInput
				setMessages={setMessagesState}
				conversationId={conversationId}
			/>
		</>
	)
}

export default Chat
