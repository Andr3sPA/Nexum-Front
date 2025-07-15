"use client"

import { useState } from "react"
import { ModalContainer } from "@/components/organisms/modal-container"
import { ModalActions } from "@/components/molecules/modal-actions"
import { Button } from "@/components/atoms/button"

export function ModalScrollTest() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    console.log("Modal saved")
    setIsOpen(false)
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)} className="udea-primary">
        Abrir Modal con Scroll
      </Button>

      <ModalContainer
        title="Modal de Prueba con Scroll"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="max-w-2xl"
        onSubmit={handleSave}
        actions={
          <ModalActions onCancel={() => setIsOpen(false)} />
        }
      >
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900">Información Importante</h3>
            <p className="text-blue-700 mt-2">
              Este modal tiene mucho contenido para probar el scroll. Los botones deben permanecer fijos en la parte inferior.
            </p>
          </div>

          {/* Contenido largo para activar scroll */}
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium text-gray-900">Sección {i + 1}</h4>
              <p className="text-gray-600 mt-2">
                Este es el contenido de la sección {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="mt-3 space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-900">Final del Contenido</h3>
            <p className="text-green-700 mt-2">
              Si puedes ver esta sección, el scroll está funcionando correctamente. 
              Los botones de acción deben estar visibles en la parte inferior del modal.
            </p>
          </div>
        </div>
      </ModalContainer>
    </div>
  )
} 