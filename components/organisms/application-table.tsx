import { useEffect, useState } from "react";
import { ApplicationService, ApplicationResponse } from "@/lib/services/opportunity";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/atoms/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { SectionTitle } from "@/components/atoms/section-title";
import { EmptyStateCard } from "@/components/atoms/empty-state-card";
import { Briefcase } from "lucide-react";

interface ApplicationTableProps {
  refetchTrigger?: number;
}

export default function ApplicationTable({ refetchTrigger }: ApplicationTableProps) {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApplicationService.list();
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
        setError("No se pudo obtener la lista de aplicaciones (respuesta inesperada del servidor).");
      }
    } catch (err: any) {
      setApplications([]);
      setError("No se pudo obtener la lista de aplicaciones. ¿Estás autenticado?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [refetchTrigger]);

  return (
    <div className="mt-10">
      <SectionTitle>Mis Aplicaciones</SectionTitle>
      {loading ? (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardContent className="p-8">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                Cargando aplicaciones...
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <div className="mt-6 text-red-600 text-center font-medium">{error}</div>
      ) : applications.length === 0 ? (
        <div className="mt-6">
          <EmptyStateCard
            icon={Briefcase}
            title="No hay aplicaciones registradas"
            description="Aún no has aplicado a ninguna oportunidad."
            color="blue"
          />
        </div>
      ) : (
        <Card className="mt-6 shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Lista de Aplicaciones
              </div>
              <span className="text-sm font-normal text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                {applications.length} {applications.length === 1 ? 'aplicación' : 'aplicaciones'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Puesto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Aplicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app, index) => (
                    <TableRow key={app.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <TableCell>{app.opportunity?.title}</TableCell>
                      <TableCell>{app.opportunity?.createdBy || '-'}</TableCell>
                      <TableCell>{app.opportunity?.location}</TableCell>
                      <TableCell>{app.status}</TableCell>
                      <TableCell>{app.createdDate ? new Date(app.createdDate).toLocaleDateString('es-ES') : '-'}</TableCell>
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
