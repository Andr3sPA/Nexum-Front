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
import { UserMenu } from './organisms/user-menu';

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
            <UserMenu
              user={{
                name: user.name ?? '',
                initials: user.initials ?? '',
                email: user.email ?? email,
                firstName,
                firstLastname,
              }}
              isClient={isClient}
              getRoleIcon={getRoleIcon}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
