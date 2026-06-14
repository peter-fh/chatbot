import { useParams } from "react-router"
import { ChatInput } from "./ChatInput"
import { Messages } from "./ChatMessages"
import { ChatSidebar } from "./ChatSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


export function Chat() {
  const { cid } = useParams()
  return (
      <SidebarProvider>
        <ChatSidebar />
        <main>
          <SidebarTrigger />
        </main>
        <div className="flex justify-between items-center h-screen p-10 flex-col w-[100%]">
          <Messages id={cid}/>
          <ChatInput/>
        </div>
      </SidebarProvider>
  )
}
