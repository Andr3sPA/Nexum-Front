"use client";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { NumberInput } from "@/components/atoms/number-input";
import { Label } from "@/components/atoms/label";
import { Select } from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Checkbox } from "@/components/atoms/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { FormSection } from "@/components/atoms/form-section";
import Navbar from "@/components/navbar";
import OpportunityTable from "@/components/organisms/opportunity-table";
import ApplicationTable from "@/components/organisms/application-table";
import { ApplicationService } from "@/lib/services/opportunity";
import { toast } from "@/hooks/use-toast";
import { ROLES } from "@/lib/services/constants/api.constants";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { OpportunityRequest, OpportunityResponse, OpportunityService } from "@/lib/services/opportunity/opportunity.service";
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign, Calendar, User, Settings } from "lucide-react";

export default function EmployerOpportunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const     showRegister = searchParams.get("register") === "1";
  const [user, setUser] = useState<(AuthenticatedUserResponse & DetailedUserResponse) | null>(null);
  const [form, setForm] = useState<OpportunityRequest>({
    title: "",
    description: "",
    location: "",
    status: "Draft",
    creationDate: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    graduateId: "",
    salaryRange: {
      min: 0,
      max: 0,
      currency: "COP"
    },
    contractType: "Full Time",
    startDate: "",
    durationInMonths: 0,
    complementaryStudies: "",
    requiredExperience: "Not specified",
    travelAvailability: false,
    workModality: "On Site"
  });
  const [loading, setLoading] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [editingOpportunity, setEditingOpportunity] = useState<OpportunityResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appRefetchTrigger, setAppRefetchTrigger] = useState(0);
  // Handler para aplicar a una oportunidad
  const handleApply = async (opportunityId: number) => {
    setLoading(true);
    try {
      await ApplicationService.apply({ opportunityId });
      toast({ title: "Aplicación enviada exitosamente" });
      setAppRefetchTrigger((prev) => prev + 1);
    } catch (error) {
      toast({ title: "Error al aplicar", description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const storedUser = LocalStorageService.getItem<AuthenticatedUserResponse>("user");
    const storedUserProfile = LocalStorageService.getItem<DetailedUserResponse>("userProfile");
    setUser(storedUser && storedUserProfile ? { ...storedUser, ...storedUserProfile } : null);
  }, []);

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

  const handleNumberChange = (name: string, value: number) => {
    if (name === 'salaryMin' || name === 'salaryMax') {
      setForm(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name === 'salaryMin' ? 'min' : 'max']: value
        }
      }));
    } else if (name === 'durationInMonths') {
      setForm(prev => ({
        ...prev,
        durationInMonths: value
      }));
    }
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
      creationDate: opportunity.creationDate,
      lastUpdate: new Date().toISOString(), // Update timestamp
      graduateId: opportunity.graduateId,
      salaryRange: {
        min: opportunity.salaryRange?.min || 0,
        max: opportunity.salaryRange?.max || 0,
        currency: opportunity.salaryRange?.currency || "COP"
      },
      contractType: opportunity.contractType,
      startDate: opportunity.startDate,
      durationInMonths: opportunity.durationInMonths || 0,
      complementaryStudies: opportunity.complementaryStudies || "",
      requiredExperience: opportunity.requiredExperience,
      travelAvailability: opportunity.travelAvailability || false,
      workModality: opportunity.workModality
    });

    // Navigate to register view
    router.push("/employer/opportunity?register=1");
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      status: "Draft",
      creationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      graduateId: "",
      salaryRange: {
        min: 0,
        max: 0,
        currency: "COP"
      },
      contractType: "Full Time",
      startDate: "",
      durationInMonths: 0,
      complementaryStudies: "",
      requiredExperience: "Not specified",
      travelAvailability: false,
      workModality: "On Site"
    });
    setEditingOpportunity(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && editingOpportunity) {
        // Update existing opportunity
        await OpportunityService.update(editingOpportunity.id, form);
        toast({ title: "Oportunidad actualizada exitosamente" });
      } else {
        // Create new opportunity
        await OpportunityService.create(form);
        toast({ title: "Oportunidad registrada exitosamente" });
      }
      
      // Reset form and state
      resetForm();
      
      // Trigger refetch of opportunities table
      setRefetchTrigger(prev => prev + 1);
      router.push("/employer/opportunity");
    } catch (error) {
      toast({ 
        title: isEditMode ? "Error al actualizar oportunidad" : "Error al registrar oportunidad", 
        description: String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {user && <Navbar user={user} />}
      <div className="max-w-6xl mx-auto mt-10 p-6">
        {showRegister && user && (user.role === ROLES.EMPLOYER || user.role === ROLES.ADMINISTRATIVE) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-green-600" />
                {isEditMode ? "Actualizar Oportunidad" : "Registrar Nueva Oportunidad"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormSection 
                  icon={Briefcase} 
                  title="Información Básica" 
                  description="Detalles principales de la oportunidad laboral"
                  color="blue"
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título *</Label>
                      <Input name="title" id="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea name="description" id="description" value={form.description} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input name="location" id="location" value={form.location} onChange={handleChange} />
                    </div>
                  </div>
                </FormSection>

                <FormSection 
                  icon={Settings} 
                  title="Tipo de Empleo" 
                  description="Configuración del tipo de contrato y modalidad de trabajo"
                  color="green"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractType">Tipo de Contrato *</Label>
                      <Select name="contractType" id="contractType" value={form.contractType} onChange={handleChange} required>
                        <option value="Full Time">Tiempo Completo</option>
                        <option value="Part Time">Medio Tiempo</option>
                        <option value="Contract">Contrato</option>
                        <option value="Temporary">Temporal</option>
                        <option value="Internship">Prácticas</option>
                        <option value="Freelance">Freelance</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workModality">Modalidad de Trabajo *</Label>
                      <Select name="workModality" id="workModality" value={form.workModality} onChange={handleChange} required>
                        <option value="Remote">Remoto</option>
                        <option value="On Site">Presencial</option>
                        <option value="Hybrid">Híbrido</option>
                      </Select>
                    </div>
                  </div>
                </FormSection>

                <FormSection 
                  icon={DollarSign} 
                  title="Información Salarial" 
                  description="Rango salarial ofrecido para la posición"
                  color="green"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Salario Mínimo</Label>
                      <NumberInput 
                        id="salaryMin"
                        value={form.salaryRange.min} 
                        onChange={(value) => handleNumberChange('salaryMin', value)}
                        min={0}
                        placeholder="Ingrese salario mínimo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Salario Máximo</Label>
                      <NumberInput 
                        id="salaryMax"
                        value={form.salaryRange.max} 
                        onChange={(value) => handleNumberChange('salaryMax', value)}
                        min={0}
                        placeholder="Ingrese salario máximo"
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection 
                  icon={Calendar} 
                  title="Fechas y Duración" 
                  description="Información temporal de la oportunidad"
                  color="purple"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Fecha de Inicio</Label>
                      <Input name="startDate" id="startDate" type="date" value={form.startDate} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="durationInMonths">Duración (meses)</Label>
                      <NumberInput 
                        id="durationInMonths" 
                        value={form.durationInMonths} 
                        onChange={(value) => handleNumberChange('durationInMonths', value)}
                        min={1}
                        max={120}
                        placeholder="Duración en meses" 
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection 
                  icon={User} 
                  title="Requisitos y Experiencia" 
                  description="Requisitos del candidato y experiencia necesaria"
                  color="orange"
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="requiredExperience">Experiencia Requerida *</Label>
                      <Select name="requiredExperience" id="requiredExperience" value={form.requiredExperience} onChange={handleChange} required>
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
                      <Textarea name="complementaryStudies" id="complementaryStudies" value={form.complementaryStudies} onChange={handleChange} placeholder="Especifique estudios adicionales requeridos..." />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        name="travelAvailability" 
                        id="travelAvailability" 
                        checked={form.travelAvailability} 
                        onChange={handleChange}
                      />
                      <Label htmlFor="travelAvailability" className="cursor-pointer">Disponibilidad para viajar</Label>
                    </div>
                  </div>
                </FormSection>

                <div className="flex justify-end gap-4 pt-4">
                  {isEditMode && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        resetForm();
                        router.push("/employer/opportunity");
                      }}
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
        )}
        <OpportunityTable 
          refetchTrigger={refetchTrigger} 
          onEditOpportunity={handleEditOpportunity}
          // Solo pasar handleApply si el usuario es GRADUATE
          {...(user && user.role === ROLES.GRADUATE ? { onApply: handleApply } : {})}
        />
        {/* Tabla de aplicaciones solo para GRADUATE */}
        {user && user.role === ROLES.GRADUATE && (
          <ApplicationTable refetchTrigger={appRefetchTrigger} />
        )}
      </div>
    </>
  );
}
