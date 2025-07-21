import { AUTHENTICATION_ENDPOINT, BASIC_HEADER, METHOD } from "@/lib/services/constants/api.constants";
import { service } from "@/lib/services/base.service";

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  identityDocument: string;
  idIdentityDocumentType: number;
  name: string;
  middleName?: string;
  lastname: string;
  secondLastname: string;
  birthdate: string; // ISO string
  gender: string;
  email: string;
  institutionalEmail?: string;
  password: string;
}

export interface AuthenticatedUserResponse {
  id: string;
  role: string;
  email: string;
  token: string;
}

export interface UserRegisteredResponse {
  id: string;
  identityDocument: string;
  identityDocumentType: {
    id: number;
    name: string;
    abbreviation: string;
  };
  name: string;
  middleName: string;
  lastname: string;
  secondLastname: string;
  birthdate: string;
  creationDate: string;
  lastUpdate: string;
}

export const AuthenticationService = {
  // Register graduate
  async registerGraduate(user: UserRegisterRequest): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/register/graduate`,
      METHOD.post,
      BASIC_HEADER,
      user,
    );
    if (status !== 201) throw new Error(body?.message || "Error en el registro de egresado");
    return body;
  },

  // Register administrative
  async registerAdministrative(user: UserRegisterRequest): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/register/administrative`,
      METHOD.post,
      BASIC_HEADER,
      user,
    );
    if (status !== 201) throw new Error(body?.message || "Error en el registro de administrativo");
    return body;
  },

  // Login
  async login(user: AuthenticationRequest): Promise<AuthenticatedUserResponse> {
    console.log("🌐 AuthenticationService.login called with:", { email: user.email, password: "***" })
    
    try {
      const { status, body } = await service(
        `${AUTHENTICATION_ENDPOINT}/login`,
        METHOD.post,
        BASIC_HEADER,
        user,
      );
      
      console.log("📡 Login API response:", { status, body })
      
      if (status !== 202) {
        console.error("❌ Login failed with status:", status, "body:", body)
        throw new Error(body?.message || "Error Iniciando sesión");
      }
      
      console.log("✅ Login successful, returning user data")
      return body;
    } catch (error) {
      console.error("💥 Login service error:", error)
      throw error
    }
  },

  // Validate token
  async validateToken(token: string): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/validate?token=${token}`,
      METHOD.get,
      BASIC_HEADER,
    );
    if (status !== 201) throw new Error(body?.message || "Error validando token");
    return body;
  },

  // Get user by token
  async getUserByToken(token: string): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/user?token=${token}`,
      METHOD.get,
      BASIC_HEADER,
    );
    if (status !== 200) throw new Error(body?.message || "Error obteniendo usuario por token");
    return body;
  },

  // Get authenticated user
  async getAuthenticatedUser(): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/authenticated-user`,
      METHOD.get,
      BASIC_HEADER,
    );
    if (status !== 200) throw new Error(body?.message || "Error obteniendo usuario autenticado");
    return body;
  },

  // Legacy method for backward compatibility
  async register(user: UserRegisterRequest): Promise<UserRegisteredResponse> {
    return this.registerGraduate(user);
  },
};

export default AuthenticationService; 