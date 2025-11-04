'use client'

import { useState } from 'react'
import Container from '@mui/material/Container'
import Conversation from './components/Conversation/Conversation'
import { Message } from './types/global'
import ConversationLog from './components/ConversationLog/ConversationLog'

const Home = () => {
	const [messages, setMessages] = useState<Message[]>([])

	return (
		<main>
			<Container maxWidth="sm">
				<ConversationLog messages={messages} />
				<Conversation />
			</Container>
		</main>
	)
}

export default Home
