import { EventSourceParserStream } from "eventsource-parser/stream";

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

export async function* requestMessage(
	conversation_id: string | null,
	conversation: LLMMessage[]
) : AsyncGenerator<{ text? : string, id? : string}> {
	const response = await fetch(`/api/chat/stream`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			id: conversation_id,
			messages: conversation,
		})
	})

	if (!response.ok) {
		const message = await response.text()
		throw new Error(message || `Fetch failed: ${response.status}`)
	}

	const eventStream = response.body!
	.pipeThrough(new TextDecoderStream())
	.pipeThrough(new EventSourceParserStream());

	for await (const event of eventStream) {
		console.log(event)
		if (event.event === "text") {
			console.log(event.data)
			yield { text: JSON.parse(event.data).text }
		} else if (event.event === "id") {
			yield { id: JSON.parse(event.data).id }
		} else if (event.event === "done") {
			return
		}
	}
}
