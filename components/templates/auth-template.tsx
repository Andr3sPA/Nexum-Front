import type { ReactNode } from "react"
import { AuthIllustration } from "@/components/organisms/auth-illustration"
import Navbar from "@/components/navbar"

interface AuthTemplateProps {
  children: ReactNode
  variant?: "login" | "register"
}

export default function AuthTemplate({ children, variant = "login" }: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Illustration */}
      <div className="hidden lg:block lg:w-3/5">
        <AuthIllustration variant={variant} />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center bg-white px-8 py-12 relative">
        {/* Background decoration for right side */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#026937]/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-[#35944b]/5 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Universidad de Antioquia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
