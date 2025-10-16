import React from "react";
import { OpportunityResponse } from "@/lib/services/opportunity";
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";

interface OpportunityDetailModalProps {
  opportunity: OpportunityResponse | null;
  open: boolean;
  onClose: () => void;
  salaryRanges: SalaryRangeResponse[];
  programs: ProgramResponse[];
  programCompetencies: ProgramCompetencyResponse[];
  jobAreas: JobAreaResponse[];
}

export default function OpportunityDetailModal({
  opportunity,
  open,
  onClose,
  salaryRanges,
  programs,
  programCompetencies,
  jobAreas
}: OpportunityDetailModalProps) {
  if (!open || !opportunity) return null;

  // Find catalog names by IDs
  const salaryRange = salaryRanges.find(sr => sr.id === opportunity.salaryRangeId);
  const selectedPrograms = programs.filter(p => opportunity.coursedProgramIds?.includes(p.id));
  const selectedCompetencies = programCompetencies.filter(pc => opportunity.programCompetencyIds?.includes(pc.id));
  const selectedJobAreas = jobAreas.filter(ja => opportunity.jobAreaIds?.includes(ja.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <Card>
          <CardHeader>
            <CardTitle>{opportunity.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <strong>Descripción:</strong>
              <div>{opportunity.description}</div>
            </div>

            <div className="mb-2">
              <strong>Ubicación:</strong> {opportunity.location || '-'}
            </div>
            <div className="mb-2">
              <strong>Modalidad:</strong> {opportunity.workModality}
            </div>
            <div className="mb-2">
              <strong>Rango Salarial:</strong> {salaryRange ? salaryRange.salary : '-'}
            </div>
            <div className="mb-2">
              <strong>Programas Relacionados:</strong>
              {selectedPrograms.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedPrograms.map(program => (
                    <span key={program.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {program.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Ninguno especificado</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Competencias Requeridas:</strong>
              {selectedCompetencies.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCompetencies.map(competency => (
                    <span key={competency.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {competency.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Ninguna especificada</span>
              )}
            </div>
            <div className="mb-2">
              <strong>Áreas de Trabajo:</strong>
              {selectedJobAreas.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedJobAreas.map(area => (
                    <span key={area.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {area.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Ninguna especificada</span>
              )}
            </div>

            <div className="mb-2">
              <strong>Estado:</strong> {opportunity.status}
            </div>
            <div className="mb-2">
              <strong>Fecha de Expiración:</strong> {opportunity.expirationDate ? new Date(opportunity.expirationDate).toLocaleDateString('es-ES') : '-'}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button onClick={onClose} variant="outline">Cerrar</Button>
              {opportunity.link && (
                <a href={opportunity.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 rounded-md bg-green-600 text-white text-sm">
                  Ver más información
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
