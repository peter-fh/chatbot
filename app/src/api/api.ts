
export interface FetchedChat {
	id: string,
	title: string,
	summary: string,
	timestamp: string,
}

export async function requestChats(): Promise<FetchedChat[]> {
	const response = await fetch('/api/chats', {})
	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Fetch failed: ${response.status}`)
	}
	return await response.json()
}

export interface FetchedMessage {
	id: string,
	role: 'user' | 'assistant',
	content: string,
	timestamp: string,
}

export async function requestMessages(id: string): Promise<FetchedMessage[]> {
	const response = await fetch(`/api/chats/${id}`, {})
	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Fetch failed: ${response.status}`)
	}
	return await response.json()
}

export interface LLMMessage {
	role: 'assistant' | 'user',
	content: string,
}

export async function* requestMessage(conversation: LLMMessage[]) {
	const response = await fetch(`/api/chat/stream`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({messages: conversation})
	})

	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Fetch failed: ${response.status}`)
	}

	const reader = response.body!.getReader()
	const decoder = new TextDecoder()

	while (true) {
		const { done, value } = await reader.read()
		if (done) break

		const raw = decoder.decode(value)
		const lines = raw.split("\n").filter((l) => l.startsWith("data: "));

		for (const line of lines) {
			const chunk = JSON.parse(line.slice(6))
			if (chunk.done) {
				break
			}
			yield chunk.text
		}
	}
}
