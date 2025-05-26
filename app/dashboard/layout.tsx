"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/lib/auth-context"
import { useSidebar } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const { isCollapsed } = useSidebar()
  const router = useRouter()

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-cathedral-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-cathedral-dark">
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-6 transition-all duration-300")}>{children}</main>
    </div>
  )
}
