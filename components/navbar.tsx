"use client"

import Link from "next/link"
import { User, LogOut, Shield, GraduationCap } from "lucide-react"
import { Button } from "@/components/atoms/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar"
import { NexumWhiteLogo } from "@/components/atoms/nexum-white-logo"
import { ROUTES, getDashboardRoute } from "@/lib/routes"
import { ROLES } from "@/lib/services/constants/api.constants"
import { LocalStorageService } from "@/lib/services/local-storage.service"
import { useState, useEffect } from "react"

interface NavbarUser {
  firstName?: string;
  firstLastname?: string;
  email?: string;
  role?: string;
  initials?: string;
  [key: string]: any;
}

export default function Navbar({ user }: { user: NavbarUser }) {
  const [email, setEmail] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const userLogin = LocalStorageService.getItem<any>("user")
    setEmail(userLogin?.email || "")
  }, [])

  // Obtener primer nombre y primer apellido del userProfile
  const firstName = user.name?.split(" ")[0] || ""
  const firstLastname = user.lastname?.split(" ")[0] || ""

  const getRoleIcon = () => {
    switch (user.role) {
      case ROLES.ADMINISTRATIVE:
        return <Shield className="w-3 h-3" />
      case ROLES.DEAN:
        return <GraduationCap className="w-3 h-3" />
      default:
        return <User className="w-3 h-3" />
    }
  }

  const getRoleBadgeColor = () => {
    switch (user.role) {
      case ROLES.ADMINISTRATIVE:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case ROLES.DEAN:
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <nav className="border-b bg-[#026937] shadow-lg sticky top-0 z-40">
      <div className="px-6 sm:px-8 lg:px-10">
        <div className="flex items-center h-16">

          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href={getDashboardRoute((user.role || ROLES.GRADUATE) as keyof typeof ROLES)} className="flex items-center space-x-2">
              <NexumWhiteLogo className="w-14 h-14 p-1" />
              <span className="text-xl font-bold text-white hidden sm:block">UdeA Nexum</span>
              <span className="text-lg font-bold text-white sm:hidden">Nexum</span>
            </Link>
          </div>

          {/* User Profile Section - Enhanced Design */}
          <div className="flex items-center space-x-3 ml-auto">
            {/* User Info - Desktop */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-medium text-white">
                {isClient ? `${firstName} ${firstLastname}` : "Cargando..."}
              </span>
              <span className="text-xs text-green-100">
                {isClient ? email : "cargando@email.com"}
              </span>
            </div>

            {/* Enhanced Profile Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-12 w-12 rounded-full border-2 border-transparent hover:border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 group p-0 bg-transparent">
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#026937] via-[#35944b] to-[#43b649] text-white font-semibold text-sm">
                      {String(user.initials || "U")}
                    </AvatarFallback>
                  </Avatar>
                  {/* Enhanced online indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
                  {/* Role indicator */}
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-md">
                    <div className="text-[#026937] scale-75">{getRoleIcon()}</div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {/* Enhanced User info in dropdown - No role display */}
                <div className="flex items-center space-x-3 p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                  <Avatar className="h-12 w-12 ring-2 ring-[#026937]/20">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#026937] via-[#35944b] to-[#43b649] text-white font-semibold">
                      {String(user.initials || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {isClient ? `${firstName} ${firstLastname}` : "Cargando..."}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isClient ? email : "cargando@email.com"}
                    </span>
                  </div>
                </div>

                {/* Show profile option for all users */}
                <DropdownMenuItem>
                  <Link 
                    href={ROUTES.PROFILE}
                    className="cursor-pointer w-full flex items-center"
                  >
                    <User className="mr-3 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Link
                    href={ROUTES.LOGIN}
                    className="cursor-pointer w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
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
