'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import { Message } from '@/types'
import styles from './MessageInput.module.scss'

type MessageInputProps = {
	messages?: Message[]
	sendMessage: (message: string) => Promise<void>
	summarize: () => Promise<void>
	isLoading: boolean
	isLocked?: boolean
}

const MessageInput = ({
	messages,
	sendMessage,
	summarize,
	isLoading,
	isLocked,
}: MessageInputProps) => {
	const [input, setInput] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		const message = input.trim()
		if (!message) return

		setInput('')

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
				disabled={isLocked}
			/>
			<div className={styles.buttonContainer}>
				<button
					type="button"
					disabled={isLoading || !messages?.length || isLocked}
					className={styles.button}
					onClick={summarize}
				>
					Summarize
				</button>
				<button
					type="submit"
					disabled={isLoading || !input.trim() || isLocked}
					className={styles.button}
				>
					Send
				</button>
			</div>
		</form>
	)
}

export default MessageInput
