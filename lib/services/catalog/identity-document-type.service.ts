import { 
  CATALOG_IDENTITY_DOCUMENT_TYPE_ENDPOINT, 
  METHOD,
  CATALOG_HOST 
} from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

export interface IdentityDocumentTypeResponse {
  id: number;
  name: string;
  abbreviation: string;
}

export const IdentityDocumentTypeService = {
  // Get all identity document types
  async getAll(): Promise<IdentityDocumentTypeResponse[]> {
    const { body } = await serviceWithAuth(
      CATALOG_IDENTITY_DOCUMENT_TYPE_ENDPOINT,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Get identity document type by ID
  async getById(id: number): Promise<IdentityDocumentTypeResponse> {
    const { body } = await serviceWithAuth(
      `${CATALOG_IDENTITY_DOCUMENT_TYPE_ENDPOINT}/${id}`,
      METHOD.get,
      undefined,
      CATALOG_HOST
    );
    return body;
  },

  // Legacy function for backward compatibility
  async getIdentityDocumentTypes(): Promise<IdentityDocumentTypeResponse[]> {
    return this.getAll();
  }
}; 