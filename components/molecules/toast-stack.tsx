import { Toast, ToastAtomProps } from "@/components/atoms/toast"
import { ToastProps } from "@/hooks/use-toast"
import React from "react"

export interface ToastStackProps {
  toasts: ToastProps[]
  onClose: (id: string) => void
}

export const ToastStack: React.FC<ToastStackProps> = ({ toasts, onClose }) => {
  return (
    <div className="flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  )
} 