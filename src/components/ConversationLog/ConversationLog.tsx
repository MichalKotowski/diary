'use client'

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
		<div className={styles.messagesContainer}>
			{messages.map((message, index) => (
				<div key={index} className={styles.message}>
					<p>
						<strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
						<span>{message.pending ? <Dots /> : message.content}</span>
					</p>
				</div>
			))}
		</div>
	)
}

export default ConversationLog
