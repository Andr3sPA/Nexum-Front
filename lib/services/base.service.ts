import { LocalStorageService } from "@/lib/services/local-storage.service"

export type RequestHeaders = Record<string, string>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const defaultApiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8100/nexum/v1';

export function getAuthToken(): string | null {
  const user = LocalStorageService.getItem<{ token: string }>("user");
  return user?.token || null;
}

export function getAuthHeaders(): RequestHeaders {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function service<Request, Response = any>(
  endpoint: string,
  method: RequestMethod,
  headers?: RequestHeaders,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: Response }> {
  const apiUrl = host ?? defaultApiUrl;
  const body = requestBody ? JSON.stringify(requestBody) : undefined;
  const response = await fetch(`${apiUrl}${endpoint}`, { method, headers, body });
  const responseBody = await response.json();

  console.log("body:", responseBody)
  return { status: response.status, ok: response.ok, body: responseBody };
}

export async function serviceWithAuth<Request, Response = any>(
  endpoint: string,
  method: RequestMethod,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: Response }> {
  return service(endpoint, method, getAuthHeaders(), requestBody, host);
} 