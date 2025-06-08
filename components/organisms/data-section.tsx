import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/molecules/section-header"

interface DataSectionProps {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function DataSection({ title, subtitle, action, children }: DataSectionProps) {
  return (
    <Card>
      <SectionHeader title={title} subtitle={subtitle} action={action} />
      <CardContent>{children}</CardContent>
    </Card>
  )
}
