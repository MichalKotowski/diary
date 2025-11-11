'use client'

import { ConversationModel } from '@/types'
import Link from 'next/link'
import styles from './Navigation.module.scss'
import useSWR from 'swr'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Navigation = () => {
	const { data: conversations } =
		useSWR<ConversationModel[]>('/api/conversations')
	const pathname = usePathname()
	const [openDate, setOpenDate] = useState<string | null>(null)

	// --- Group by date ---
	const grouped = (conversations ?? []).reduce((acc, conv) => {
		const dateKey = new Date(conv.createdAt).toISOString().split('T')[0] // YYYY-MM-DD
		if (!acc[dateKey]) acc[dateKey] = []
		acc[dateKey].push(conv)
		return acc
	}, {} as Record<string, ConversationModel[]>)

	// --- Sort dates descending ---
	const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1))

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
			{sortedDates.map((date) => {
				const isOpen = openDate === date
				const toggle = () => setOpenDate(isOpen ? null : date)
				const formattedDate = new Date(date).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				})

				return (
					<div key={date} className={styles.navigationGroup}>
						<div
							className={`${styles.groupHeader} ${styles.navigationItem}`}
							onClick={toggle}
						>
							{formattedDate}
						</div>
						{isOpen && (
							<div className={styles.groupItems}>
								{grouped[date].map((conversation) => {
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
							</div>
						)}
					</div>
				)
			})}
		</nav>
	)
}

export default Navigation
