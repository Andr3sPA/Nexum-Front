"use client"

import { Card, CardHeader, CardContent } from "@/components/molecules/card"
import { AddButton } from "@/components/atoms/add-button"
import { DetailedInnovationProcessResponse } from "@/lib/services/profile/detailed-user.service"
import { Edit, Trash2, ExternalLink, Calendar, Tag, Lightbulb } from "lucide-react"

interface InnovationProcessesCardProps {
  innovationProcesses: DetailedInnovationProcessResponse[]
  onAdd: () => void
  onEdit: (process: DetailedInnovationProcessResponse) => void
  onDelete: (processId: number) => void
}

export function InnovationProcessesCard({ 
  innovationProcesses, 
  onAdd, 
  onEdit, 
  onDelete 
}: InnovationProcessesCardProps) {
  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-700">Procesos de Innovación</h3>
              <p className="text-sm text-neutral-600">Proyectos y procesos de innovación</p>
            </div>
          </div>
          <AddButton onClick={onAdd}>Agregar</AddButton>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {innovationProcesses.length > 0 ? (
          <div className="space-y-4">
            {innovationProcesses.map((process) => (
              <div key={process.id} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{process.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{process.type.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(process.creationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(process)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(process.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {process.description && (
                  <p className="text-gray-700 mt-3">{process.description}</p>
                )}
                {process.link && (
                  <a 
                    href={process.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium mt-3"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Ver enlace del proyecto</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No hay procesos de innovación registrados</p>
        )}
      </CardContent>
    </Card>
  )
} 