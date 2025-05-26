"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSidebar } from "@/lib/sidebar-context"
import { useAuth } from "@/lib/auth-context"

interface DashboardHeaderProps {
  title: string
  description?: string
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  const { toggleSidebar, isCollapsed } = useSidebar()
  const { user } = useAuth()

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-600">
      <div className="flex items-center gap-4">
        {/* Botão de toggle do sidebar para mobile/desktop */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden text-white hover:bg-primary-700/50"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>
      </div>

      {/* Informações do usuário no header (visível quando sidebar está colapsado) */}
      {isCollapsed && (
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="font-medium text-white">{user?.name}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">{user?.churchName}</span>
        </div>
      )}
    </div>
  )
}
