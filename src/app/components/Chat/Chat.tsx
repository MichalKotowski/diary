'use client'
import { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styles from './chat.module.scss'

type Message = {
	role: 'user' | 'assistant'
	content: string
}

type ChatProps = {
	messages: Message[]
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const Chat = ({ messages, setMessages }: ChatProps) => {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!input.trim()) return

		const newMessages = [...messages, { role: 'user' as const, content: input }]
		setMessages(newMessages)
		setInput('')
		setLoading(true)

		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: newMessages }),
		})

		const data = await res.json()
		setMessages([...newMessages, { role: 'assistant', content: data.reply }])
		setLoading(false)
	}

	return (
		<Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
			<TextField
				id="text-area"
				label="Prompt"
				multiline
				rows={4}
				placeholder="Ask something..."
				fullWidth
				onChange={(e: ChangeEvent<HTMLInputElement>) =>
					setInput(e?.target?.value)
				}
				value={input}
				onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
			/>
			<Box className={styles.buttonContainer}>
				<Button variant="contained" loading={loading} type="submit">
					Send
				</Button>
			</Box>
		</Box>
	)
}

export default Chat
