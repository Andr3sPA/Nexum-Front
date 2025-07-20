"use client"
import { useToast, setGlobalToastFunction } from "@/hooks/use-toast"
import { ToastStack } from "@/components/molecules/toast-stack"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, removeToast, addToast } = useToast()
  
  // Set up global toast function
  useEffect(() => {
    setGlobalToastFunction(addToast)
  }, [addToast])

  // Auto-dismiss toasts after 4 seconds
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.open) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, 4000)
        
        return () => clearTimeout(timer)
      }
    })
  }, [toasts, removeToast])

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <ToastStack toasts={toasts} onClose={removeToast} />
    </div>
  )
} 