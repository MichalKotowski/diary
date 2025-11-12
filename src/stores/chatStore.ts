import { Message } from "@/types";

let lastChatState: { id?: number; messages: Message[] } | null = null

export const setLastChatState = (id: number | undefined, messages: Message[]) => {
  lastChatState = { id, messages }
}

export const getLastChatState = (id?: number) => {
  return lastChatState && lastChatState.id === id ? lastChatState.messages : []
}