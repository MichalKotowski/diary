export type Message = {
	role: 'user' | 'assistant'
	content: string
}

export type ConversationModel = {
	id: string
	title: string
	createdAt: Date
	messages?: Message[]
}

