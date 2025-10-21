"use client";

import Navbar from "@/components/navbar";
import OpportunityTable from "@/components/organisms/opportunity-table";
import { OpportunityCreationForm } from "@/components/organisms/opportunity-creation-form";
import { OpportunityConfirmationDialog } from "@/components/organisms/opportunity-confirmation-dialog";
import FloatingNotice from "@/components/atoms/floating-notice";

import { toast } from "@/hooks/use-toast";
import { ROLES } from "@/lib/services/constants/api.constants";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { OpportunityRequest, OpportunityResponse, OpportunityService } from "@/lib/services/opportunity/opportunity.service";
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile";
import { EmployerService, EmployerProfileResponse } from "@/lib/services/profile/employer.service";
import { SalaryRangeService, SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramService, ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyService, ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaService, JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, DollarSign, Calendar, User, Settings, Building } from "lucide-react";

import { logger } from "@/lib/logging";

export default function EmployerOpportunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showRegister = searchParams.get("register") === "1";
  const [user, setUser] = useState<(AuthenticatedUserResponse & Partial<DetailedUserResponse>) | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfileResponse | null>(null);
  const [form, setForm] = useState<OpportunityRequest>({
    title: "",
    description: "",
    location: "",
    status: "Draft",
    salaryRangeId: 0,

    // Business information
    businessName: "",
    contactName: "",
    businessEmail: "",
    businessPhone: "",
  link: '',

    complementaryStudies: "",
    requiredExperience: "Not specified",
    travelAvailability: false,
    workModality: "On Site",
    expirationDate: "",

    // Multiple selections
    coursedProgramIds: [],
    programCompetencyIds: [],
    jobAreaIds: []
  });
  const [loading, setLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [editingOpportunity, setEditingOpportunity] = useState<OpportunityResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [lastCreatedOpportunity, setLastCreatedOpportunity] = useState<{ editCode?: string } | null>(null);


  // Confirmation dialog state
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<OpportunityRequest | null>(null);

  // Dropdown visibility states
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [showCompetencyDropdown, setShowCompetencyDropdown] = useState(false);
  const [showJobAreaDropdown, setShowJobAreaDropdown] = useState(false);

  // Search states
  const [programSearch, setProgramSearch] = useState("");
  const [competencySearch, setCompetencySearch] = useState("");
  const [jobAreaSearch, setJobAreaSearch] = useState("");

  // Catalog data state
  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([]);
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [programCompetencies, setProgramCompetencies] = useState<ProgramCompetencyResponse[]>([]);
  const [jobAreas, setJobAreas] = useState<JobAreaResponse[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);


  useEffect(() => {
    // Solo se ejecuta en el cliente
    const storedUser = LocalStorageService.getItem<AuthenticatedUserResponse>("user");
    const storedUserProfile = LocalStorageService.getItem<DetailedUserResponse>("userProfile");
    const currentUser = storedUser && storedUserProfile ? { ...storedUser, ...storedUserProfile } : null;
    setUser(currentUser);

    // If user is not authenticated and not trying to create opportunity, redirect to login
    if (!currentUser && !showRegister) {
      router.push("/login");
    }

    // Fetch employer profile if user is an employer
    if (currentUser && currentUser.role === ROLES.EMPLOYER) {
      // First check localStorage
      const storedEmployerProfile = LocalStorageService.getItem<EmployerProfileResponse>("employerProfile");
      if (storedEmployerProfile) {
        setEmployerProfile(storedEmployerProfile);
      }

      // Then try to fetch from API
      const fetchEmployerProfile = async () => {
        try {
          const employerData = await EmployerService.getCurrentEmployer();
          setEmployerProfile(employerData);
          // Update localStorage with fresh data
          LocalStorageService.setItem("employerProfile", employerData);
        } catch (error) {
          console.error("Error fetching employer profile:", error);
          // Keep the localStorage data if API fails
        }
      };
      fetchEmployerProfile();
    }
  }, [router, showRegister]);

  // Fetch catalog data
  useEffect(() => {
    const fetchCatalogData = async () => {

      setCatalogLoading(true);
      try {
        const [salaryRangesData, programsData] = await Promise.all([
          SalaryRangeService.getAll(),
          ProgramService.getAll()
        ]);

        setSalaryRanges(salaryRangesData);
        setPrograms(programsData);
        logger.info("Fetched catalog data", { salaryRanges: salaryRangesData, programs: programsData });
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        toast({ title: "Error al cargar datos del catálogo", description: String(error) });
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchCatalogData();
  }, []);

  // Fetch all competencies and job areas (no longer cascading since we allow multiple selections)
  useEffect(() => {
    const fetchCatalogData = async () => {
      try {
        const [competenciesData, jobAreasData] = await Promise.all([
          ProgramCompetencyService.getAll(),
          JobAreaService.getAll()
        ]);

        setProgramCompetencies(competenciesData);
        setJobAreas(jobAreasData);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        toast({ title: "Error al cargar datos del catálogo", description: String(error) });
      }
    };

    if (!catalogLoading) {
      fetchCatalogData();
    }
  }, [catalogLoading]);

  // Auto-fill form with employer data when available
  useEffect(() => {
    if (employerProfile && user && user.role === ROLES.EMPLOYER && !isEditMode) {
      setForm(prev => ({
        ...prev,
        businessName: employerProfile.businessName || "",
        contactName: employerProfile.name || "",
        businessEmail: employerProfile.email || "",
        businessPhone: employerProfile.phone || "",
      }));
    }
  }, [employerProfile, user, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'travelAvailability') {
      setForm(prev => ({
        ...prev,
        travelAvailability: (e.target as HTMLInputElement).checked
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setForm(prev => ({
      ...prev,
      [name]: values.map(v => parseInt(v))
    }));
  };



  const handleEditOpportunity = (opportunity: OpportunityResponse) => {
    setEditingOpportunity(opportunity);
    setIsEditMode(true);

    // Convert OpportunityResponse to OpportunityRequest format
    setForm({
      title: opportunity.title,
      description: opportunity.description,
      location: opportunity.location,
      status: opportunity.status,
      salaryRangeId: opportunity.salaryRangeId,

      // Business information
      businessName: opportunity.businessName || "",
      contactName: opportunity.contactName || "",
      businessEmail: opportunity.businessEmail || "",
      businessPhone: opportunity.businessPhone || "",
  link: opportunity.link || '',

      complementaryStudies: opportunity.complementaryStudies || "",
      requiredExperience: opportunity.requiredExperience,
      travelAvailability: opportunity.travelAvailability || false,
      workModality: opportunity.workModality,
      expirationDate: opportunity.expirationDate,

      // Multiple selections
      coursedProgramIds: opportunity.coursedProgramIds || [],
      programCompetencyIds: opportunity.programCompetencyIds || [],
      jobAreaIds: opportunity.jobAreaIds || []
    });

    // Navigate to register view
    router.push("?register=1");
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      status: "Draft",
      salaryRangeId: 0,

      // Business information
      businessName: "",
      contactName: "",
      businessEmail: "",
      businessPhone: "",
  link: '',
      complementaryStudies: "",
      requiredExperience: "Not specified",
      travelAvailability: false,
      workModality: "On Site",
      expirationDate: "",

      // Multiple selections
      coursedProgramIds: [],
      programCompetencyIds: [],
      jobAreaIds: []
    });
    setEditingOpportunity(null);
    setIsEditMode(false);
    // Reset cascading dropdowns
    setProgramCompetencies([]);
    setJobAreas([]);
    // Reset search states
    setProgramSearch("");
    setCompetencySearch("");
    setJobAreaSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate link is present and is a valid URL
    if (!form.link) {
      alert('El campo "Enlace para aplicar a oportunidad" es obligatorio.');
      return;
    }
    try {
      new URL(form.link);
    } catch (err) {
      alert('El enlace ingresado no es una URL válida.');
      return;
    }

    // If user is anonymous, redirect to login with employer registration
    if (!user) {
      // Create the opportunity first (as anonymous)
      try {
        setLoading(true);
        const createdOpportunity = await OpportunityService.create(form);
        setLastCreatedOpportunity(createdOpportunity);

        // Redirect to login with employer registration parameters
        const params = new URLSearchParams({
          employer: "1",
          contactName: form.contactName || "",
          email: form.businessEmail || "",
          phone: form.businessPhone || "",
          businessName: form.businessName || "",
          editCode: createdOpportunity.editCode || ""
        });

        router.push(`/register?${params.toString()}`);
        return;
      } catch (error) {
        console.error('Error creating opportunity:', error);
        alert('Error al crear la oportunidad. Por favor intenta de nuevo.');
        setLoading(false);
        return;
      }
    }

    // Show confirmation dialog for authenticated users
    setPendingFormData(form);
    setShowConfirmationDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingFormData) return;

    setShowConfirmationDialog(false);
    setLoading(true);

    try {
      // Validate link in pending data as well
      if (!pendingFormData.link) {
        toast({ title: 'El campo "Enlace para aplicar a oportunidad" es obligatorio.' });
        setLoading(false);
        return;
      }
      try {
        new URL(pendingFormData.link);
      } catch (err) {
        toast({ title: 'El enlace ingresado no es una URL válida.' });
        setLoading(false);
        return;
      }

      if (isEditMode && editingOpportunity) {
        // Update existing opportunity
        await OpportunityService.update(editingOpportunity.id, pendingFormData);
        toast({ title: "Oportunidad actualizada exitosamente" });
      } else {
        // Create new opportunity
        const createdOpportunity = await OpportunityService.create(pendingFormData);
        setLastCreatedOpportunity(createdOpportunity);
        toast({ title: "Oportunidad registrada exitosamente" });
      }

      // Reset form and state
      resetForm();

      // Trigger refetch of opportunities table
      setRefetchTrigger(prev => prev + 1);
      router.push("/opportunity?register=1");
    } catch (error) {
      toast({
        title: isEditMode ? "Error al actualizar oportunidad" : "Error al registrar oportunidad",
        description: String(error)
      });
    } finally {
      setLoading(false);
      setPendingFormData(null);
    }
  };



  return (
    <>
      <Navbar user={user} />
    <div className="max-w-6xl mx-auto mt-10 p-6">
  <FloatingNotice position="inline" persist={false} prominent={isEditMode}>
          
          Las oportunidades publicadas en este portal son responsabilidad exclusiva de las entidades que las ofrecen. No nos hacemos responsables por el contenido, veracidad o vigencia de dichas publicaciones.

          Para postularse, debe hacerlo directamente a través de los enlaces externos proporcionados. En caso de no contar con un enlace, contacte a la organización por correo electrónico.
        </FloatingNotice>
        {showRegister && (user ? (user.role === ROLES.EMPLOYER || user.role === ROLES.ADMINISTRATIVE) : true) && (
          <OpportunityCreationForm
            form={form}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onMultiSelectChange={handleMultiSelectChange}
            onSubmit={handleSubmit}
            onCancel={isEditMode ? () => {
              resetForm();
              router.push("/opportunity");
            } : undefined}
            loading={loading}
            isEditMode={isEditMode}
            salaryRanges={salaryRanges}
            programs={programs}
            programCompetencies={programCompetencies}
            jobAreas={jobAreas}
            catalogLoading={catalogLoading}
            programSearch={programSearch}
            onProgramSearchChange={setProgramSearch}
            showProgramDropdown={showProgramDropdown}
            setShowProgramDropdown={setShowProgramDropdown}
            competencySearch={competencySearch}
            onCompetencySearchChange={setCompetencySearch}
            showCompetencyDropdown={showCompetencyDropdown}
            setShowCompetencyDropdown={setShowCompetencyDropdown}
            jobAreaSearch={jobAreaSearch}
            onJobAreaSearchChange={setJobAreaSearch}
            showJobAreaDropdown={showJobAreaDropdown}
            setShowJobAreaDropdown={setShowJobAreaDropdown}
          />
        )}
        {user && (
          <OpportunityTable
            refetchTrigger={refetchTrigger}
            onEditOpportunity={handleEditOpportunity}
            user={user}
          />
        )}

        <OpportunityConfirmationDialog
          open={showConfirmationDialog}
          onOpenChange={setShowConfirmationDialog}
          onConfirm={handleConfirmSubmit}
          pendingFormData={pendingFormData}
          isEditMode={isEditMode}
          loading={loading}
        />


      </div>
    </>
  );
}
