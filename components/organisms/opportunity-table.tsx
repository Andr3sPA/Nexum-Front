"use client";
import { useEffect, useState } from "react";
import { OpportunityService, OpportunityResponse } from "@/lib/services/opportunity";
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

interface OpportunityTableProps {
  refetchTrigger?: number;
  onEditOpportunity?: (opportunity: OpportunityResponse) => void;
}

export default function OpportunityTable({ refetchTrigger, onEditOpportunity }: OpportunityTableProps) {
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
      ) : opportunities.length === 0 ? (
        <div className="mt-6">
          <EmptyStateCard
            icon={Briefcase}
            title="No hay oportunidades registradas"
            description="Aún no se han registrado oportunidades laborales. Comienza creando una nueva oportunidad."
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
                    <TableHead>Tipo de Contrato</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Rango Salarial</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {opportunities.map((opp, index) => (
                <TableRow 
                  key={opp.id} 
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <TableCell className="font-medium">{opp.title}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={opp.description}>
                      {opp.description}
                    </div>
                  </TableCell>
                  <TableCell>{opp.location}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {opp.contractType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {opp.workModality}
                    </span>
                  </TableCell>
                  <TableCell>
                    {opp.salaryRange ? (
                      <div className="text-sm">
                        <span className="font-medium">
                          {opp.salaryRange.currency} {opp.salaryRange.min.toLocaleString()} - {opp.salaryRange.max.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      opp.status === 'Active' ? 'bg-green-100 text-green-800' :
                      opp.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                      opp.status === 'Closed' ? 'bg-red-100 text-red-800' :
                      opp.status === 'Expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {opp.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {opp.creationDate ? new Date(opp.creationDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </TableCell>
                  <TableCell>
                    {onEditOpportunity && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditOpportunity(opp)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
