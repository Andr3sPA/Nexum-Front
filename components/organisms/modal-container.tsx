import type { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/molecules/dialog"

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
          bg-white 
          border 
          border-gray-200 
          shadow-2xl 
          rounded-lg
          overflow-visible
        `}
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold udea-primary-text leading-none tracking-tight">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
