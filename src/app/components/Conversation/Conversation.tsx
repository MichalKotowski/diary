'use client'
import { ChangeEvent, FormEvent, useState } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import styles from './Conversation.module.scss'
import { useRouter } from 'next/navigation'

const Conversation = () => {
	const [input, setInput] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleCreateConversation = async (event: FormEvent) => {
		event.preventDefault()

		const title = 'New Conversation'

		const res = await fetch('/api/conversations', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title }),
		})

		if (res.ok) {
			const { id: conversationId } = await res.json()
			return conversationId
		}
	}

	const handleCreateMessage = async (
		event: FormEvent,
		conversationId: number
	) => {
		event.preventDefault()

		const message = input.trim()
		if (!message) return

		setInput('')
		setLoading(true)

		const res = await fetch('/api/message', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, conversationId }),
		})

		if (res.ok) {
			setLoading(false)
			router.push(`/entry/${conversationId}`)
		}
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		const conversationId = await handleCreateConversation(event)
		console.log('Created conversation with ID:', conversationId)
		await handleCreateMessage(event, conversationId)
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

export default Conversation
