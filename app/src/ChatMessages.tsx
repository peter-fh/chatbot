import {
  Card,
  CardContent,
} from "@/components/ui/card"

import type { LLMMessage } from "./api/api";

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
  messages: LLMMessage[]
}

export function Messages(props: MessagesProps) {
  return (
    <div className="flex flex-col w-full p-10 gap-10">
      {props.messages.map((message, idx) => (
        <MessageBubble
          key={idx}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  )
}
