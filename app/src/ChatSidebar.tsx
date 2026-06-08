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

export function ChatSidebar() {
  const titles = [
    "Chat 1",
    "Chat 2",
    "Chat 3",
    "Chat 4",
    "Chat 5",
    "Chat 6",
    "Chat 7",
    "Chat 8",
    "Chat 9"
  ]
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroup>
      <div className="text-lg font-semibold tracking-tight">
            Generic Chat Page
      </div>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {titles.map((title, idx) => (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton>
                  <span>{title}</span>
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
