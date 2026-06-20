import { useParams } from "react-router"
import { ChatInput } from "./ChatInput"
import { Messages } from "./ChatMessages"
import { ChatSidebar } from "./ChatSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { requestMessage, requestMessages, type LLMMessage } from "./api/api"
import { useEffect, useState, useRef } from "react"


export function Chat() {
  const { cid } = useParams()
  const [messages, setMessages] = useState<LLMMessage[]>([])
  const [userInput, setUserInput] = useState<string>("")
  const isSending = useRef(false)

  const onSend = async () => {
    if (!userInput || isSending.current) {
      return
    }
    const currentInput = userInput
    isSending.current = true
    setUserInput("")

    try {
    const updatedMessages = [...messages, { role: "user" as const, content: currentInput }]
    const stream = requestMessage(null, updatedMessages)
    setMessages(updatedMessages)
    setMessages(prev => [...prev, { role: "assistant", content: "" }])

    for await (const chunk of stream) {
      if (chunk.id) {
        console.log("got id: ", chunk.id)
      } 
      else if (chunk.text) {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk.text },
          ]
        })
      }
    }
    } finally {
      isSending.current = false
    }
  }

  useEffect(() => {
    if (cid) {
      requestMessages(cid)
        .then(messages => setMessages(messages))
        .catch(err => console.error(err))
    } else {
      setMessages([])
    }
  }, [cid])

  return (
    <SidebarProvider>
      <ChatSidebar />
      <main>
        <SidebarTrigger />
      </main>
      <div className="flex justify-between items-center h-screen p-10 flex-col w-[100%]">
        <Messages messages={messages}/>
        <ChatInput text={userInput} setText={setUserInput} onSend={onSend}/>
      </div>
    </SidebarProvider>
  )
}
