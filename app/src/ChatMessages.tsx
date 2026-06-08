import {
  Card,
  CardContent,
} from "@/components/ui/card"

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

export function Messages() {
  const current_messages= [
    {
      role: 'user',
      content: 'hi',
    },
    {
      role: 'assistant',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
  ] as const
  return (
    <div className="flex flex-col w-full p-10 gap-10">
      {current_messages.map((message, idx) => (
        <MessageBubble
          key={idx}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  )
}
