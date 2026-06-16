
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
