'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Message } from '@/types'
import { useMessageHandler } from '@/hooks'
import styles from './MessageInput.module.scss'

type MessageInputProps = {
	conversationId?: number
	setMessages: (updater: (prev: Message[]) => Message[]) => void
}

const MessageInput = ({ conversationId, setMessages }: MessageInputProps) => {
	const [input, setInput] = useState('')
	const { sendMessage, loading } = useMessageHandler(conversationId)

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		const message = input.trim()
		if (!message) return

		setInput('')
		setMessages((prev) => [
			...prev,
			{ role: 'user', content: message },
			{ role: 'assistant', content: '...', pending: true },
		])

		await sendMessage(message)
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

export default MessageInput
