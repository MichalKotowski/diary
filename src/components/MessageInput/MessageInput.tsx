'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Message } from '@/types'
import { useMessageHandler, useSummarizeHandler } from '@/hooks'
import styles from './MessageInput.module.scss'

type MessageInputProps = {
	conversationId?: number
	messages: Message[]
	setMessages: (updater: (prev: Message[]) => Message[]) => void
}

const MessageInput = ({
	conversationId,
	messages,
	setMessages,
}: MessageInputProps) => {
	const [input, setInput] = useState('')
	const [isConversationLocked, setIsConversationLocked] = useState(false)
	const { sendMessage, loading } = useMessageHandler(conversationId)
	const {
		summarize,
		hasSummary,
		loading: summarizing,
	} = useSummarizeHandler(conversationId)

	const isLoading = loading || summarizing

	useEffect(() => {
		const checkIfConversationIsLocked = async () => {
			if (!conversationId) return
			const isLocked = await hasSummary()
			setIsConversationLocked(isLocked)
		}

		checkIfConversationIsLocked()
	}, [conversationId, hasSummary])

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

	const handleSummarize = async () => {
		await summarize()
		setIsConversationLocked(true)
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
				disabled={isConversationLocked}
			/>
			<div className={styles.buttonContainer}>
				<button
					type="button"
					disabled={isLoading || !!!messages.length || isConversationLocked}
					className={styles.button}
					onClick={handleSummarize}
				>
					Summarize
				</button>
				<button
					type="submit"
					disabled={isLoading || !input.trim() || isConversationLocked}
					className={styles.button}
				>
					Send
				</button>
			</div>
		</form>
	)
}

export default MessageInput
