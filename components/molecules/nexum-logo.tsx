"use client"

import React from "react"
import { NexumGreenLogo } from "../atoms/nexum-green-logo"
import { NexumWhiteLogo } from "../atoms/nexum-white-logo"
import Link from "next/link"


interface NexumLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "white"
  showText?: boolean
}

export function NexumLogo({ size = "md", variant = "default", showText = true }: NexumLogoProps) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-20 h-20"
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  }

  const colors = {
    default: "text-[#026937]",
    white: "text-white"
  }

  return (
    <Link className="flex items-center space-x-2 hover:cursor-pointer" href="/">
      <div className={`${sizes[size]} ${colors[variant]} flex items-center justify-center`}>
        {variant === "default" ? <NexumGreenLogo className="w-full h-full" /> : <NexumWhiteLogo className="w-full h-full" />}
      </div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} ${colors[variant]} tracking-tight`}>
          Nexum
        </span>
      )}
    </Link>
  )
} 
