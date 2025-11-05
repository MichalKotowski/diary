export type Message = {
	// Temporarily set role to string to match prisma schema
	role: 'user' | 'assistant' | string
	content: string
	id?: number
	pending?: boolean
}

export type ConversationModel = {
	id: string
	title: string
	createdAt: Date
	messages?: Message[]
}

