"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError(null)

    try {
      const token = await login(data.email, data.password)
      console.log("Token received:", token)
      if (!token) {
        setError("Credenciais inválidas. Tente novamente.")
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
        })
        return
      }

      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para o dashboard...",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Ocorreu um erro inesperado. Tente novamente mais tarde.")
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      })
    }
  };

  return (
    <Card className="border-gray-600 bg-cathedral-card">
      <CardHeader className=" rounded-t-lg">
        <CardTitle className="text-white">Login</CardTitle>
        <CardDescription className="text-gray-400">Enter your credentials to access the system</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-md text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="shepherd@igreja.com"
              {...register("email")}
              className="text-white"
            />
            {errors.email && <p className="text-sm text-white">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input id="password" type="password" {...register("password")} className="text-white" />
            {errors.password && <p className="text-sm text-white">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entering..." : "Login"}
          </Button>
        </CardContent>
      </form>
      <CardFooter className="flex flex-col items-center text-sm text-gray-400 space-y-2">
        <div className="bg-primary-800/30 p-3 rounded-md w-full">
          <p className="font-medium mb-1">Credenciais de teste:</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium text-xs">ADM:</p>
              <p className="text-xs">ivan@email.com</p>
              <p className="text-xs">123abc</p>
            </div>
            <div>
              <p className="font-medium text-xs">Tesoureiro:</p>
              <p className="text-xs">maria@igreja.com</p>
              <p className="text-xs">maria123</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-white">CATHEDRAL FINANCES</p>
      </CardFooter>
    </Card>
  )
}
