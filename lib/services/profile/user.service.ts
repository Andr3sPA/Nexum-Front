import { USER_ENDPOINT, METHOD } from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

export interface UserIdentityDocumentTypeResponse {
  id: number;
  name: string;
  abbreviation: string;
}

export interface UserRequest {
  identityDocument: string;
  idIdentityDocumentType: number;
  name: string;
  middleName?: string;
  lastname: string;
  secondLastname: string;
  gender: string;
  institutionalEmail?: string;
  birthdate: string;
}

export interface UserResponse {
  id: string;
  identityDocument: string;
  identityDocumentType: UserIdentityDocumentTypeResponse;
  name: string;
  middleName?: string;
  lastname: string;
  secondLastname: string;
  birthdate: string;
  creationDate: string;
  lastUpdate: string;
  role: string;
}

export const UserService = {
  async create(data: UserRequest): Promise<UserResponse> {
    
    try {
      const { status, body } = await serviceWithAuth<UserRequest, UserResponse>(
        `${USER_ENDPOINT}`,
        METHOD.post,
        data
      );
      
      if (status !== 200 && status !== 201) {
        throw new Error((body as any)?.message || "No se pudo crear el usuario");
      }
      
      return body;
    } catch (error) {
      throw error
    }
  },

  // Get all users
  async getAll(): Promise<UserResponse[]> {
    const { status, body } = await serviceWithAuth<undefined, UserResponse[]>(
      `${USER_ENDPOINT}`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudieron obtener los usuarios");
    return body;
  },

  // Get user by ID
  async getById(id: string): Promise<UserResponse> {
    const { status, body } = await serviceWithAuth<undefined, UserResponse>(
      `${USER_ENDPOINT}/${id}`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el usuario");
    return body;
  },

  // Get current authenticated user
  async getCurrentUser(): Promise<UserResponse> {
    const { status, body } = await serviceWithAuth<undefined, UserResponse>(
      `${USER_ENDPOINT}/authenticated`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el usuario autenticado");
    return body;
  },

  // Update user by ID
  async updateById(id: string, data: UserRequest): Promise<UserResponse> {
    const { status, body } = await serviceWithAuth<UserRequest, UserResponse>(
      `${USER_ENDPOINT}/${id}`,
      METHOD.put,
      data
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo actualizar el usuario");
    return body;
  },

  // Delete user by ID
  async deleteById(id: string): Promise<UserResponse> {
    const { status, body } = await serviceWithAuth<undefined, UserResponse>(
      `${USER_ENDPOINT}/${id}`,
      METHOD.delete
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo eliminar el usuario");
    return body;
  },
}; 
