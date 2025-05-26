"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { users, type User } from "@/lib/data"

// Remover a senha do tipo User para o usuário autenticado
type AuthenticatedUser = Omit<User, "password">

interface AuthContextType {
  user: AuthenticatedUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se há um usuário salvo no localStorage ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Erro ao carregar usuário do localStorage:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Função de login simulada
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simular um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Verificar credenciais
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      // Criar uma versão do usuário sem a senha
      const { password: _, ...userWithoutPassword } = foundUser

      // Salvar no estado e no localStorage
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Função de logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
