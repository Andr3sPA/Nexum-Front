import { AUTHENTICATION_ENDPOINT, BASIC_HEADER, METHOD, PROFILE_HOST } from "@/lib/services/constants/api.constants";
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

export interface EmployerRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  businessName?: string;
  nit?: string;
  editCode?: string;
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

  // Register employer
  async registerEmployer(user: EmployerRegisterRequest): Promise<UserRegisteredResponse> {
    const { status, body } = await service(
      `${AUTHENTICATION_ENDPOINT}/register/employer`,
      METHOD.post,
      BASIC_HEADER,
      user,
    );
    if (status !== 201) throw new Error(body?.message || "Error en el registro de empleador");
    return body;
  },

  // Login
  async login(user: AuthenticationRequest): Promise<AuthenticatedUserResponse> {

    try {
      const { status, body } = await service(
        `${AUTHENTICATION_ENDPOINT}/login`,
        METHOD.post,
        BASIC_HEADER,
        user,
      );

      if (status !== 202) {
        throw new Error(body?.message || "Error Iniciando sesión");
      }

      return body;
    } catch (error) {
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

  // Verify account by email and token (updated endpoint)
  async verifyAccount(email: string, token: string): Promise<any> {
    const apiUrl = PROFILE_HOST + AUTHENTICATION_ENDPOINT;
    const fullUrl = `${apiUrl}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: BASIC_HEADER,
    });
    
    if (response.status !== 200) {
      throw new Error("Error verificando cuenta");
    }
    
    return {}; // No body expected
  },

  // Resend verification code
  async resendVerification(email: string): Promise<any> {
    const apiUrl = PROFILE_HOST + AUTHENTICATION_ENDPOINT;
    const fullUrl = `${apiUrl}/resend-verification?email=${encodeURIComponent(email)}`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: BASIC_HEADER,
    });
    
    if (response.status !== 200) {
      throw new Error("Error reenviando código");
    }
    
    return {}; // No body expected
  },

  // Request a password reset link/code. Backend will send email.
  async requestPasswordReset(email: string): Promise<any> {
    const apiUrl = PROFILE_HOST + AUTHENTICATION_ENDPOINT;
    const fullUrl = `${apiUrl}/request-password-reset`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: BASIC_HEADER,
      body: JSON.stringify({ email }),
    });
    
    if (response.status !== 200) {
      throw new Error("Error solicitando restablecimiento");
    }
    
    return {}; // No body expected
  },

  // Reset password using token and new password
  async resetPassword(token: string, newPassword: string): Promise<any> {
    const apiUrl = PROFILE_HOST + AUTHENTICATION_ENDPOINT;
    const fullUrl = `${apiUrl}/reset-password`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: BASIC_HEADER,
      body: JSON.stringify({ token, newPassword }),
    });
    
    if (response.status !== 200) {
      throw new Error("Error reseteando contraseña");
    }
    
    return {}; // No body expected
  },
};

export default AuthenticationService; 
