'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
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

	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			handleSubmit(event)
		}
	}

	// Write custom ui components for form, textarea and button

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit}
			autoComplete="off"
			noValidate
		>
			<textarea
				id="text-area"
				placeholder="Ask something..."
				rows={4}
				value={input}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				className={styles.textarea}
			/>
			<div className={styles.buttonContainer}>
				<button
					type="submit"
					disabled={loading || !input.trim()}
					className={styles.button}
				>
					Send
				</button>
			</div>
		</form>
	)
}

export default MessageInput
