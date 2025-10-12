"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OpportunityService, OpportunityResponse } from "@/lib/services/opportunity";
import { ApplicationService } from "@/lib/services/opportunity";
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile";
import { ROLES } from "@/lib/services/constants/api.constants";
import { toast } from "@/hooks/use-toast";
import { SalaryRangeService, SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramService, ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyService, ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaService, JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/atoms/table";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { SectionTitle } from "@/components/atoms/section-title";
import { EmptyStateCard } from "@/components/atoms/empty-state-card";
import { Briefcase, Edit } from "lucide-react";
// Dialog removed: applying now happens immediately without confirmation

interface OpportunityTableProps {
  refetchTrigger?: number;
  onEditOpportunity?: (opportunity: OpportunityResponse) => void;
  user?: (AuthenticatedUserResponse & Partial<DetailedUserResponse>) | null;
  onApplicationRefetch?: () => void;
}

export default function OpportunityTable({ refetchTrigger, onEditOpportunity, user, onApplicationRefetch }: OpportunityTableProps) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // Catalog data state
  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [programCompetencies, setProgramCompetencies] = useState<ProgramCompetencyResponse[]>([]);
  const [jobAreas, setJobAreas] = useState<JobAreaResponse[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  const handleApplyClick = async (opportunityId: number) => {
    setApplying(true);
    const opp = opportunities.find(o => o.id === opportunityId);

    const openLinkIfPresent = (link?: string | null) => {
      if (!link) return false;
      const raw = String(link).trim();
      let normalized: string | null = null;
      try {
        if (/^https?:\/\//i.test(raw)) {
          normalized = raw;
        } else if (/^\/\//.test(raw)) {
          normalized = window.location.protocol + raw;
        } else if (raw.startsWith('/')) {
          normalized = window.location.origin + raw;
        } else if (raw.includes('.') && !raw.includes(' ')) {
          normalized = 'https://' + raw;
        }

        if (normalized) {
          const a = document.createElement('a');
          a.href = normalized;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          a.remove();
          return true;
        }
      } catch (e) {
        console.warn('Error opening opportunity link', link, e);
      }
      return false;
    };

    try {
      // If the list item already contains a link, open it and apply internally
      if (opp && opp.link) {
        console.debug('[apply] Found link on list item:', opp.link);
        const opened = openLinkIfPresent(opp.link);
        console.debug('[apply] openLinkIfPresent returned:', opened);
        try {
          await ApplicationService.apply({ opportunityId });
          toast({ title: 'Aplicación enviada exitosamente' });
          if (onApplicationRefetch) onApplicationRefetch();
        } catch (e) {
          console.warn('Error applying internally after opening link', e);
          toast({ title: 'Error al enviar aplicación', description: String(e) });
        }
        setApplying(false);
        return;
      }

      // Otherwise attempt to fetch the full opportunity (some APIs omit fields in list) and open its link
      // Open a blank window now to avoid popup blocking when we later set location
      let newWin: Window | null = null;
      try {
        newWin = window.open('', '_blank');
        try { if (newWin) (newWin as any).opener = null; } catch (e) {}
        console.debug('[apply] Opened blank window:', !!newWin);
      } catch (err) {
        newWin = null;
        console.debug('[apply] Failed to open blank window:', err);
      }

      try {
        let full = null;
        try {
          // Try authenticated fetch first
          full = await OpportunityService.getById(opportunityId);
          console.debug('[apply] Fetched full opportunity (auth):', full);
        } catch (authErr) {
          console.debug('[apply] Authenticated fetch failed, trying public fetch:', authErr);
          // Fallback to public fetch
          full = await OpportunityService.getPublicById(opportunityId);
          console.debug('[apply] Fetched full opportunity (public):', full);
        }
        if (full && full.link) {
          console.debug('[apply] Found link on full opportunity:', full.link);
          const raw = String(full.link).trim();
          let normalized: string | null = null;
          if (/^https?:\/\//i.test(raw)) {
            normalized = raw;
          } else if (/^\/\//.test(raw)) {
            normalized = window.location.protocol + raw;
          } else if (raw.startsWith('/')) {
            normalized = window.location.origin + raw;
          } else if (raw.includes('.') && !raw.includes(' ')) {
            normalized = 'https://' + raw;
          }
          console.debug('[apply] Normalized URL:', normalized);

          if (normalized) {
            if (newWin) {
              try {
                console.debug('[apply] Setting newWin.location.href to normalized');
                newWin.location.href = normalized;
              } catch (e) {
                console.warn('[apply] Setting newWin.location.href failed, fallback to window.open', e);
                try { newWin.close(); } catch (_) {}
                window.open(normalized, '_blank', 'noopener');
              }
            } else {
              console.debug('[apply] Opening normalized in new window directly');
              window.open(normalized, '_blank', 'noopener');
            }

            // register application regardless
            try {
              await ApplicationService.apply({ opportunityId });
              toast({ title: 'Aplicación enviada exitosamente' });
              if (onApplicationRefetch) onApplicationRefetch();
            } catch (e) {
              console.warn('Error applying internally after opening link', e);
              toast({ title: 'Error al enviar aplicación', description: String(e) });
            }

            setApplying(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Could not fetch full opportunity before applying', e);
      }

      // If we opened a blank window but couldn't use it, close it
      try {
        if (newWin && !newWin.location?.href) {
          console.debug('[apply] Closing blank window because no link found');
          newWin.close();
        }
      } catch (e) {
        // ignore
      }

      // No link available: still apply internally immediately (no confirmation)
      try {
        await ApplicationService.apply({ opportunityId });
        toast({ title: 'Aplicación enviada exitosamente' });
        if (onApplicationRefetch) onApplicationRefetch();
      } catch (e) {
        console.warn('Error applying internally (no link)', e);
        toast({ title: 'Error al enviar aplicación', description: String(e) });
      }

    } finally {
      setApplying(false);
    }
  };

  const handleRowClick = (opportunityId: number) => {
    try {
      console.debug('[opportunity-table] row clicked, navigating to', opportunityId);
      try {
        // store a preview of the opportunity so the detail page can use it if the public API is protected
        sessionStorage.setItem(`opportunity_preview_${opportunityId}`, JSON.stringify(opportunities.find(o => o.id === opportunityId) || {}));
      } catch (e) {
        // ignore sessionStorage errors
      }
      router.push(`/opportunity/${opportunityId}`);
    } catch (e) {
      console.warn('[opportunity-table] navigation failed', e);
    }
  };

  // Confirmation dialog removed: applying happens immediately in handleApplyClick

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use public endpoint to show opportunities to everyone
      const data = user ? await OpportunityService.list() : await OpportunityService.listPublic();
      if (Array.isArray(data)) {
        setOpportunities(data);
      } else {
        setOpportunities([]);
        setError("No se pudo obtener la lista de oportunidades (respuesta inesperada del servidor).");
      }
    } catch (err: any) {
      setOpportunities([]);
      setError("No se pudo obtener la lista de oportunidades. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch catalog data
  useEffect(() => {
    const fetchCatalogData = async () => {
      setCatalogLoading(true);
      try {
        const [salaryRangesData, programsData, competenciesData, jobAreasData] = await Promise.all([
          SalaryRangeService.getAll(),
          ProgramService.getAll(),
          ProgramCompetencyService.getAll(),
          JobAreaService.getAll()
        ]);

        setSalaryRanges(salaryRangesData);
        setPrograms(programsData);
        setProgramCompetencies(competenciesData);
        setJobAreas(jobAreasData);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        // Don't show toast here as it might be too intrusive
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchCatalogData();
  }, []); // Fetch catalog data on component mount, no dependency on user

  useEffect(() => {
    fetchOpportunities();
  }, [refetchTrigger]);

  return (
    <div className="mt-10">
      <SectionTitle>Oportunidades Registradas</SectionTitle>
      {loading ? (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardContent className="p-8">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                Cargando oportunidades...
              </div>
            </div>
          </CardContent>
        </Card>
       ) : error ? (
         <div className="mt-6">
           <div className="text-red-600 text-center font-medium">{error}</div>
         </div>
       ) : opportunities.length === 0 ? (
         <div className="mt-6">
           <EmptyStateCard
             icon={Briefcase}
             title="No hay oportunidades disponibles"
             description="No se encontraron oportunidades disponibles en este momento. Revisa más tarde para nuevas oportunidades."
             color="blue"
           />
         </div>
      ) : (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Lista de Oportunidades
              </div>
              <span className="text-sm font-normal text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                {opportunities.length} {opportunities.length === 1 ? 'oportunidad' : 'oportunidades'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Rango Salarial</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Expiración</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp, index) => (
                    <TableRow
                      key={opp.id}
                      className={index % 2 === 0 ? "bg-white cursor-pointer" : "bg-gray-50 cursor-pointer"}
                      onClick={() => { handleRowClick(opp.id); }}
                    >
                      <TableCell className="font-medium">
                        <Link href={`/opportunity/${opp.id}`} className="block">{opp.title}</Link>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={opp.description}>
                          {opp.description}
                        </div>
                      </TableCell>
                      <TableCell>{opp.location}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {opp.workModality}
                        </span>
                      </TableCell>
                       <TableCell>
                         {(() => {
                           const salaryRange = salaryRanges.find(sr => sr.id === opp.salaryRangeId);
                            return salaryRange ? (
                              <div className="text-sm">
                                <span className="font-medium">
                                  {salaryRange.salary}
                                </span>
                              </div>
                            ) : (
                             <span className="text-gray-400">-</span>
                           );
                         })()}
                       </TableCell>
                        <TableCell>
                          {(() => {
                            const selectedAreas = jobAreas.filter(ja => opp.jobAreaIds?.includes(ja.id));
                            return selectedAreas.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {selectedAreas.slice(0, 2).map(area => (
                                  <span key={area.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {area.name}
                                  </span>
                                ))}
                                {selectedAreas.length > 2 && (
                                  <span className="text-xs text-gray-500">+{selectedAreas.length - 2}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            );
                          })()}
                        </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${opp.status === 'Active' ? 'bg-green-100 text-green-800' :
                            opp.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                              opp.status === 'Closed' ? 'bg-red-100 text-red-800' :
                                opp.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                                  'bg-blue-100 text-blue-800'
                          }`}>
                          {opp.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {opp.expirationDate ? new Date(opp.expirationDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user && user.role === ROLES.EMPLOYER && onEditOpportunity && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={e => { e.stopPropagation(); onEditOpportunity(opp); }}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                          )}
                          {user && user.role === ROLES.GRADUATE && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={e => { e.stopPropagation(); handleApplyClick(opp.id); }}
                              disabled={applying}
                              className="flex items-center gap-2"
                            >
                              {applying ? "Aplicando..." : "Aplicar"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Detail page navigation replaces modal */}

      {/* Confirm dialog removed - applying occurs immediately when pressing "Aplicar" */}
    </div>
  );
}
