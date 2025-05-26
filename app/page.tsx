"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showLoginForm, setShowLoginForm] = useState(false)

  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-cathedral-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-cathedral-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center space-y-2"> 
          {!showLoginForm && (<Image src="/logo.svg" alt="Cathedral Finances Logo" width={300} height={300} />)}
          <h1 className="text-4xl font-bold text-cathedral-gradient">CATHEDRAL FINANCES</h1>
          <p className="text-gray-400 mt-2">Management system for churches</p>
        </div>

        {showLoginForm ? (
          <LoginForm />
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-6">Click the button below:</p>
            <Button size="lg" className="px-8 py-6 text-lg gap-2" onClick={() => setShowLoginForm(true)}>
              <LogIn className="h-5 w-5" />
              Login
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
