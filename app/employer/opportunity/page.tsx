"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { OpportunityService, OpportunityRequest } from "@/lib/services/opportunity/opportunity.service";
import { ROLES } from "@/lib/services/constants/api.constants";
import { SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Button } from "@/components/atoms/button";
import { Select } from "@/components/atoms/select";
import { toast } from "@/hooks/use-toast";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { SalaryRangeService } from "@/lib/services/catalog/salary-range.service";
import OpportunityTable from "@/components/organisms/opportunity-table";

export default function EmployerOpportunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showRegister = searchParams.get("register") === "1";
  const [user, setUser] = useState<{ id?: string; role?: string } | null>(null);
  const [form, setForm] = useState<OpportunityRequest>({
    title: "",
    description: "",
    location: "",
    employmentType: "",
    salaryRangeId: undefined,
    graduateId: undefined,
  });
  const [salaryRanges, setSalaryRanges] = useState<SalaryRangeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const storedUser = LocalStorageService.getItem<{ id?: string; role?: string }>("user");
    setUser(storedUser);
  }, []);

  useEffect(() => {
    // Cargar rangos salariales
    SalaryRangeService.getAll()
      .then(data => setSalaryRanges(Array.isArray(data) ? data : []))
      .catch(() => setSalaryRanges([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await OpportunityService.create(form);
  toast({ title: "Oportunidad registrada exitosamente" });
      setForm({
        title: "",
        description: "",
        location: "",
        employmentType: "",
        salaryRangeId: undefined,
        graduateId: undefined,
      });
      router.push("/employer/opportunity");
    } catch (error) {
  toast({ title: "Error al registrar oportunidad", description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      {showRegister && user && (user.role === ROLES.EMPLOYER || user.role === ROLES.ADMINISTRATIVE) && (
        <>
          <h1 className="text-2xl font-bold mb-4">Registrar Oportunidad</h1>
          <form onSubmit={handleSubmit} className="space-y-4 mb-10">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Título</label>
              <Input name="title" id="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descripción</label>
              <Textarea name="description" id="description" value={form.description} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">Ubicación</label>
              <Input name="location" id="location" value={form.location} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium mb-1">Tipo de empleo</label>
              <Input name="employmentType" id="employmentType" value={form.employmentType} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="salaryRangeId" className="block text-sm font-medium mb-1">Rango Salarial</label>
              <Select name="salaryRangeId" id="salaryRangeId" value={form.salaryRangeId || ""} onChange={handleChange}>
                <option value="">Selecciona un rango</option>
                {salaryRanges.map(range => (
                  <option key={range.id} value={range.id}>{range.salary}</option>
                ))}
              </Select>
            </div>
            {/* graduateId puede ser un input opcional si aplica */}
            <Button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrar"}</Button>
          </form>
        </>
      )}
      <OpportunityTable />
    </div>
  );
}
