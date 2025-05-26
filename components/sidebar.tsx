"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Users,
  ChevronDown,
  LogOut,
  PlusCircle,
  DollarSign,
  Globe,
  Menu,
  X,
  Settings,
  Building,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useSidebar } from "@/lib/sidebar-context"

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  title: string
  isActive: boolean
  isCollapsed?: boolean
}

function SidebarItem({ href, icon, title, isActive, isCollapsed }: SidebarItemProps) {
  return (
    <Link href={href} passHref>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-primary-700/50",
          isActive ? "bg-primary-700/70 text-white" : "text-gray-400",
          isCollapsed && "justify-center",
        )}
        title={isCollapsed ? title : undefined}
      >
        {icon}
        {!isCollapsed && <span>{title}</span>}
      </div>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [formsOpen, setFormsOpen] = useState(true)
  const [adminOpen, setAdminOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Verificar se o usuário é admin ou shepherd para mostrar seção de administração
  const isAdminOrShepherd = user?.role === "admin" || user?.role === "shepherd"

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-gray-600 bg-cathedral-darker transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header com botão de toggle */}
      <div className={cn("p-4 border-b border-gray-600 bg-cathedral-gradient", isCollapsed && "p-2")}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-2xl font-bold text-white">CATHEDRAL</h2>
              <p className="text-sm text-white">FINANCES</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("h-8 w-8 text-white hover:bg-primary-700/50", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2 px-2">
        <nav className="flex flex-col gap-1">
          <SidebarItem
            href="/dashboard"
            icon={<Home className="h-5 w-5" />}
            title="Home"
            isActive={pathname === "/dashboard"}
            isCollapsed={isCollapsed}
          />

          {/* Forms Section */}
          <div className="pt-2">
            {!isCollapsed ? (
              <>
                <button
                  onClick={() => setFormsOpen(!formsOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-400 transition-all hover:bg-primary-700/50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <span>Forms</span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", formsOpen ? "rotate-180" : "")} />
                </button>

                {formsOpen && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-4 border-gray-600">
                    <SidebarItem
                      href="/dashboard/forms/add-record"
                      icon={<PlusCircle className="h-4 w-4" />}
                      title="Add Record"
                      isActive={pathname === "/dashboard/forms/add-record"}
                      isCollapsed={false}
                    />
                    <SidebarItem
                      href="/dashboard/forms/add-expense"
                      icon={<DollarSign className="h-4 w-4" />}
                      title="Add Expense"
                      isActive={pathname === "/dashboard/forms/add-expense"}
                      isCollapsed={false}
                    />
                    <SidebarItem
                      href="/dashboard/forms/add-foreign"
                      icon={<Globe className="h-4 w-4" />}
                      title="Add Foreign"
                      isActive={pathname === "/dashboard/forms/add-foreign"}
                      isCollapsed={false}
                    />
                  </div>
                )}
              </>
            ) : (
              // Versão colapsada - mostrar ícones individuais
              <div className="space-y-1">
                <SidebarItem
                  href="/dashboard/forms/add-record"
                  icon={<PlusCircle className="h-5 w-5" />}
                  title="Add Record"
                  isActive={pathname === "/dashboard/forms/add-record"}
                  isCollapsed={isCollapsed}
                />
                <SidebarItem
                  href="/dashboard/forms/add-expense"
                  icon={<DollarSign className="h-5 w-5" />}
                  title="Add Expense"
                  isActive={pathname === "/dashboard/forms/add-expense"}
                  isCollapsed={isCollapsed}
                />
                <SidebarItem
                  href="/dashboard/forms/add-foreign"
                  icon={<Globe className="h-5 w-5" />}
                  title="Add Foreign"
                  isActive={pathname === "/dashboard/forms/add-foreign"}
                  isCollapsed={isCollapsed}
                />
              </div>
            )}
          </div>

          <SidebarItem
            href="/dashboard/all-givers"
            icon={<Users className="h-5 w-5" />}
            title="All Givers"
            isActive={pathname === "/dashboard/all-givers"}
            isCollapsed={isCollapsed}
          />

          {/* Admin Section - Apenas para admin ou shepherd */}
          {isAdminOrShepherd && (
            <div className="pt-2">
              {!isCollapsed ? (
                <>
                  <button
                    onClick={() => setAdminOpen(!adminOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-400 transition-all hover:bg-primary-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <span>Administration</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", adminOpen ? "rotate-180" : "")} />
                  </button>

                  {adminOpen && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-4 border-gray-600">
                      <SidebarItem
                        href="/dashboard/admin/users"
                        icon={<UserPlus className="h-4 w-4" />}
                        title="Users"
                        isActive={pathname === "/dashboard/admin/users"}
                        isCollapsed={false}
                      />
                      <SidebarItem
                        href="/dashboard/admin/churches"
                        icon={<Building className="h-4 w-4" />}
                        title="Churches"
                        isActive={pathname === "/dashboard/admin/churches"}
                        isCollapsed={false}
                      />
                    </div>
                  )}
                </>
              ) : (
                // Versão colapsada - mostrar ícones individuais
                <div className="space-y-1 pt-2 mt-2 border-t border-gray-600">
                  <SidebarItem
                    href="/dashboard/admin/users"
                    icon={<UserPlus className="h-5 w-5" />}
                    title="Users"
                    isActive={pathname === "/dashboard/admin/users"}
                    isCollapsed={isCollapsed}
                  />
                  <SidebarItem
                    href="/dashboard/admin/churches"
                    icon={<Building className="h-5 w-5" />}
                    title="Churches"
                    isActive={pathname === "/dashboard/admin/churches"}
                    isCollapsed={isCollapsed}
                  />
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Footer com informações do usuário */}
      <div className="border-t p-2 border-gray-600">
        {!isCollapsed && (
          <div className="mb-4 px-2 py-3">
            <p className="text-sm font-medium truncate text-white">{user?.name || "Usuário"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
          </div>
        )}
        <Button
          variant="default"
          className={cn(
            "w-full gap-2 border-gray-600 bg-secondary hover:bg-secondary-700 text-white",
            isCollapsed ? "px-2" : "justify-start",
          )}
          onClick={handleLogout}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
