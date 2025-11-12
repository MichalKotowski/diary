'use client'

import { Message } from '@/types'
import styles from './ConversationLog.module.scss'
import { useEffect, useState } from 'react'

type ConversationLogProps = {
	messages?: Message[]
	isLoading?: boolean
	isLocked?: boolean
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

const ConversationLog = ({
	messages,
	isLoading,
	isLocked,
}: ConversationLogProps) => {
	return (
		<div className={styles.messagesContainer}>
			{messages?.map((message, index) => (
				<div key={index} className={styles.message}>
					<p>
						<strong>{message.role === 'user' ? 'You' : 'AI'}:</strong>{' '}
						<span>{message.content}</span>
					</p>
				</div>
			))}
			{messages?.length && isLoading ? (
				<div className={styles.message}>
					<p>
						<strong>AI:</strong> <Dots />
					</p>
				</div>
			) : null}
			{isLocked && (
				<div className={styles.message}>
					<p>Conversation has ended</p>
				</div>
			)}
		</div>
	)
}

export default ConversationLog
