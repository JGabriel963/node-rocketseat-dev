'use client'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

export interface NavPrimaryProps {
  items: {
    title: string
    to: string
    icon: LucideIcon
  }[]
}

export function NavPrimary({ items }: NavPrimaryProps) {
  // const { isMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            return (
              <SidebarMenuSubItem key={`${item.title}-${index}`}>
                <SidebarMenuButton asChild size="sm">
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
