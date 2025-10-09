import React from "react"
import Navbar from "@/components/navbar"

export interface ReportTemplateProps {
  children: React.ReactNode
  user: {
    firstName: string
    firstLastname: string
    email: string
    role?: string
    initials: string
    [key: string]: any
  }
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({ children, user }) => {
  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto py-6 sm:px-8 lg:px-12">
          <div className="px-0 py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  )
} 