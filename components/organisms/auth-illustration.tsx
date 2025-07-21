"use client"

import React from "react"
import { GraduationCap, Users, BarChart3, BookOpen, Award, Globe } from "lucide-react"
import { NexumLogo } from "../molecules/nexum-logo"

interface AuthIllustrationProps {
  variant?: "login" | "register"
  showText?: boolean
}

export function AuthIllustration({ variant = "login", showText = true }: AuthIllustrationProps) {
  const icons = [
    { Icon: GraduationCap, color: "bg-white/10" },
    { Icon: Users, color: "bg-white/8" },
    { Icon: BarChart3, color: "bg-white/12" },
    { Icon: BookOpen, color: "bg-white/6" },
    { Icon: Award, color: "bg-white/10" },
    { Icon: Globe, color: "bg-white/8" },
  ]

  return (
    <div className="relative h-full w-full bg-[#026937]">
      {/* Background Pattern - Simple geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white/3 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/4 rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white/2 rounded-full"></div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Nexum Logo - Icon only */}
          <div className="mb-8 flex justify-center">
            <NexumLogo 
              variant="white" 
              size="xl" 
              showText={false}
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {variant === "login" ? "Bienvenido de vuelta" : "Únete a Nexum"}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-lg mb-8">
            {variant === "login" 
              ? "Accede a tu cuenta para continuar" 
              : "Crea tu cuenta para comenzar"
            }
          </p>

          {/* Icon Grid */}
          <div className="grid grid-cols-3 gap-6">
            {icons.map(({ Icon, color }, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 