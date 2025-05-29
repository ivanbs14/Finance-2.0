"use client"

import { DashboardContent } from "@/components/dashboard-content"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/lib/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <DashboardHeader title="Welcome!" description={user?.name || "Management System"} />

      <DashboardContent />
    </div>
  )
}
