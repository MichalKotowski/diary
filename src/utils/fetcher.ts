export async function fetcher<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })

  if (!res.ok) {
    const message = await safeParseError(res)
    throw new Error(message || `Request failed with status ${res.status}`)
  }

  return res.json() as Promise<T>
}

async function safeParseError(res: Response): Promise<string | undefined> {
  try {
    const data = await res.json()
    return data?.error ?? data?.message
  } catch {
    return undefined
  }
}