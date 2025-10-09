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
import { MultiSelectDropdown } from "@/components/molecules/multi-select-dropdown";
import { Briefcase, DollarSign, Calendar, User, Settings, Building } from "lucide-react";

interface OpportunityCreationFormProps {
  form: OpportunityRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onMultiSelectChange: (name: string, values: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  loading: boolean;
  isEditMode: boolean;
  salaryRanges: SalaryRangeResponse[];
  programs: ProgramResponse[];
  programCompetencies: ProgramCompetencyResponse[];
  jobAreas: JobAreaResponse[];
  catalogLoading: boolean;
  programSearch: string;
  onProgramSearchChange: (value: string) => void;
  showProgramDropdown: boolean;
  setShowProgramDropdown: (show: boolean) => void;
  competencySearch: string;
  onCompetencySearchChange: (value: string) => void;
  showCompetencyDropdown: boolean;
  setShowCompetencyDropdown: (show: boolean) => void;
  jobAreaSearch: string;
  onJobAreaSearchChange: (value: string) => void;
  showJobAreaDropdown: boolean;
  setShowJobAreaDropdown: (show: boolean) => void;
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
  programSearch,
  onProgramSearchChange,
  showProgramDropdown,
  setShowProgramDropdown,
  competencySearch,
  onCompetencySearchChange,
  showCompetencyDropdown,
  setShowCompetencyDropdown,
  jobAreaSearch,
  onJobAreaSearchChange,
  showJobAreaDropdown,
  setShowJobAreaDropdown,
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
                <Label htmlFor="businessName">Nombre de la Empresa</Label>
                <Input name="businessName" id="businessName" value={form.businessName} onChange={onChange} placeholder="Ej: Empresa XYZ S.A.S." />
              </div>
              <div>
                <Label htmlFor="contactName">Nombre del Contacto</Label>
                <Input name="contactName" id="contactName" value={form.contactName} onChange={onChange} placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <Label htmlFor="businessEmail">Correo Electrónico</Label>
                <Input name="businessEmail" id="businessEmail" type="email" value={form.businessEmail} onChange={onChange} placeholder="contacto@empresa.com" />
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
                <MultiSelectDropdown
                  items={programs}
                  selectedIds={form.coursedProgramIds}
                  onSelect={(id) => onMultiSelectChange('coursedProgramIds', [...form.coursedProgramIds.map(String), id.toString()])}
                  onRemove={(id) => onMultiSelectChange('coursedProgramIds', form.coursedProgramIds.filter(i => i !== id).map(String))}
                  placeholder="Buscar y seleccionar programas..."
                  searchValue={programSearch}
                  onSearchChange={onProgramSearchChange}
                  showDropdown={showProgramDropdown}
                  setShowDropdown={setShowProgramDropdown}
                  onEnterKey={(available) => {
                    if (available.length > 0) {
                      onMultiSelectChange('coursedProgramIds', [...form.coursedProgramIds.map(String), available[0].id.toString()]);
                      onProgramSearchChange('');
                      setShowProgramDropdown(false);
                    }
                  }}
                />
              </div>
              <div>
                <Label>Competencias Requeridas</Label>
                <MultiSelectDropdown
                  items={programCompetencies}
                  selectedIds={form.programCompetencyIds}
                  onSelect={(id) => onMultiSelectChange('programCompetencyIds', [...form.programCompetencyIds.map(String), id.toString()])}
                  onRemove={(id) => onMultiSelectChange('programCompetencyIds', form.programCompetencyIds.filter(i => i !== id).map(String))}
                  placeholder="Buscar y seleccionar competencias..."
                  searchValue={competencySearch}
                  onSearchChange={onCompetencySearchChange}
                  showDropdown={showCompetencyDropdown}
                  setShowDropdown={setShowCompetencyDropdown}
                  onEnterKey={(available) => {
                    if (available.length > 0) {
                      onMultiSelectChange('programCompetencyIds', [...form.programCompetencyIds.map(String), available[0].id.toString()]);
                      onCompetencySearchChange('');
                      setShowCompetencyDropdown(false);
                    }
                  }}
                />
              </div>
              <div>
                <Label>Áreas de Trabajo</Label>
                <MultiSelectDropdown
                  items={jobAreas}
                  selectedIds={form.jobAreaIds}
                  onSelect={(id) => onMultiSelectChange('jobAreaIds', [...form.jobAreaIds.map(String), id.toString()])}
                  onRemove={(id) => onMultiSelectChange('jobAreaIds', form.jobAreaIds.filter(i => i !== id).map(String))}
                  placeholder="Buscar y seleccionar áreas de trabajo..."
                  searchValue={jobAreaSearch}
                  onSearchChange={onJobAreaSearchChange}
                  showDropdown={showJobAreaDropdown}
                  setShowDropdown={setShowJobAreaDropdown}
                  onEnterKey={(available) => {
                    if (available.length > 0) {
                      onMultiSelectChange('jobAreaIds', [...form.jobAreaIds.map(String), available[0].id.toString()]);
                      onJobAreaSearchChange('');
                      setShowJobAreaDropdown(false);
                    }
                  }}
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