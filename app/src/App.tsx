import { ChatInput } from "./ChatInput"
import { Messages } from "./ChatMessages"
import { ChatSidebar } from "./ChatSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export function App() {
  return (
    <SidebarProvider>
        <ChatSidebar />
        <main>
          <SidebarTrigger />
        </main>
      <div className="flex justify-between items-center h-screen p-10 flex-col">
        <Messages/>
        <ChatInput/>
      </div>
    </SidebarProvider>
  )
}

export default App
