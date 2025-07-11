"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
      if (!src) {
        setHasError(true)
        setIsLoading(false)
        return
      }

      const img = new Image()
      img.onload = () => {
        setHasError(false)
        setIsLoading(false)
      }
      img.onerror = () => {
        setHasError(true)
        setIsLoading(false)
      }
      img.src = src
    }, [src])

    // Don't render anything if there's an error, no src, or still loading
    if (hasError || !src || isLoading) {
      return null
    }

    return (
      <img
        className={cn("aspect-square h-full w-full object-cover", className)}
        src={src}
        alt={alt}
        ref={ref}
        onError={() => setHasError(true)}
        {...props}
      />
    )
  }
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-neutral-100 text-neutral-600 font-medium",
          className
        )}
        ref={ref}
        {...props}
      >
        {children || <User className="h-4 w-4" />}
      </div>
    )
  }
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
