"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AcademicProvider } from "@/contexts/academic-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AcademicProvider>
        {children}
      </AcademicProvider>
    </ThemeProvider>
  )
} 