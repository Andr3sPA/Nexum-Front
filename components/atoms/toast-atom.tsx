import { CheckCircle, XCircle, Info, X } from "lucide-react"
import React from "react"

export type ToastType = "success" | "error" | "info"

interface ToastAtomProps {
  title?: React.ReactNode
  description?: React.ReactNode
  type?: ToastType
  onClose?: () => void
}

export const ToastAtom: React.FC<ToastAtomProps> = ({ title, description, type = "info", onClose }) => {
  const icon = type === "success"
    ? <CheckCircle className="text-green-500 w-6 h-6" />
    : type === "error"
      ? <XCircle className="text-red-500 w-6 h-6" />
      : <Info className="text-blue-500 w-6 h-6" />

  const border = type === "success"
    ? "border-green-500"
    : type === "error"
      ? "border-red-500"
      : "border-blue-500"

  return (
    <div className={`relative flex items-start gap-3 bg-white border-l-4 ${border} shadow-lg rounded px-4 py-3 min-w-[260px] max-w-xs animate-fade-in-up`}
      style={{ cursor: "pointer" }}
    >
      <span className="mt-1">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-base">{title}</div>
        {description && <div className="text-sm text-gray-600 mt-1">{description}</div>}
      </div>
      <button
        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100"
        onClick={e => { e.stopPropagation(); onClose && onClose() }}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  )
} 