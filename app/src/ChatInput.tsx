import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Input } from "@/components/ui/input"
import { Field, } from "@/components/ui/field"

export function ChatInput() {
  return (
      <Field>
        <ButtonGroup>
          <Input id="input-button-group" placeholder="Enter your message..." />

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

          <Button variant="outline">Send</Button>
        </ButtonGroup>
      </Field>
  )
}
