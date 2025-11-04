'use client'
import { useState } from 'react'
import Container from '@mui/material/Container'
import Chat from './components/Chat/Chat'
import { Message } from './types/global'
import ChatHistory from './components/ChatHistory/ChatHistory'

const Home = () => {
	const [messages, setMessages] = useState<Message[]>([])

	return (
		<main>
			<Container maxWidth="sm">
				<ChatHistory messages={messages} />
				<Chat messages={messages} setMessages={setMessages} />
			</Container>
		</main>
	)
}

export default Home
