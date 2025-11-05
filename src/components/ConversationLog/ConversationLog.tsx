'use client'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { Message } from '@/types'
import styles from './ConversationLog.module.scss'
import { useEffect, useState } from 'react'

type ConversationLogProps = {
	messages: Message[]
}

const Dots = () => {
	const [dots, setDots] = useState('.')

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length === 3 ? '.' : prev + '.'))
		}, 500)

		return () => clearInterval(interval)
	}, [])

	return <>{dots}</>
}

const ConversationLog = ({ messages }: ConversationLogProps) => {
	return (
		<Paper variant="outlined" className={styles.messagesContainer}>
			<Box>
				{messages.map((message, index) => (
					<Box
						key={index}
						className={`${styles.message}
									${message.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
					>
						<strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
						{message.pending ? <Dots /> : message.content}
					</Box>
				))}
			</Box>
		</Paper>
	)
}

export default ConversationLog
