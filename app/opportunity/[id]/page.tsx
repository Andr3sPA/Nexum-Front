"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import { OpportunityService, OpportunityResponse } from "@/lib/services/opportunity/opportunity.service";
import { ApplicationService } from "@/lib/services/opportunity";
import { SalaryRangeService, SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramService, ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyService, ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaService, JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { FormSection } from "@/components/atoms/form-section";
import { SectionTitle } from "@/components/atoms/section-title";
import { Briefcase, DollarSign, Calendar, User, Settings, Building, ExternalLink } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { toast } from "@/hooks/use-toast";
import FloatingNotice from "@/components/atoms/floating-notice";

export default function OpportunityPublicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params?.id;
  const id = idParam ? parseInt(String(idParam)) : NaN;

  const [opportunity, setOpportunity] = useState<OpportunityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [programCompetencies, setProgramCompetencies] = useState<ProgramCompetencyResponse[]>([]);
  const [jobAreas, setJobAreas] = useState<JobAreaResponse[]>([]);

  useEffect(() => {
    if (isNaN(id)) {
      setError("ID de oportunidad inválido");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      setLoading(true);
      try {
        // Try public fetch first
        let opp = null;
        let publicErr: any = null;
        try {
          opp = await OpportunityService.getPublicById(id);
        } catch (err: any) {
          // Save the public error and attempt authenticated fallback
          publicErr = err;
          console.warn('Public opportunity fetch failed, will try authenticated fallback if possible', err);
          if (String(err?.message || '').toLowerCase().includes('401') || String(err?.message || '').toLowerCase().includes('unauthorized')) {
            try {
              // dynamic import to avoid pulling auth-dependent code on server
              const { OpportunityService: AuthOppService } = await import('@/lib/services/opportunity/opportunity.service');
              opp = await AuthOppService.getById(id);
            } catch (authErr) {
              // keep authErr in logs but we'll try a session preview next
              console.warn('Authenticated fallback failed', authErr);
            }
          }
        }

        const [salaryData, programsData, competenciesData, jobAreasData] = await Promise.all([
          SalaryRangeService.getAll(),
          ProgramService.getAll(),
          ProgramCompetencyService.getAll(),
          JobAreaService.getAll()
        ]);

        // If we still don't have the opportunity (both public and auth fetch failed), try to use a local preview
        if (!opp) {
          try {
            const raw = sessionStorage.getItem(`opportunity_preview_${id}`);
            if (raw) {
              console.info('Using sessionStorage preview for opportunity', id);
              opp = JSON.parse(raw) as OpportunityResponse;
            }
          } catch (e) {
            console.warn('Failed to read opportunity preview from sessionStorage', e);
          }
        }

        setOpportunity(opp as any);
        setSalaryRanges(salaryData);
        setPrograms(programsData);
        setProgramCompetencies(competenciesData);
        setJobAreas(jobAreasData);
      } catch (err: any) {
        console.error('Error fetching opportunity detail:', err);
        // Provide a clearer error for protected resources
        const message = err?.message || 'No se pudo cargar la oportunidad';
        if (String(message).toLowerCase().includes('401') || String(message).toLowerCase().includes('unauthorized')) {
          setError('Esta oportunidad está protegida. Inicia sesión para verla.');
        } else {
          setError(message);
        }
        toast({ title: 'Error', description: String(message) });
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <div className="text-center text-gray-600">Cargando oportunidad...</div>
        </div>
      </>
    );
  }

  if (error || !opportunity) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-10 p-6">
          <div className="text-center text-red-600">{error || 'Oportunidad no encontrada'}</div>
          <div className="mt-6 text-center flex justify-center gap-3">
            <Button onClick={() => router.back()} variant="outline">Volver</Button>
            {String(error).toLowerCase().includes('proteg') && (
              <Button onClick={() => router.push(`/login?next=/opportunity/${id}`)} variant="primary">Iniciar sesión</Button>
            )}
          </div>
        </div>
      </>
    );
  }

  const salaryRange = salaryRanges.find(sr => sr.id === opportunity.salaryRangeId);
  const selectedPrograms = opportunity.coursedPrograms || [];
  const selectedCompetencies = opportunity.programCompetencies || [];
  const selectedJobAreas = opportunity.jobAreas || [];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6">
        <FloatingNotice>
          La Universidad de Antioquia no se hace responsable por las
          oportunidades publicadas en este portal, las cuales son responsabilidad exclusiva
          de las entidades que las ofrecen. No nos hacemos responsables por el contenido,
          veracidad o vigencia de dichas publicaciones. Para postularse, debe hacerlo
          directamente a través de los enlaces externos proporcionados. En caso de no contar
          con un enlace, contacte a la organización por correo electrónico.
        </FloatingNotice>
        <SectionTitle>Detalle de Oportunidad</SectionTitle>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>{opportunity.title}</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormSection
                icon={Briefcase}
                title="Información Básica"
                description="Detalles principales de la oportunidad"
                color="blue"
              >
                <div>
                  <div className="mb-2"><strong>Descripción:</strong></div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{opportunity.description}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2"><strong>Ubicación:</strong> <span className="text-gray-600">{opportunity.location || '-'}</span></div>
                    <div className="mb-2"><strong>Modalidad:</strong> <span className="text-gray-600">{opportunity.workModality}</span></div>
                    <div className="mb-2"><strong>Rango Salarial:</strong> <span className="text-gray-600">{salaryRange ? salaryRange.salary : '-'}</span></div>
                    <div className="mb-2"><strong>Estado:</strong> <span className="text-gray-600">{opportunity.status}</span></div>
                    <div className="mb-2"><strong>Fecha de expiración:</strong> <span className="text-gray-600">{opportunity.expirationDate ? new Date(opportunity.expirationDate).toLocaleDateString('es-ES') : '-'}</span></div>
                  </div>
                  <div>
                    <div className="mb-2"><strong>Empresa:</strong> <span className="text-gray-600">{opportunity.businessContact?.businessName || opportunity.businessName || '-'}</span></div>
                    <div className="mb-2"><strong>Contacto:</strong> <span className="text-gray-600">{opportunity.businessContact?.contactName || opportunity.contactName || '-'}</span></div>
                    <div className="mb-2"><strong>Email:</strong> <span className="text-gray-600">{opportunity.businessContact?.businessEmail || opportunity.businessEmail || '-'}</span></div>
                    <div className="mb-2"><strong>Teléfono:</strong> <span className="text-gray-600">{opportunity.businessContact?.businessPhone || opportunity.businessPhone || '-'}</span></div>
                  </div>
                </div>
              </FormSection>

              <FormSection icon={User} title="Programas relacionados" description="Programas asociados a la oportunidad" color="purple">
                {selectedPrograms.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedPrograms.map((program, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{program}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-1">Ninguno especificado</div>
                )}
              </FormSection>

              <FormSection icon={Settings} title="Competencias requeridas" description="Habilidades y competencias solicitadas" color="green">
                {selectedCompetencies.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedCompetencies.map((competency, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{competency}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-1">Ninguna especificada</div>
                )}
              </FormSection>

              <FormSection icon={Briefcase} title="Áreas de trabajo" description="Áreas relacionadas con la oferta" color="blue">
                {selectedJobAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedJobAreas.map((area, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{area}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-1">Ninguna especificada</div>
                )}
              </FormSection>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <Button variant="outline" onClick={() => router.back()}>Volver</Button>
              {opportunity.link && (
                <Button
                  onClick={() => {
                    // Abrir link y hacer POST simultáneamente
                    window.open(opportunity.link, '_blank', 'noopener');
                    // Hacer POST sin esperar respuesta
                    ApplicationService.apply({ opportunityId: opportunity.id })
                      .then(() => {
                        toast({ title: 'Aplicación enviada exitosamente' });
                      })
                      .catch((error: any) => {
                        toast({ title: 'Error al enviar aplicación', description: String(error) });
                      });
                  }}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-green-600 text-white text-sm gap-2 hover:bg-green-700"
                >
                  Ver más información
                  <ExternalLink className="w-4 h-4 ml-1 text-white opacity-80" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
