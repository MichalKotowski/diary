import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export const useMessageHandler = (initialConversationId?: number) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const createConversation = async (): Promise<number | undefined> => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Conversation' }),
    })

    if (!res.ok) return
    const { id } = await res.json()
    return id
  }

  const createMessage = async (conversationId: number, message: string) => {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId }),
    })

    if (res.ok) router.push(`/entry/${conversationId}`)
  }

  const sendMessage = async (message: string) => {
    setLoading(true)

    let id = initialConversationId
    if (!id && pathname === '/') {
      id = await createConversation()
      if (!id) return setLoading(false)
    }

    await createMessage(id!, message.trim())
    setLoading(false)
  }

  return { sendMessage, loading }
}