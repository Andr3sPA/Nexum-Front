import { AUTHENTICATION_ENDPOINT, METHOD } from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

export interface EmployerProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  nit?: string;
  creationDate: string;
  lastUpdate: string;
}

export const EmployerService = {
  async getCurrentEmployer(): Promise<EmployerProfileResponse> {
    const { status, body } = await serviceWithAuth<undefined, any>(
      `${AUTHENTICATION_ENDPOINT}/authenticated-user`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el perfil del empleador");

    // Transform the response to match EmployerProfileResponse format
    return {
      id: body.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      businessName: body.businessName,
      nit: body.nit,
      creationDate: body.creationDate,
      lastUpdate: body.lastUpdate,
    };
  },

  async getById(id: string): Promise<EmployerProfileResponse> {
    // For now, this method is not implemented since we're using the auth endpoint
    // In the future, this could be implemented if needed
    throw new Error("Method not implemented");
  },
};