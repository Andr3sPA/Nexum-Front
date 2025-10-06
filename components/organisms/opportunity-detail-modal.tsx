import React from "react";
import { OpportunityResponse } from "@/lib/services/opportunity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";

interface OpportunityDetailModalProps {
  opportunity: OpportunityResponse | null;
  open: boolean;
  onClose: () => void;
}

export default function OpportunityDetailModal({ opportunity, open, onClose }: OpportunityDetailModalProps) {
  if (!open || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <Card>
          <CardHeader>
            <CardTitle>{opportunity.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <strong>Descripción:</strong>
              <div>{opportunity.description}</div>
            </div>
            <div className="mb-2">
              <strong>Ubicación:</strong> {opportunity.location}
            </div>
            <div className="mb-2">
              <strong>Tipo de Contrato:</strong> {opportunity.contractType}
            </div>
            <div className="mb-2">
              <strong>Modalidad:</strong> {opportunity.workModality}
            </div>
            <div className="mb-2">
              <strong>Rango Salarial:</strong> {opportunity.salaryRange ? `${opportunity.salaryRange.currency} ${opportunity.salaryRange.min} - ${opportunity.salaryRange.max}` : '-'}
            </div>
            <div className="mb-2">
              <strong>Estado:</strong> {opportunity.status}
            </div>
            <div className="mb-2">
              <strong>Fecha de Creación:</strong> {opportunity.creationDate ? new Date(opportunity.creationDate).toLocaleDateString('es-ES') : '-'}
            </div>
            <Button className="mt-4" onClick={onClose} variant="outline">Cerrar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
