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
import { NavLink, useNavigate } from "react-router"

export function ChatSidebar() {
  const nav = useNavigate()
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
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            Generic Chat Page
          </NavLink>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {titles && titles.map((title, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton 
                  onClick={() => {
                    nav(`/${title.id}`)
                  }}>
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

