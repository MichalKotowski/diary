import { useState } from 'react'

export function useSummarizeHandler(conversationId?: number) {
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

      if (!res.ok) return
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const hasSummary = async (): Promise<boolean> => {
    if (!conversationId) return false

    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: 'GET',
      })

      if (!res.ok) return false

      const data = await res.json()
      return !!data.summary
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const getSummary = async (): Promise<string> => {
    if (!conversationId) return ''

    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: 'GET',
      })

      if (!res.ok) return ''

      const data = await res.json()
      return data.summary?.content ?? ''
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  return { summarize, hasSummary, getSummary, loading }
}