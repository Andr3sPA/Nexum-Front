import type { ReactNode } from "react"
import { CardHeader, CardTitle } from "@/components/ui/card"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="udea-primary-text">{title}</CardTitle>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {action}
    </CardHeader>
  )
}
