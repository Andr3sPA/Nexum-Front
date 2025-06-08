"use client"

import { useState } from "react"
import { Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AcademicInfoModal from "../modals/academic-info-modal"
import PostGraduateModal from "../modals/post-graduate-modal"

export default function AcademicInfoTab() {
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false)
  const [isPostGradModalOpen, setIsPostGradModalOpen] = useState(false)

  const [academicData, setAcademicData] = useState({
    graduationYear: "",
    program: "",
    studyPlan: "",
    role: "",
  })

  const [postGradData, setPostGradData] = useState([
    {
      id: 1,
      type: "",
      name: "",
      institution: "",
      country: "",
    },
  ])

  const handleAcademicSave = (data: typeof academicData) => {
    setAcademicData(data)
    setIsAcademicModalOpen(false)
    // TODO: Send data to backend
  }

  const handlePostGradSave = (data: typeof postGradData) => {
    setPostGradData(data)
    setIsPostGradModalOpen(false)
    // TODO: Send data to backend
  }

  const addPostGradEntry = () => {
    setPostGradData((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "",
        name: "",
        institution: "",
        country: "",
      },
    ])
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Información Académica</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAcademicModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Año de Graduación</label>
              <p className="text-gray-900">{academicData.graduationYear || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Programa Cursado en la UdeA</label>
              <p className="text-gray-900">{academicData.program || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Plan de Estudios</label>
              <p className="text-gray-900">{academicData.studyPlan || "No hay datos"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Durante su formación fue</label>
              <p className="text-gray-900">{academicData.role || "No hay datos"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post-Graduate Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="udea-primary-text">Información Académica Pos Pregrado</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={addPostGradEntry} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPostGradModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {postGradData.map((entry, index) => (
            <div key={entry.id} className="mb-6 p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Estudio {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="text-gray-900">{entry.type || "No hay datos"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre del Estudio</label>
                  <p className="text-gray-900">{entry.name || "No hay datos"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Institución</label>
                  <p className="text-gray-900">{entry.institution || "No hay datos"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">País</label>
                  <p className="text-gray-900">{entry.country || "No hay datos"}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <AcademicInfoModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
        onSave={handleAcademicSave}
        initialData={academicData}
      />

      <PostGraduateModal
        isOpen={isPostGradModalOpen}
        onClose={() => setIsPostGradModalOpen(false)}
        onSave={handlePostGradSave}
        initialData={postGradData}
      />
    </div>
  )
}
