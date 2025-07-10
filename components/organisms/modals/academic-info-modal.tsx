"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModalActions } from "@/components/molecules/modal-actions"
import { DynamicInputList } from "@/components/molecules/dynamic-input-list"
import { useAcademic } from "@/contexts/academic-context"
import { logger } from "@/lib/logging"
import { CoursedProgramService } from "@/lib/services/profile/coursed-program.service"
import { DetailedCoursedProgramResponse, DetailedAcademicEducationResponse } from "@/lib/services/profile/detailed-user.service"
import { LocalStorageService } from "@/lib/services/local-storage.service"

interface AcademicInfoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  academicData: DetailedCoursedProgramResponse[]
  postGraduateData: DetailedAcademicEducationResponse[]
}

export function AcademicInfoModal({
  isOpen,
  onClose,
  onSave,
  academicData,
  postGraduateData,
}: AcademicInfoModalProps) {
  const { programs, programVersions, isLoadingPrograms, isLoadingVersions, loadProgramVersions, clearProgramVersions, loadPrograms } = useAcademic()
  
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
      console.log("Modal opened, loading programs...")
      loadPrograms()
    }
  }, [isOpen, programs, loadPrograms])

  // Initialize form with existing data when modal opens
  useEffect(() => {
    if (isOpen && academicData.length > 0) {
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
    }
  }, [isOpen, academicData, loadProgramVersions])

  // Load program versions when program changes
  useEffect(() => {
    if (selectedProgram) {
      loadProgramVersions(parseInt(selectedProgram))
    } else {
      clearProgramVersions()
    }
  }, [selectedProgram, loadProgramVersions, clearProgramVersions])

  const handleSave = async () => {
    if (!selectedProgram || !selectedVersion || !graduationYear) {
      logger.warn("Program, version and graduation year must be selected")
      return
    }

    try {
      setIsSaving(true)
      
      // Get user from localStorage
      const user = LocalStorageService.getItem<{ id: string }>("user")
      const userProfile = LocalStorageService.getItem<{ id: string }>("userProfile")
      const userId = userProfile?.id || user?.id
      
      console.log("User ID from basic user:", user?.id)
      console.log("User ID from userProfile:", userProfile?.id)
      console.log("Final userId being used:", userId)
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario")
      }

      // Check if there's existing coursed program data to update
      const existingCoursedProgram = academicData.find(program => program.programVersion?.id === parseInt(selectedVersion))
      
      if (existingCoursedProgram) {
        // Update existing coursed program
        await CoursedProgramService.updateById(existingCoursedProgram.id, {
          userId: userId,
          programVersionId: parseInt(selectedVersion),
          graduationYear: parseInt(graduationYear),
          strengths: strengths.filter(s => s.trim().length > 0),
          weaknesses: weaknesses.filter(w => w.trim().length > 0),
          improvementSuggestions: improvementSuggestions.filter(i => i.trim().length > 0)
        })
      } else {
        // Create new coursed program
        await CoursedProgramService.create({
          userId: userId,
          programVersionId: parseInt(selectedVersion),
          graduationYear: parseInt(graduationYear),
          strengths: strengths.filter(s => s.trim().length > 0),
          weaknesses: weaknesses.filter(w => w.trim().length > 0),
          improvementSuggestions: improvementSuggestions.filter(i => i.trim().length > 0)
        })
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Información Académica</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            {/* Program Selection */}
            <div>
              <Label htmlFor="program">Programa</Label>
              <Select
                value={selectedProgram}
                onValueChange={setSelectedProgram}
                disabled={isLoadingPrograms}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPrograms ? "Cargando programas..." : "Selecciona un programa"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(programs) && programs.length > 0 ? (
                    programs.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-programs" disabled>
                      {isLoadingPrograms ? "Cargando programas..." : "No hay programas disponibles"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Program Version Selection */}
            <div>
              <Label htmlFor="version">Versión del Programa</Label>
              <Select
                value={selectedVersion}
                onValueChange={setSelectedVersion}
                disabled={isLoadingVersions || !selectedProgram}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      !selectedProgram 
                        ? "Primero selecciona un programa" 
                        : isLoadingVersions 
                          ? "Cargando versiones..." 
                          : "Selecciona una versión"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(programVersions) && programVersions.length > 0 ? (
                    programVersions.map((version) => (
                      <SelectItem key={version.id} value={version.id.toString()}>
                        Plan {version.version}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-versions" disabled>
                      No hay versiones disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Graduation Year */}
            <div>
              <Label htmlFor="graduationYear">Año de Graduación</Label>
              <Input
                id="graduationYear"
                type="number"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                min="1950"
                max={new Date().getFullYear() + 10}
                required
              />
            </div>

            {/* Strengths */}
            <DynamicInputList
              items={strengths}
              onItemsChange={setStrengths}
              label="Fortalezas del Programa"
              placeholder="Fortaleza"
              addButtonText="+ Agregar Fortaleza"
            />

            {/* Weaknesses */}
            <DynamicInputList
              items={weaknesses}
              onItemsChange={setWeaknesses}
              label="Debilidades del Programa"
              placeholder="Debilidad"
              addButtonText="+ Agregar Debilidad"
            />

            {/* Improvement Suggestions */}
            <DynamicInputList
              items={improvementSuggestions}
              onItemsChange={setImprovementSuggestions}
              label="Sugerencias de Mejora"
              placeholder="Sugerencia"
              addButtonText="+ Agregar Sugerencia"
            />
          </div>

          <ModalActions
            onCancel={onClose}
            isSubmitting={isSaving}
          />
        </form>
      </div>
    </div>
  )
}
