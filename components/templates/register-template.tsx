import type { ReactNode } from "react"
import { AuthIllustration } from "@/components/organisms/auth-illustration"

interface RegisterTemplateProps {
  children: ReactNode
}

export default function RegisterTemplate({ children }: RegisterTemplateProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-2/5">
        <AuthIllustration variant="register" />
      </div>

      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-32">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
} 