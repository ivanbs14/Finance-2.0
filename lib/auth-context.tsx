"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { UserRole, users, type User } from "@/lib/data"
import api from "@/services/apiService"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string
  email: string
  role: UserRole
  churchId?: string
  iat: number
  exp: number
  name: string
}

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    console.log(storedUser)
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

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setIsLoading(true);
    console.log("Tentando fazer login com:", email, password);
    
    const response = await api.post("/auth", {
      email,
      password,
    });

    const { token } = response.data;
    console.log("Resposta do login:", response.data);
    if (token) {
      Cookies.set("token", token, { expires: 1 });

      const decoded = jwtDecode<DecodedToken>(token);
      const userWithoutPassword = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        churchId: decoded.churchId,
        name: decoded.name
      };

      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return token;
    }

    return false;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    setIsLoading(false);
    return false;
  } finally {
    setIsLoading(false);
  }
};

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
