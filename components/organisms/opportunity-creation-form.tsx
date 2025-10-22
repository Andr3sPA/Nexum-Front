import React from 'react';
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";

import { Label } from "@/components/atoms/label";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Checkbox } from "@/components/atoms/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { FormSection } from "@/components/atoms/form-section";
import { OpportunityRequest } from "@/lib/services/opportunity/opportunity.service";
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { MultiSelectNumber } from "@/components/molecules/multi-select-number";
import { Briefcase, DollarSign, Calendar, User, Settings, Building } from "lucide-react";
import { ROLES } from "@/lib/services/constants/api.constants";

interface OpportunityCreationFormProps {
  form: OpportunityRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onMultiSelectChange: (updater: (prev: OpportunityRequest) => OpportunityRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading: boolean;
  isEditMode: boolean;
  salaryRanges: SalaryRangeResponse[];
  programs: ProgramResponse[];
  programCompetencies: ProgramCompetencyResponse[];
  jobAreas: JobAreaResponse[];
  catalogLoading: boolean;
  userRole?: string;
}

export const OpportunityCreationForm: React.FC<OpportunityCreationFormProps> = ({
  form,
  onChange,
  onSelectChange,
  onMultiSelectChange,
  onSubmit,
  onCancel,
  loading,
  isEditMode,
  salaryRanges,
  programs,
  programCompetencies,
  jobAreas,
  catalogLoading,
  userRole,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-green-600" />
          {isEditMode ? "Actualizar Oportunidad" : "Registrar Nueva Oportunidad"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormSection
            icon={Briefcase}
            title="Información Básica"
            description="Proporcione los detalles principales de la oportunidad laboral, incluyendo título, descripción detallada y ubicación del puesto"
            color="blue"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input name="title" id="title" value={form.title} onChange={onChange} required />
              </div>
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea name="description" id="description" value={form.description} onChange={onChange} required />
              <div>
                <Label htmlFor="link">Enlace para aplicar a oportunidad *</Label>
                <Input name="link" id="link" type="url" required value={(form as any).link || ''} onChange={onChange} placeholder="https://www.ejemplo.com/aplicar" />
              </div>
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input name="location" id="location" value={form.location} onChange={onChange} />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={Building}
            title="Información de la Empresa"
            description="Complete la información de contacto de la empresa oferente para que los candidatos puedan comunicarse directamente"
            color="purple"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Nombre de la Empresa *</Label>
                <Input name="businessName" id="businessName" required value={form.businessName} onChange={onChange} placeholder="Ej: Empresa XYZ S.A.S." />
              </div>
              <div>
                <Label htmlFor="contactName">Nombre del Contacto *</Label>
                <Input name="contactName" id="contactName" required value={form.contactName} onChange={onChange} placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <Label htmlFor="businessEmail">Correo Electrónico *</Label>
                <Input name="businessEmail" id="businessEmail" required type="email" value={form.businessEmail} onChange={onChange} placeholder="contacto@empresa.com" />
              </div>
              <div>
                <Label htmlFor="businessPhone">Teléfono</Label>
                <Input name="businessPhone" id="businessPhone" value={form.businessPhone} onChange={onChange} placeholder="+57 300 123 4567" />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={Settings}
            title="Modalidad de Trabajo"
            description="Especifique si el puesto es remoto, presencial o híbrido según las necesidades de la posición"
            color="green"
          >
            <div>
              <Label htmlFor="workModality">Modalidad de Trabajo *</Label>
              <Select name="workModality" id="workModality" value={form.workModality} onChange={onChange} required>
                <option value="Remote">Remoto</option>
                <option value="On Site">Presencial</option>
                <option value="Hybrid">Híbrido</option>
              </Select>
            </div>
          </FormSection>

          <FormSection
            icon={Settings}
            title="Estado de la Oportunidad"
            description="Defina el estado actual de la oportunidad laboral"
            color="orange"
          >
            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select name="status" id="status" value={form.status} onChange={onChange} required>
                <option value="Draft">Borrador</option>
                {userRole !== ROLES.EMPLOYER && (
                  <>
                    <option value="Active">Activa</option>
                    <option value="Closed">Cerrada</option>
                    <option value="Expired">Expirada</option>
                    <option value="On Hold">En Espera</option>
                    <option value="Cancelled">Cancelada</option>
                  </>
                )}
                {userRole === ROLES.EMPLOYER && (
                  <>
                    <option value="Active" disabled>Activa (Solo Admin)</option>
                    <option value="Closed" disabled>Cerrada (Solo Admin)</option>
                    <option value="Expired" disabled>Expirada (Solo Admin)</option>
                    <option value="On Hold" disabled>En Espera (Solo Admin)</option>
                    <option value="Cancelled" disabled>Cancelada (Solo Admin)</option>
                  </>
                )}
              </Select>
            </div>
          </FormSection>

          <FormSection
            icon={DollarSign}
            title="Rango Salarial"
            description="Seleccione el rango salarial aproximado que se ofrece para esta posición laboral"
            color="green"
          >
            <div>
              <Label htmlFor="salaryRangeId">Rango Salarial</Label>
              <Select
                name="salaryRangeId"
                id="salaryRangeId"
                value={form.salaryRangeId.toString()}
                onChange={(e) => onSelectChange('salaryRangeId', e.target.value)}
                disabled={catalogLoading}
              >
                <option value="0">Seleccionar rango salarial...</option>
                {salaryRanges.map((range) => (
                  <option key={range.id} value={range.id.toString()}>
                    {range.salary}
                  </option>
                ))}
              </Select>
            </div>
          </FormSection>

          <FormSection
            icon={Calendar}
            title="Fecha de Expiración"
            description="Establezca la fecha límite para recibir postulaciones a esta oportunidad laboral"
            color="purple"
          >
            <div>
              <Label htmlFor="expirationDate">Fecha de Expiración *</Label>
              <Input name="expirationDate" id="expirationDate" type="date" value={form.expirationDate} onChange={onChange} required />
            </div>
          </FormSection>

          <FormSection
            icon={User}
            title="Requisitos y Perfil del Candidato"
            description="Defina los requisitos académicos, experiencia laboral y competencias específicas que debe tener el candidato ideal"
            color="orange"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="requiredExperience">Experiencia Requerida *</Label>
                <Select name="requiredExperience" id="requiredExperience" value={form.requiredExperience} onChange={onChange} required>
                  <option value="No experience required">Sin experiencia requerida</option>
                  <option value="Less than 1 year">Menos de 1 año</option>
                  <option value="1-2 years">1-2 años</option>
                  <option value="2-4 years">2-4 años</option>
                  <option value="4-6 years">4-6 años</option>
                  <option value="More than 6 years">Más de 6 años</option>
                  <option value="Not specified">No especificado</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="complementaryStudies">Estudios Complementarios</Label>
                <Textarea name="complementaryStudies" id="complementaryStudies" value={form.complementaryStudies} onChange={onChange} placeholder="Especifique estudios adicionales requeridos..." />
              </div>
              <div>
                <Label>Programas Relacionados</Label>
                <MultiSelectNumber
                  items={programs}
                  selectedIds={form.coursedProgramIds}
                  onChange={(selectedIds) => onMultiSelectChange(prev => ({
                    ...prev,
                    coursedProgramIds: selectedIds
                  }))}
                  placeholder="Seleccionar programas..."
                  disabled={catalogLoading}
                />
              </div>
              <div>
                <Label>Competencias Requeridas</Label>
                <MultiSelectNumber
                  items={programCompetencies}
                  selectedIds={form.programCompetencyIds}
                  onChange={(selectedIds) => onMultiSelectChange(prev => ({
                    ...prev,
                    programCompetencyIds: selectedIds
                  }))}
                  placeholder="Seleccionar competencias..."
                  disabled={catalogLoading}
                />
              </div>
              <div>
                <Label>Áreas de Trabajo</Label>
                <MultiSelectNumber
                  items={jobAreas}
                  selectedIds={form.jobAreaIds}
                  onChange={(selectedIds) => onMultiSelectChange(prev => ({
                    ...prev,
                    jobAreaIds: selectedIds
                  }))}
                  placeholder="Seleccionar áreas de trabajo..."
                  disabled={catalogLoading}
                />
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  name="travelAvailability"
                  id="travelAvailability"
                  checked={form.travelAvailability}
                  onChange={onChange}
                />
                <Label htmlFor="travelAvailability" className="cursor-pointer">Disponibilidad para viajar</Label>
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end gap-4 pt-4">
            {isEditMode && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? "Actualizando..." : "Registrando..."}
                </>
              ) : (
                isEditMode ? "Actualizar Oportunidad" : "Registrar Oportunidad"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
