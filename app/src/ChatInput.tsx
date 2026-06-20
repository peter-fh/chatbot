import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Field, } from "@/components/ui/field"
import { useEffect } from "react"

export interface ChatInputProps {
  text: string,
  setText: (s: string) => void,
  onSend: () => void,
}

export function ChatInput(props: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    props.onSend()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Field>
        <ButtonGroup>
          <Input 
            id="input-button-group" 
            placeholder="Enter your message..." 
            value={props.text}
            onChange={((e) => props.setText(e.target.value))}
          />

          <Input
            id="file-upload"
            type="file"
            className="hidden"
          />
          <Button asChild className="rounded-none" variant="outline" type="button">
            <label htmlFor="file-upload">
              Upload File
            </label>
          </Button>

          <Button variant="outline" type="submit">Send</Button>
        </ButtonGroup>
      </Field>
    </form>
  )
}
