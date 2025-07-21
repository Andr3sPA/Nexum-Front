import React from "react"
import Navbar from "@/components/navbar"

export interface DashboardTemplateProps {
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

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ children, user }) => {
  return (
    <>
      {user && <Navbar user={user} />}
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  )
}
