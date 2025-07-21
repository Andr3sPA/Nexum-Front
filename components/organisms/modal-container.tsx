import type { ReactNode } from "react"
import { Dialog, DialogContent } from "@/components/molecules/dialog"
import { ModalHeader } from "@/components/atoms/modal-header"
import { LucideIcon } from "lucide-react"
import { logger } from "@/lib/logging"

interface ModalContainerProps {
  title: string
  icon?: LucideIcon
  subtitle?: string
  color?: "blue" | "green" | "purple" | "orange"
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: string
  actions?: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  isSubmitting?: boolean
}

export function ModalContainer({ 
  title,
  icon,
  subtitle,
  color = "blue",
  isOpen, 
  onClose, 
  children, 
  maxWidth = "max-w-2xl", 
  actions,
  onSubmit,
  isSubmitting = false
}: ModalContainerProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    logger.info("📝 ModalContainer.handleSubmit called")
    if (onSubmit) {
      logger.info("📝 ModalContainer calling onSubmit")
      onSubmit(e)
    } else {
      logger.info("📝 ModalContainer no onSubmit provided")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
          ${maxWidth}
          w-full
          bg-white/95 backdrop-blur-md
          border 
          border-gray-200/50 
          shadow-2xl 
          rounded-lg
          overflow-hidden
          p-0
          flex flex-col
        `}
      >
        {icon ? (
          <ModalHeader
            icon={icon}
            title={title}
            subtitle={subtitle}
            color={color}
          />
        ) : (
          <div className="p-6 pb-4 flex-shrink-0 border-b border-gray-200">
            <h2 className="text-xl font-semibold udea-primary-text leading-none tracking-tight">
              {title}
            </h2>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-8 py-4 modal-scrollbar">
            <div className="space-y-4">
              {children}
            </div>
          </div>

          {actions && (
            <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50/50">
              {actions}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
