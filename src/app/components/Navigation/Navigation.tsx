'use client'

import { ConversationModel } from '@/app/types/global'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Navigation.module.scss'

const Navigation = () => {
	// fix conversations on updating on new conversation creation
	const [conversations, setConversations] = useState<ConversationModel[]>([])

	useEffect(() => {
		fetch('/api/conversations')
			.then((res) => res.json())
			.then((data) => setConversations(data))
	}, [])

	return (
		<nav className={styles.navigation}>
			<Link key="home" href={'/'}>
				Home
			</Link>
			{conversations.map((conversation) => (
				<Link key={conversation.id} href={`/entry/${conversation.id}`}>
					{conversation.title}
				</Link>
			))}
		</nav>
	)
}

export default Navigation
