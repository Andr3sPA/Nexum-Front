"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Shield, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ROUTES, getDashboardRoute } from "@/lib/routes"

export default function Navbar() {
  const [user] = useState({
    name: "Juan Carlos Pérez",
    email: "juan.perez@udea.edu.co",
    initials: "JP",
    role: "egresado" as "egresado" | "administrativo" | "decano", // Default role is egresado
  })

  const getRoleIcon = () => {
    switch (user.role) {
      case "administrativo":
        return <Shield className="w-3 h-3" />
      case "decano":
        return <GraduationCap className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case "administrativo":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "decano":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href={getDashboardRoute(user.role)} className="flex items-center space-x-2">
              <div className="w-8 h-8 udea-primary rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold udea-primary-text hidden sm:block">UdeA Nexum</span>
              <span className="text-lg font-bold udea-primary-text sm:hidden">UdeA</span>
            </Link>
          </div>

          {/* User Profile Section - Enhanced Design */}
          <div className="flex items-center space-x-3">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>

            {/* Enhanced Profile Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 group"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <AvatarImage src="/placeholder.svg" alt={user.name} />
                      <AvatarFallback className="udea-primary text-white font-semibold text-sm bg-gradient-to-br from-primary via-primary-dark to-primary-light">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Enhanced online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                    {/* Role indicator */}
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="text-gray-600 scale-75">{getRoleIcon()}</div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* Enhanced User info in dropdown - No role display */}
                <div className="flex items-center space-x-3 p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="udea-primary text-white font-semibold">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>

                {/* Only show profile option for egresados */}
                {user.role === "egresado" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.PROFILE} className="cursor-pointer w-full">
                        <User className="mr-3 h-4 w-4" />
                        <span>Mi Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTES.LOGIN}
                    className="cursor-pointer w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
