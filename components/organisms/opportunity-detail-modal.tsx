import React from "react";
import { OpportunityResponse } from "@/lib/services/opportunity";
import { ApplicationService } from "@/lib/services/opportunity";
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { toast } from "@/hooks/use-toast";

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
  const selectedPrograms = programs.filter(p => opportunity.coursedPrograms?.includes(p.name));
  const selectedCompetencies = programCompetencies.filter(pc => opportunity.programCompetencies?.includes(pc.name));
  const selectedJobAreas = jobAreas.filter(ja => opportunity.jobAreas?.includes(ja.name));

  const handleViewMoreInfo = async () => {
    if (opportunity.link) {
      window.open(opportunity.link, '_blank', 'noopener');
    }
    try {
      await ApplicationService.apply({ opportunityId: opportunity.id });
      toast({ title: 'Aplicación enviada exitosamente' });
    } catch (error) {
      toast({ title: 'Error al enviar aplicación', description: String(error) });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 md:p-2">
        <div className="bg-gradient-to-r from-[#f3f8f4] to-[#e6f4ea] rounded-2xl p-6 border-b border-green-200 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#026937] mb-1">{opportunity.title}</h2>
            <div className="text-sm text-gray-600 mb-2">{opportunity.location || '-'} • {opportunity.workModality}</div>
            <div className="text-xs text-gray-500 mb-1">Expira: {opportunity.expirationDate ? new Date(opportunity.expirationDate).toLocaleDateString('es-ES') : '-'}</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 mb-2 ${
              opportunity.status.replace(/\s+/g, '_').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              opportunity.status.replace(/\s+/g, '_').toUpperCase() === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
              opportunity.status.replace(/\s+/g, '_').toUpperCase() === 'CLOSED' ? 'bg-red-100 text-red-800' :
              opportunity.status.replace(/\s+/g, '_').toUpperCase() === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {opportunity.status}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium text-green-700">{salaryRange ? salaryRange.salary : '-'}</span>
            {opportunity.link && (
              <Button
                onClick={handleViewMoreInfo}
                className="inline-flex items-center px-3 py-2 rounded-md bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition"
              >
                Ver más información
              </Button>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#026937] mb-1">Descripción</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">{opportunity.description}</p>
          </div>
          <div className="mb-3">
            <h4 className="text-md font-semibold text-[#026937]">Programas Relacionados</h4>
            {selectedPrograms.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedPrograms.map(program => (
                  <span key={program.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {program.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-xs">Ninguno especificado</span>
            )}
          </div>
          <div className="mb-3">
            <h4 className="text-md font-semibold text-[#026937]">Competencias Requeridas</h4>
            {selectedCompetencies.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedCompetencies.map(competency => (
                  <span key={competency.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {competency.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-xs">Ninguna especificada</span>
            )}
          </div>
          <div className="mb-3">
            <h4 className="text-md font-semibold text-[#026937]">Áreas de Trabajo</h4>
            {selectedJobAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedJobAreas.map(area => (
                  <span key={area.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {area.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-xs">Ninguna especificada</span>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">Cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
