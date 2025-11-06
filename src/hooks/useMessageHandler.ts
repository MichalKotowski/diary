import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

export const useMessageHandler = (initialConversationId?: number) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { mutate } = useSWR('/api/conversations') // shared cache key

  const createConversation = async (): Promise<number | undefined> => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) return

    const { id } = await res.json()
    mutate() // refresh conversation list
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

    try {
      let id = initialConversationId

      // Only create new conversation if user is at root
      if (!id && pathname === '/') {
        id = await createConversation()
        if (!id) return
      }

      await createMessage(id!, message.trim())
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}