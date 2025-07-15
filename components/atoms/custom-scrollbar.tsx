"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface CustomScrollbarProps {
  children: React.ReactNode
  className?: string
  maxHeight?: string
  variant?: "default" | "modal" | "thin"
}

export function CustomScrollbar({ 
  children, 
  className, 
  maxHeight = "max-h-full",
  variant = "default" 
}: CustomScrollbarProps) {
  const scrollbarClass = variant === "modal" ? "modal-scrollbar" : "custom-scrollbar"
  
  return (
    <div 
      className={cn(
        "overflow-y-auto",
        scrollbarClass,
        maxHeight,
        className
      )}
    >
      {children}
    </div>
  )
} 