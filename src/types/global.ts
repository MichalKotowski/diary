export type Message = {
	id?: number
	role: string
	content: string
	createdAt?: string // ISO string from JSON
}

export type Summary = {
	id: number
	content: string
	createdAt: string
} | null

export type Conversation = {
	id: number
	title: string
	createdAt: string
	locked: boolean
	messages: Message[]
	summary: Summary
	tags: string[]
}

export type LLMMessage = {
	role: string
	content: string
}
