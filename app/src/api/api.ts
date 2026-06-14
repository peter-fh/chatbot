
export interface FetchedChat {
  id: string,
  title: string,
  summary: string,
}

export async function requestChats(): Promise<FetchedChat[]> {
	const response = await fetch('/chats', {})
	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Fetch failed: ${response.status}`)
	}
	return await response.json()
}
