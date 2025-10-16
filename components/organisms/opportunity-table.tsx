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
import { Select } from "@/components/atoms/select";
import { Loader2 } from "lucide-react";
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
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
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

  // Filtros y ordenamiento
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [filterModality, setFilterModality] = useState("");
  const [filterSalary, setFilterSalary] = useState("");
  const [sortField, setSortField] = useState("expirationDate");
  const [sortOrder, setSortOrder] = useState<"asc"|"desc">("desc");
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filtrar y ordenar oportunidades
  const filteredOpportunities = opportunities
    .filter(opp =>
      (!search || opp.title.toLowerCase().includes(search.toLowerCase()) || opp.description.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || opp.status === filterStatus) &&
      (!filterProgram || opp.coursedProgramIds?.includes(Number(filterProgram))) &&
      (!filterArea || opp.jobAreaIds?.includes(Number(filterArea))) &&
      (!filterModality || opp.workModality === filterModality) &&
      (!filterSalary || String(opp.salaryRangeId) === filterSalary)
    )
    .sort((a, b) => {
      let aValue = a[sortField as keyof OpportunityResponse];
      let bValue = b[sortField as keyof OpportunityResponse];
      if (sortField === "expirationDate") {
        aValue = a.expirationDate || "";
        bValue = b.expirationDate || "";
      }
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="mt-10">
      <SectionTitle>Oportunidades Registradas</SectionTitle>
      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 items-end mb-6 mt-4 bg-[#f3f8f4] p-4 rounded-xl shadow-sm">
  <div className="w-80">
          <div className="relative">
            <input
              type="text"
              className="w-full h-10 rounded-lg border border-[#43b649] bg-white px-4 pr-10 text-sm focus:ring-2 focus:ring-[#026937] shadow-sm placeholder:text-neutral-400"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontFamily: 'inherit' }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#43b649] pointer-events-none">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#43b649" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.5 6.5a7.5 7.5 0 0 0 10.6 10.6Z"/></svg>
            </span>
          </div>
        </div>
        <div className="w-48">
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todos los estados</option>
            <option value="Draft">Borrador</option>
            <option value="Active">Activo</option>
            <option value="Closed">Cerrado</option>
            <option value="Expired">Expirado</option>
            <option value="On Hold">En espera</option>
            <option value="Cancelled">Cancelado</option>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todos los programas</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todas las áreas</option>
            {jobAreas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </Select>
        </div>
        <div className="w-60">
          <Select value={filterModality} onChange={e => setFilterModality(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todas las modalidades</option>
            <option value="Remote">Remoto</option>
            <option value="On Site">Presencial</option>
            <option value="Hybrid">Híbrido</option>
          </Select>
        </div>
        <div className="w-60">
          <Select value={filterSalary} onChange={e => setFilterSalary(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todos los rangos salariales</option>
            {salaryRanges.map(s => (
              <option key={s.id} value={s.id}>{s.salary}</option>
            ))}
          </Select>
        </div>
      </div>
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
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('title')}>
                      Título
                      {sortField === 'title' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('description')}>
                      Descripción
                      {sortField === 'description' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('location')}>
                      Ubicación
                      {sortField === 'location' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('workModality')}>
                      Modalidad
                      {sortField === 'workModality' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('salaryRangeId')}>
                      Rango Salarial
                      {sortField === 'salaryRangeId' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('jobAreaIds')}>
                      Área
                      {sortField === 'jobAreaIds' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('status')}>
                      Estado
                      {sortField === 'status' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('expirationDate')}>
                      Fecha Expiración
                      {sortField === 'expirationDate' && (
                        <span className="ml-1 align-middle">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </TableHead>
                    {(user && (user.role === ROLES.DEAN || user.role === ROLES.ADMIN)) && (
                      <TableHead>Editar Estado</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.map((opp, index) => (
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
                      {(user && (user.role === ROLES.DEAN || user.role === ROLES.ADMIN)) && (
                        <TableCell onClick={e => e.stopPropagation()}>
                          {statusLoadingId === opp.id ? (
                            <div className="flex items-center justify-center h-10">
                              <Loader2 className="animate-spin text-green-700 w-5 h-5" />
                            </div>
                          ) : (
                            <Select
                              value={opp.status}
                              disabled={!!statusLoadingId || applying}
                              className="min-w-[120px] text-xs"
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                setStatusLoadingId(opp.id);
                                try {
                                  // cast to any to satisfy the OpportunityStatus typing from the service
                                  // Asegura que complementaryStudies y otros campos requeridos no sean undefined
                                  const updatePayload = {
                                    ...opp,
                                    status: newStatus as any,
                                    complementaryStudies: opp.complementaryStudies ?? "",
                                    travelAvailability: opp.travelAvailability ?? false,
                                  };
                                  await OpportunityService.update(opp.id, updatePayload);
                                  toast({ title: 'Estado actualizado', description: `Nuevo estado: ${newStatus}` });
                                  fetchOpportunities();
                                } catch (err) {
                                  toast({ title: 'Error al actualizar estado', description: String(err) });
                                } finally {
                                  setStatusLoadingId(null);
                                }
                              }}
                            >
                              <option value="Draft">Borrador</option>
                              <option value="Active">Activo</option>
                              <option value="Closed">Cerrado</option>
                              <option value="Expired">Expirado</option>
                              <option value="On Hold">En espera</option>
                              <option value="Cancelled">Cancelado</option>
                            </Select>
                          )}
                        </TableCell>
                      )}
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
