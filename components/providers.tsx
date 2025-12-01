"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AcademicProvider } from "@/contexts/academic-context"
import { ProfileProvider } from "@/contexts/profile-context"
import { InnovationTypesProvider } from "@/contexts/innovation-types-context"
import { AuthProvider } from "@/contexts/auth-context"

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
      <AuthProvider>
        <AcademicProvider>
          <ProfileProvider>
            <InnovationTypesProvider>
            {children}
            </InnovationTypesProvider>
          </ProfileProvider>
        </AcademicProvider>
      </AuthProvider>
    </ThemeProvider>
  )
} 