"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, GraduationCap, Building2, BookOpen, MapPin } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/molecules/card"
import { Badge } from "@/components/atoms/badge"
import { InfoCard } from "@/components/atoms/info-card"

export interface PostGraduateInfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  studyType: string
  institution: string
  studyName: string
  country: string
  index: number
  color?: "blue" | "green" | "purple" | "orange"
  showEditButton?: boolean
  onEdit?: () => void
}

const PostGraduateInfoCard = React.forwardRef<HTMLDivElement, PostGraduateInfoCardProps>(
  ({ 
    className, 
    studyType, 
    institution, 
    studyName, 
    country,
    index,
    color = "purple",
    showEditButton = false,
    onEdit,
    ...props 
  }, ref) => {
    const getColorClasses = () => {
      switch (color) {
        case "green":
          return {
            border: "border-l-green-500",
            bg: "bg-green-100",
            icon: "text-green-600",
            title: "text-green-700",
            badge: "bg-green-100 text-green-700"
          }
        case "blue":
          return {
            border: "border-l-blue-500",
            bg: "bg-blue-100",
            icon: "text-blue-600",
            title: "text-blue-700",
            badge: "bg-blue-100 text-blue-700"
          }
        case "purple":
          return {
            border: "border-l-purple-500",
            bg: "bg-purple-100",
            icon: "text-purple-600",
            title: "text-purple-700",
            badge: "bg-purple-100 text-purple-700"
          }
        case "orange":
          return {
            border: "border-l-orange-500",
            bg: "bg-orange-100",
            icon: "text-orange-600",
            title: "text-orange-700",
            badge: "bg-orange-100 text-orange-700"
          }
        default:
          return {
            border: "border-l-purple-500",
            bg: "bg-purple-100",
            icon: "text-purple-600",
            title: "text-purple-700",
            badge: "bg-purple-100 text-purple-700"
          }
      }
    }

    const colors = getColorClasses()

    return (
      <Card className={cn("border-l-4", colors.border)} ref={ref} {...props}>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", colors.bg)}>
                <GraduationCap className={cn("h-5 w-5", colors.icon)} />
              </div>
              <div>
                <CardTitle className={cn("text-lg", colors.title)}>
                  Estudio Post Graduación
                </CardTitle>
                <p className="text-sm text-neutral-600">Formación académica avanzada</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={colors.badge}>
                Estudio {index + 1}
              </Badge>
              {showEditButton && onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={BookOpen}
              label="Tipo de Estudio"
              value={studyType}
            />
            
            <InfoCard
              icon={Building2}
              label="Institución"
              value={institution}
            />
            
            <InfoCard
              icon={GraduationCap}
              label="Nombre del Estudio"
              value={studyName}
            />
            
            <InfoCard
              icon={MapPin}
              label="País"
              value={country}
            />
          </div>
        </CardContent>
      </Card>
    )
  }
)
PostGraduateInfoCard.displayName = "PostGraduateInfoCard"

export { PostGraduateInfoCard } 