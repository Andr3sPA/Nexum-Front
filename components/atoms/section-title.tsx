import type { ReactNode } from "react"

interface SectionTitleProps {
  children: ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="text-lg font-semibold udea-primary-text">{children}</h3>
}
