import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { StoreProvider } from "@/lib/store-context"
import { SidebarProvider } from "@/lib/sidebar-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CATHEDRAL FINANCES",
  description: "Sistema de gestão financeira para catedrais e igrejas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-cathedral-dark text-white`}>
        <AuthProvider>
          <StoreProvider>
            <SidebarProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
                {children}
                <Toaster />
              </ThemeProvider>
            </SidebarProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
