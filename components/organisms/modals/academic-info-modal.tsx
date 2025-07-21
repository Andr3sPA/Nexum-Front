"use client"

import React, { useState, useEffect } from "react"
import { GraduationCap, Star } from "lucide-react"
import { Select } from "@/components/atoms/select"
import { ModalActions } from "@/components/molecules/modal-actions"
import { DynamicInputList } from "@/components/molecules/dynamic-input-list"
import { useAcademic } from "@/contexts/academic-context"
import { useProfile } from "@/contexts/profile-context"
import { logger } from "@/lib/logging"
import { DetailedCoursedProgramResponse, DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { ModalContainer } from "@/components/organisms/modal-container"
import { FormField } from "@/components/molecules/form-field"
import { Input } from "@/components/atoms/input"
import { FormSection } from "@/components/atoms/form-section"

interface AcademicInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  academicData: DetailedCoursedProgramResponse[]
  postGraduateData: DetailedAcademicEducationResponse[]
  editingProgram?: DetailedCoursedProgramResponse | null
  userId: string
}

export function AcademicInfoModal({
  isOpen,
  onClose,
  onSave,
  academicData,
  postGraduateData,
  editingProgram,
  userId,
}: AcademicInfoModalProps) {
  const { programs, programVersions, isLoadingPrograms, isLoadingVersions, loadProgramVersions, clearProgramVersions, loadPrograms } = useAcademic()
  const { createCoursedProgram, updateCoursedProgram, getProgramVersionInfo } = useProfile()
  
  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [selectedVersion, setSelectedVersion] = useState<string>("")
  const [graduationYear, setGraduationYear] = useState<string>(new Date().getFullYear().toString())
  const [strengths, setStrengths] = useState<string[]>([])
  const [weaknesses, setWeaknesses] = useState<string[]>([])
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Load programs if not already loaded
  useEffect(() => {
    if (isOpen && (!Array.isArray(programs) || programs.length === 0)) {
      logger.info("Modal opened, loading programs...")
      loadPrograms()
    }
  }, [isOpen, programs, loadPrograms])

  // Initialize form with existing data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editingProgram) {
        // Editing an existing program
        logger.info("Editing program:", editingProgram)
        if (editingProgram.programVersion) {
          // Get the complete program version information to find the parent program
          const fetchProgramVersionInfo = async () => {
            try {
              const programVersionInfo = await getProgramVersionInfo(editingProgram.programVersion.id)
              logger.info("Program version info:", programVersionInfo)
              
              // Set the program that corresponds to this version
              setSelectedProgram(programVersionInfo.program.id.toString())
              
              // Set the program version
              setSelectedVersion(editingProgram.programVersion.id.toString())
              
              // Load program versions for this program
              loadProgramVersions(programVersionInfo.program.id)
              setGraduationYear(editingProgram.graduationYear?.toString() || new Date().getFullYear().toString())
              
              // Load existing evaluation data
              setStrengths(editingProgram.strengths || [])
              setWeaknesses(editingProgram.weaknesses || [])
              setImprovementSuggestions(editingProgram.improvementSuggestions || [])
            } catch (error) {
              logger.error("Error fetching program version info:", error)
              // Fallback: just set the version without the program
              setSelectedVersion(editingProgram.programVersion.id.toString())
              loadProgramVersions(editingProgram.programVersion.id)
              setGraduationYear(editingProgram.graduationYear?.toString() || new Date().getFullYear().toString())
              setStrengths(editingProgram.strengths || [])
              setWeaknesses(editingProgram.weaknesses || [])
              setImprovementSuggestions(editingProgram.improvementSuggestions || [])
            }
          }
          
          fetchProgramVersionInfo()
        }
      } else if (academicData.length > 0) {
        // Creating new program but there's existing data - use first program as reference
        const firstProgram = academicData[0]
        if (firstProgram.programVersion) {
          // Set the program version directly
          setSelectedVersion(firstProgram.programVersion.id.toString())
          // Try to find the program by loading its versions
          loadProgramVersions(firstProgram.programVersion.id)
          setGraduationYear(firstProgram.graduationYear?.toString() || new Date().getFullYear().toString())
          
          // Load existing evaluation data
          setStrengths(firstProgram.strengths || [])
          setWeaknesses(firstProgram.weaknesses || [])
          setImprovementSuggestions(firstProgram.improvementSuggestions || [])
        }
      } else {
        // Creating new program with no existing data
        logger.info("Creating new program")
        setSelectedProgram("")
        setSelectedVersion("")
        setGraduationYear(new Date().getFullYear().toString())
        setStrengths([])
        setWeaknesses([])
        setImprovementSuggestions([])
      }
    }
  }, [isOpen, editingProgram, academicData, loadProgramVersions, programs, getProgramVersionInfo])

  // Load program versions when program changes
  useEffect(() => {
    if (selectedProgram) {
      loadProgramVersions(parseInt(selectedProgram))
    } else {
      clearProgramVersions()
    }
  }, [selectedProgram, loadProgramVersions, clearProgramVersions])

  const handleSave = async () => {
    if (!selectedVersion || !graduationYear) {
      logger.warn("Program version and graduation year must be selected")
      return
    }

    try {
      setIsSaving(true)
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }

      const formData = {
        userId: userId,
        programVersionId: parseInt(selectedVersion),
        graduationYear: parseInt(graduationYear),
        strengths: strengths.filter(s => s.trim().length > 0),
        weaknesses: weaknesses.filter(w => w.trim().length > 0),
        improvementSuggestions: improvementSuggestions.filter(i => i.trim().length > 0)
      }

      if (editingProgram) {
        // Update existing coursed program
        logger.info("Updating existing program:", editingProgram.id)
        await updateCoursedProgram(editingProgram.id, formData)
      } else {
        // Create new coursed program
        logger.info("Creating new program")
        await createCoursedProgram(formData)
      }

      onSave()
      onClose()
    } catch (error) {
      logger.error("Error saving academic info:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <ModalContainer 
      title={editingProgram ? "Editar Carrera Cursada" : "Agregar Carrera Cursada"}
      subtitle="Complete la información académica y evalúe su experiencia en el programa"
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-5xl"
      onSubmit={handleSave}
      isSubmitting={isSaving}
      actions={
        <ModalActions onCancel={onClose} isSubmitting={isSaving} />
      }
    >
      <div className="space-y-8">
        <FormSection 
          title="Información del Programa"
          description="Seleccione el programa académico y la versión que cursó"
          icon={GraduationCap}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FormField id="program" label="Programa">
              <Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={isLoadingPrograms}
                required
              >
                <option value="">Seleccionar programa</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="version" label="Versión del Programa">
              <Select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                disabled={!selectedProgram || isLoadingVersions}
                required
              >
                <option value="">Seleccionar versión</option>
                {programVersions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField id="graduationYear" label="Año de Graduación">
              <Input
                id="graduationYear"
                type="number"
                min="1990"
                max="2030"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="Ingrese el año de graduación"
                required
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection 
          title="Evaluación del Programa"
          description="Comparta su experiencia y opinión sobre el programa cursado"
          icon={Star}
        >
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <DynamicInputList
                items={strengths}
                onItemsChange={setStrengths}
                label="Fortalezas del Programa"
                placeholder="Agregar fortaleza del programa"
                addButtonText="Agregar Fortaleza"
              />
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
              <DynamicInputList
                items={weaknesses}
                onItemsChange={setWeaknesses}
                label="Debilidades del Programa"
                placeholder="Agregar debilidad del programa"
                addButtonText="Agregar Debilidad"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
              <DynamicInputList
                items={improvementSuggestions}
                onItemsChange={setImprovementSuggestions}
                label="Sugerencias de Mejora"
                placeholder="Agregar sugerencia de mejora"
                addButtonText="Agregar Sugerencia"
              />
            </div>
          </div>
        </FormSection>
      </div>
    </ModalContainer>
  )
}
