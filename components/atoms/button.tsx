"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { colors } from "@/lib/design-system"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "xl"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, type = "button", onClick, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-[#026937] text-white hover:bg-[#35944b] focus:bg-[#35944b] focus-visible:ring-[#026937]",
      secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:bg-neutral-200 focus-visible:ring-neutral-400",
      outline: "border border-neutral-300 bg-transparent hover:bg-neutral-50 focus:bg-neutral-50 focus-visible:ring-neutral-400",
      ghost: "hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:ring-neutral-400",
      destructive: "bg-[#ef434d] text-white hover:bg-red-600 focus:bg-red-600 focus-visible:ring-red-500",
    }
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      xl: "h-12 px-10 text-lg",
    }
    
    const buttonStyles = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("🔘 Button clicked:", { type, variant })
      if (onClick) {
        onClick(e)
      }
    }
    
    if (asChild) {
      return React.cloneElement(props.children as React.ReactElement, {
        className: buttonStyles,
        ref,
        type,
        onClick: handleClick,
        ...props,
      })
    }
    
    return (
      <button
        className={buttonStyles}
        ref={ref}
        type={type}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
