"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  children: React.ReactNode
}

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white text-neutral-950 border-neutral-200",
      destructive: "border-red-200 bg-red-50 text-red-900",
      success: "border-green-200 bg-green-50 text-green-900",
      warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
      info: "border-blue-200 bg-blue-50 text-blue-900",
    }

    const icons = {
      default: AlertCircle,
      destructive: XCircle,
      success: CheckCircle,
      warning: AlertCircle,
      info: Info,
    }

    const Icon = icons[variant]

    return (
      <div
        className={cn(
          "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-neutral-950",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        <Icon className="h-4 w-4" />
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    )
  }
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
