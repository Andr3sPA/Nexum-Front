"use client"

import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AcademicProvider } from "@/contexts/academic-context"
import { ProfileProvider } from "@/contexts/profile-context"
import { InnovationTypesProvider } from "@/contexts/innovation-types-context"

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
        <ProfileProvider>
          <InnovationTypesProvider>
            {children}
          </InnovationTypesProvider>
        </ProfileProvider>
      </AcademicProvider>
    </ThemeProvider>
  )
} 