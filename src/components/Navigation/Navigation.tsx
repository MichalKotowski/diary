'use client'

import { ConversationModel } from '@/types'
import Link from 'next/link'
import styles from './Navigation.module.scss'
import useSWR from 'swr'
import { usePathname } from 'next/navigation'

const Navigation = () => {
	const { data: conversations } =
		useSWR<ConversationModel[]>('/api/conversations')
	const pathname = usePathname()

	return (
		<nav className={styles.navigation}>
			<Link
				key="home"
				href={'/'}
				className={`${styles.navigationItem} ${
					pathname === '/' ? styles.active : ''
				}`}
			>
				New chat
			</Link>
			{conversations?.map((conversation) => {
				const href = `/entry/${conversation.id}`
				const isActive = pathname === href
				return (
					<Link
						key={conversation.id}
						href={href}
						className={`${styles.navigationItem} ${
							isActive ? styles.active : ''
						}`}
					>
						{conversation.title}
					</Link>
				)
			})}
		</nav>
	)
}

export default Navigation
