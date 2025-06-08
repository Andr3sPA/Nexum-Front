"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  const [user] = useState({
    name: "Juan Carlos Pérez",
    email: "juan.perez@udea.edu.co",
    initials: "JP",
  })

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 udea-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold udea-primary-text hidden sm:block">UdeA Egresados</span>
              <span className="text-lg font-bold udea-primary-text sm:hidden">UdeA</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:udea-primary-text transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:udea-primary-text transition-colors duration-200 font-medium"
            >
              Mi Perfil
            </Link>
          </div>

          {/* User Profile Section - Always Visible */}
          <div className="flex items-center space-x-3">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user.name}</span>
              <span className="text-xs text-gray-500">{user.email}</span>
            </div>

            {/* Profile Avatar - Always Visible */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="udea-primary text-white font-semibold text-sm bg-gradient-to-br from-primary to-primary-dark">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                {/* User info in dropdown - Mobile */}
                <div className="flex items-center space-x-3 p-3 lg:hidden border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback className="udea-primary text-white font-semibold">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>

                {/* Navigation Links - Mobile */}
                <div className="md:hidden border-b">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">
                      <Menu className="mr-3 h-4 w-4" />
                      <span>Inicio</span>
                    </Link>
                  </DropdownMenuItem>
                </div>

                {/* Profile Actions */}
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    <User className="mr-3 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer w-full text-red-600 hover:text-red-700 hover:bg-red-50">
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
