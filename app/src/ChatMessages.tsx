import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { useEffect, useState } from "react";
import { requestMessages } from "./api/api";
import type { FetchedMessage } from "./api/api";

export function MessageBubble({ role, content }: {
  role: "user" | "assistant";
  content: string;
}) {
  const isAssistant = role === "assistant";

  return (
    <div className={isAssistant ? "self-start" : "self-end"}>
      <Card
        size="sm"
        className={
          isAssistant
            ? "bg-transparent ring-0 mx-auto w-full"
            : "mx-auto w-full max-w-sm"
        }
      >
        <CardContent>
          <p>{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface MessagesProps {
  id: string | undefined
}

export function Messages(props: MessagesProps) {
  const [currentMessages, setCurrentMessages] = useState<FetchedMessage[]>([])
  useEffect(() => {
    if (props.id) {
      requestMessages(props.id)
        .then(messages => setCurrentMessages(messages))
        .catch(err => console.error(err))
    } else {
      setCurrentMessages([])
    }
  }, [props.id])
  return (
    <div className="flex flex-col w-full p-10 gap-10">
      {currentMessages.map((message, idx) => (
        <MessageBubble
          key={idx}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  )
}
