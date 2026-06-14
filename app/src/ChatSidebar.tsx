import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

import { requestChats } from "./api/api.ts"
import type { FetchedChat } from "./api/api.ts"

export function ChatSidebar() {
  const [titles, setTitles] = useState<FetchedChat[]>([])


  useEffect(() => {
    requestChats()
      .then((fetchedTitles) => {
        console.log(fetchedTitles)
        return setTitles(fetchedTitles)
      }
      )
      .catch((err) => console.error(err))
  }, [])
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
      <div className="text-lg font-semibold tracking-tight">
            Generic Chat Pages
      </div>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {titles.map((title, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton>
                  <span>{title.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
