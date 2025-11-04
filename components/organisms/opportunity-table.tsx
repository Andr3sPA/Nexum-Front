"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OpportunityService, OpportunityResponse, OpportunityCandidate } from "@/lib/services/opportunity";
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

  // Hire modal state - Multiple selection
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityResponse | null>(null);
  const [candidates, setCandidates] = useState<OpportunityCandidate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [hasMoreCandidates, setHasMoreCandidates] = useState(true);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set());
  const [initialHiredIds, setInitialHiredIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

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

  // Hire modal functions - Multiple selection
  const openHireModal = async (opp: OpportunityResponse) => {
    setSelectedOpp(opp);
    setHireModalOpen(true);
    setSearchText("");
    setCurrentPage(0);
    setCandidates([]);
    setSelectedCandidateIds(new Set());
    setHasMoreCandidates(true);
    
    // Load initial hired candidates
    try {
      const hired = await OpportunityService.getHiredCandidates(opp.id);
      setInitialHiredIds(hired);
      setSelectedCandidateIds(new Set(hired));
    } catch (err: any) {
      console.error("Error loading hired candidates:", err);
      setInitialHiredIds([]);
    }
  };

  const closeHireModal = () => {
    setHireModalOpen(false);
    setSelectedOpp(null);
    setCandidates([]);
    setSearchText("");
    setSelectedCandidateIds(new Set());
    setInitialHiredIds([]);
    setCurrentPage(0);
  };

  // Debounced search for candidates
  useEffect(() => {
    if (!hireModalOpen || !selectedOpp) return;
    
    const timer = setTimeout(() => {
      setCurrentPage(0);
      setCandidates([]);
      setHasMoreCandidates(true);
      // Directly fetch with current searchText
      fetchCandidatesWithSearch(0, searchText);
    }, 300);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [searchText, hireModalOpen, selectedOpp]);

  const fetchCandidatesWithSearch = async (page: number, query: string) => {
    if (!selectedOpp) return;
    
    console.log('[fetchCandidatesWithSearch] Called with:', { page, query, oppId: selectedOpp.id });
    
    setCandidatesLoading(true);
    try {
      const results = await OpportunityService.searchCandidates(selectedOpp.id, query, page);
      
      console.log('[fetchCandidatesWithSearch] Results:', results);
      console.log('[fetchCandidatesWithSearch] Results length:', results.length);
      
      if (page === 0) {
        setCandidates(results);
      } else {
        setCandidates(prev => [...prev, ...results]);
      }
      setHasMoreCandidates(results.length === 5); // Size is fixed at 5
      setCurrentPage(page);
    } catch (err: any) {
      console.error('[fetchCandidatesWithSearch] Error:', err);
      const msg = err.message || "";
      if (msg.includes("401")) {
        toast({ title: "Sesión expirada", description: "Por favor inicia sesión nuevamente." });
        window.location.href = "/login";
      } else if (msg.includes("403")) {
        toast({ title: "Sin permisos", description: "No tiene permisos para esta acción." });
      } else {
        toast({ title: "Error", description: msg || "Error al buscar candidatos" });
      }
      setCandidates([]);
    } finally {
      setCandidatesLoading(false);
    }
  };

  const fetchCandidates = async (page: number, reset: boolean = false) => {
    await fetchCandidatesWithSearch(page, searchText);
  };

  const loadMoreCandidates = () => {
    if (candidatesLoading || !hasMoreCandidates) return;
    fetchCandidatesWithSearch(currentPage + 1, searchText);
  };

  const toggleCandidate = (candidateId: string) => {
    setSelectedCandidateIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  };

  const saveHiredCandidates = async () => {
    if (!selectedOpp || saving) return;
    setSaving(true);
    try {
      const idsArray = Array.from(selectedCandidateIds);
      await OpportunityService.saveHiredCandidates(selectedOpp.id, idsArray);
      toast({ 
        title: "Guardado exitoso", 
        description: `${idsArray.length} candidato(s) marcado(s) como contratado(s)` 
      });
      closeHireModal();
      // Optionally refetch opportunities to update the table
      fetchOpportunities();
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("401")) {
        toast({ title: "Sesión expirada", description: "Por favor inicia sesión nuevamente." });
        window.location.href = "/login";
      } else if (msg.includes("403")) {
        toast({ title: "Sin permisos", description: "No tiene permisos para esta acción." });
      } else {
        toast({ title: "Error", description: msg || "Error al guardar contratados" });
      }
    } finally {
      setSaving(false);
    }
  };

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

        setSalaryRanges(salaryRangesData.filter((item, index, arr) => arr.findIndex(i => i.salary === item.salary) === index));
        setPrograms(programsData.filter((item, index, arr) => arr.findIndex(i => i.name === item.name) === index));
        setProgramCompetencies(competenciesData.filter((item, index, arr) => arr.findIndex(i => i.name === item.name) === index));
        setJobAreas(jobAreasData.filter((item, index, arr) => arr.findIndex(i => i.name === item.name) === index));
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

  // Helper: verificar si una oportunidad NO está expirada (compara por fecha, ignora hora)
  const isNotExpired = (dateStr?: string) => {
    if (!dateStr) return true; // si no hay fecha, no la consideramos expirada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    const onlyDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return onlyDate >= today;
  };

  // Base list según rol: egresados (GRADUATE) solo ven activas y vigentes a la fecha
  const baseOpportunities = (user && user.role === ROLES.GRADUATE)
    ? opportunities.filter(o => o.status.replace(/\s+/g, '_').toUpperCase() === 'ACTIVE' && isNotExpired(o.expirationDate))
    : opportunities;

  // Filtrar y ordenar oportunidades
  const filteredOpportunities = baseOpportunities
    .filter(opp =>
      (!search || opp.title.toLowerCase().includes(search.toLowerCase()) || opp.description.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || opp.status.replace(/\s+/g, '_').toUpperCase() === filterStatus) &&
      (!filterProgram || opp.coursedPrograms?.includes(filterProgram)) &&
      (!filterArea || opp.jobAreas?.includes(filterArea)) &&
      (!filterModality || opp.workModality.replace(/\s+/g, '_').toUpperCase() === filterModality) &&
      (!filterSalary || String(opp.salaryRangeId) === filterSalary)
    )
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof OpportunityResponse];
      let bValue: any = b[sortField as keyof OpportunityResponse];
      if (sortField === "expirationDate") {
        aValue = a.expirationDate || "";
        bValue = b.expirationDate || "";
      }
      if (sortField === "jobAreas") {
        aValue = a.jobAreas?.join(', ') || '';
        bValue = b.jobAreas?.join(', ') || '';
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
            <option value="DRAFT">Borrador</option>
            <option value="ACTIVE">Activo</option>
            <option value="CLOSED">Cerrado</option>
            <option value="EXPIRED">Expirado</option>
            <option value="ON_HOLD">En espera</option>
            <option value="CANCELLED">Cancelado</option>
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterProgram} onChange={e => setFilterProgram(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todos los programas</option>
            {programs.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div className="w-48">
          <Select value={filterArea} onChange={e => setFilterArea(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todas las áreas</option>
            {jobAreas.map(a => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
          </Select>
        </div>
        <div className="w-60">
          <Select value={filterModality} onChange={e => setFilterModality(e.target.value)} className="w-full rounded-lg border-[#43b649] focus:ring-2 focus:ring-[#026937] bg-white shadow-sm">
            <option value="">Todas las modalidades</option>
            <option value="REMOTE">Remoto</option>
            <option value="ON_SITE">Presencial</option>
            <option value="HYBRID">Híbrido</option>
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
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('jobAreas')}>
                      Área
                      {sortField === 'jobAreas' && (
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
                    {(user && user.role === ROLES.ADMIN) && (
                      <TableHead>Editar Estado</TableHead>
                    )}
                    {(user && (user.role === ROLES.EMPLOYER || user.role === ROLES.ADMINISTRATIVE || user.role === ROLES.ADMIN || user.role === ROLES.DEAN)) && (
                      <TableHead>Acciones</TableHead>
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
                            const selectedAreas = opp.jobAreas || [];
                            return selectedAreas.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {selectedAreas.slice(0, 2).map((areaName, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {areaName}
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${opp.status.replace(/\s+/g, '_').toUpperCase() === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            opp.status.replace(/\s+/g, '_').toUpperCase() === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                              opp.status.replace(/\s+/g, '_').toUpperCase() === 'CLOSED' ? 'bg-red-100 text-red-800' :
                                opp.status.replace(/\s+/g, '_').toUpperCase() === 'EXPIRED' ? 'bg-gray-100 text-gray-800' :
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
                      {(user && user.role === ROLES.ADMIN) && (
                        <TableCell onClick={e => e.stopPropagation()}>
                          {statusLoadingId === opp.id ? (
                            <div className="flex items-center justify-center h-10">
                              <Loader2 className="animate-spin text-green-700 w-5 h-5" />
                            </div>
                          ) : (
                            <Select
                              value={opp.status.replace(/\s+/g, '_').toUpperCase()}
                              disabled={!!statusLoadingId || applying}
                              className="min-w-[120px] text-xs"
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                setStatusLoadingId(opp.id);
                                try {
                                  // Map UI value (Title Case) -> backend enum (UPPER_SNAKE)
                                  const mapToEnum = (val: string) =>
                                    val.replace(/\s+/g, '_').toUpperCase();
                                  const enumStatus = mapToEnum(newStatus) as 'DRAFT'|'ACTIVE'|'CLOSED'|'EXPIRED'|'ON_HOLD'|'CANCELLED';

                                  await OpportunityService.updateStatus(opp.id, enumStatus);
                                  toast({ title: 'Estado actualizado', description: `Nuevo estado: ${newStatus}` });
                                  fetchOpportunities();
                                } catch (err) {
                                  toast({ title: 'Error al actualizar estado', description: String(err) });
                                } finally {
                                  setStatusLoadingId(null);
                                }
                              }}
                            >
                              <option value="DRAFT">Borrador</option>
                              <option value="ACTIVE">Activo</option>
                              <option value="CLOSED">Cerrado</option>
                              <option value="EXPIRED">Expirado</option>
                              <option value="ON_HOLD">En espera</option>
                              <option value="CANCELLED">Cancelado</option>
                            </Select>
                          )}
                        </TableCell>
                      )}
                      {(user && (user.role === ROLES.EMPLOYER || user.role === ROLES.ADMINISTRATIVE || user.role === ROLES.ADMIN || user.role === ROLES.DEAN)) && (
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditOpportunity && onEditOpportunity(opp)}
                              className="flex items-center justify-center gap-2 w-full"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="font-medium">Editar</span>
                            </Button>
                            {(() => {
                              // Only EMPLOYER and ADMIN can manage hired candidates
                              const canManageHired = user.role === ROLES.EMPLOYER || user.role === ROLES.ADMIN;
                              const isActive = opp.status.replace(/\s+/g, '_').toUpperCase() === 'ACTIVE';
                              
                              if (!canManageHired) return null;
                              
                              return isActive ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openHireModal(opp)}
                                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-green-500 text-green-700 hover:from-emerald-100 hover:to-green-100 hover:border-green-600 hover:shadow-md font-semibold transition-all duration-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Contratados</span>
                                </Button>
                              ) : (
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                                  <p className="text-xs text-gray-500 text-center leading-tight">
                                    Disponible solo cuando está activa
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
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
      
      {/* Hire modal - Multiple selection */}
      {hireModalOpen && selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Gestionar Candidatos Contratados</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona los candidatos que fueron contratados para esta oportunidad
                </p>
              </div>
              <button 
                onClick={closeHireModal} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Buscar candidato por nombre o documento..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {selectedCandidateIds.size > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="font-semibold text-green-700">
                    {selectedCandidateIds.size} candidato(s) seleccionado(s)
                  </span>
                  <button
                    onClick={() => setSelectedCandidateIds(new Set())}
                    className="text-gray-500 hover:text-red-600 underline text-xs"
                  >
                    Limpiar selección
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-4 min-h-[300px]">
              {candidatesLoading && candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-green-600 w-8 h-8 mb-3" />
                  <p className="text-gray-500">Buscando candidatos...</p>
                </div>
              ) : candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-center">No se encontraron candidatos</p>
                  <p className="text-gray-400 text-sm text-center mt-1">Intenta con otro término de búsqueda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {candidates.map(candidate => {
                    const nameParts = [candidate.name, candidate.middleName, candidate.lastname, candidate.secondLastname].filter(part => part && part.trim());
                    const fullName = nameParts.join(" ").trim() || "Sin nombre";
                    const isSelected = selectedCandidateIds.has(candidate.id);
                    
                    return (
                      <div 
                        key={candidate.id} 
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? "bg-green-50 border-green-500 shadow-md" 
                            : "bg-white border-gray-200 hover:border-green-300 hover:bg-gray-50"
                        }`}
                        onClick={() => toggleCandidate(candidate.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{fullName}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap text-sm text-gray-600">
                            {candidate.email && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {candidate.email}
                              </span>
                            )}
                            {candidate.mobile && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {candidate.mobile}
                              </span>
                            )}
                            {(candidate.city || candidate.country) && (
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {[candidate.city, candidate.country].filter(Boolean).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {hasMoreCandidates && (
                    <button
                      onClick={loadMoreCandidates}
                      disabled={candidatesLoading}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {candidatesLoading ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Cargando más...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Cargar más candidatos
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={closeHireModal}
                className="px-6 py-3"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={saving}
                onClick={saveHiredCandidates}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Guardando...
                  </span>
                ) : (
                  `Guardar ${selectedCandidateIds.size} contratado(s)`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail page navigation replaces modal */}

      {/* Confirm dialog removed - applying occurs immediately when pressing "Aplicar" */}
    </div>
  );
}
