import { useState } from 'react'

type useSummarizeHandlerProps = {
  conversationId?: number,
  refresh?: () => void,
}

export function useSummarizeHandler({conversationId, refresh}: useSummarizeHandlerProps) {
  const [loading, setLoading] = useState(false)

  const summarize = async (): Promise<void> => {
    if (!conversationId) return
    setLoading(true)

    try {
      const res = await fetch(`/api/conversations/${conversationId}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      })

      if (res.ok && refresh) refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { summarize, loading }
}