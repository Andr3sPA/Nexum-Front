"use client";
import { useEffect, useState } from "react";
import { OpportunityService, OpportunityResponse } from "@/lib/services/opportunity";

export default function OpportunityTable() {
  const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const data = await OpportunityService.list();
      setOpportunities(data);
    } catch {
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return (
    <div className="overflow-x-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Oportunidades Registradas</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">Título</th>
            <th className="px-3 py-2 border">Descripción</th>
            <th className="px-3 py-2 border">Ubicación</th>
            <th className="px-3 py-2 border">Tipo</th>
            <th className="px-3 py-2 border">Rango Salarial</th>
            <th className="px-3 py-2 border">Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center py-4">Cargando...</td></tr>
          ) : opportunities.length === 0 ? (
            <tr><td colSpan={6} className="text-center py-4">No hay oportunidades registradas.</td></tr>
          ) : (
            opportunities.map((opp) => (
              <tr key={opp.id}>
                <td className="border px-3 py-2">{opp.title}</td>
                <td className="border px-3 py-2">{opp.description}</td>
                <td className="border px-3 py-2">{opp.location}</td>
                <td className="border px-3 py-2">{opp.employmentType}</td>
                <td className="border px-3 py-2">{opp.salaryRange?.name || '-'}</td>
                <td className="border px-3 py-2">{opp.creationDate ? new Date(opp.creationDate).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
