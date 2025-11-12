import { setLastChatState } from '@/stores'
import { Message } from '@/types'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'

type useMessageHandlerProps = {
  initialConversationId?: number
  refresh?: () => void
  setMessages?: (updater: (prev: Message[]) => Message[]) => void
}

export const useMessageHandler = ({initialConversationId, refresh, setMessages}: useMessageHandlerProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { mutate } = useSWR('/api/conversations')

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
    // Optimistically add the message locally
    setMessages?.((prev) => [...prev, { role: 'user', content: message }])

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId }),
    })

    setLastChatState(conversationId, [{ role: 'user', content: message }])
    refresh?.()
    if (res.ok && pathname === '/') router.push(`/entry/${conversationId}`)
    return res.ok
  }

  const sendMessage = async (message: string) => {
    setLoading(true)

    try {
      let id = initialConversationId

      if (!id && pathname === '/') {
        id = await createConversation()
        if (!id) return
      }

      if (id) await createMessage(id, message.trim())
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading }
}