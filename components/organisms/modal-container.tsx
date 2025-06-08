import type { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ModalContainerProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}

export function ModalContainer({ title, isOpen, onClose, children, maxWidth = "max-w-2xl" }: ModalContainerProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${maxWidth} 
          max-h-[85vh] 
          overflow-y-auto 
          bg-white 
          border 
          border-gray-200 
          shadow-2xl 
          rounded-lg
        `}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold udea-primary-text leading-none tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
