"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

// Helper function to get the nonce from the DOM
function getNonce(): string {
  if (typeof document !== 'undefined') {
    const rootElement = document.getElementById('root');
    return rootElement?.getAttribute('data-nonce') || '';
  }
  return '';
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ 
  children, 
  asChild, 
  ...props 
}: { 
  children: React.ReactNode 
  asChild?: boolean 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within a Dialog")

  const { onOpenChange } = context
  const nonce = getNonce()

  const Comp = asChild ? React.cloneElement(children as React.ReactElement, {
    ...props,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault()
      onOpenChange(true)
      if ((children as React.ReactElement).props.onClick) {
        (children as React.ReactElement).props.onClick(e)
      }
    },
    nonce: nonce
  }) : (
    <button
      type="button"
      onClick={() => onOpenChange(true)}
      nonce={nonce}
      {...props}
    >
      {children}
    </button>
  )

  return Comp
}

export function DialogPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(children, document.body)
}

export function DialogOverlay({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogOverlay must be used within a Dialog")
  
  const { open } = context
  const nonce = getNonce()
  
  if (!open) return null
  
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      nonce={nonce}
      {...props}
    />
  )
}

export function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within a Dialog")
  
  const { open, onOpenChange } = context
  const nonce = getNonce()
  
  // Handle ESC key
  React.useEffect(() => {
    if (!open) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])
  
  // Handle click outside
  const contentRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!open) return
    
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    
    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [open, onOpenChange])
  
  if (!open) return null
  
  return (
    <DialogPortal>
      <DialogOverlay onClick={() => onOpenChange(false)} />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        nonce={nonce}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only" nonce={nonce}>Close</span>
        </DialogClose>
      </div>
    </DialogPortal>
  )
}

export function DialogClose({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("DialogClose must be used within a Dialog")
  
  const { onOpenChange } = context
  const nonce = getNonce()
  
  return (
    <button
      type="button"
      className={className}
      onClick={() => onOpenChange(false)}
      nonce={nonce}
      {...props}
    >
      {children}
    </button>
  )
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const nonce = getNonce()
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      nonce={nonce}
      {...props}
    />
  )
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const nonce = getNonce()
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      nonce={nonce}
      {...props}
    />
  )
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const nonce = getNonce()
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      nonce={nonce}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const nonce = getNonce()
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      nonce={nonce}
      {...props}
    />
  )
}