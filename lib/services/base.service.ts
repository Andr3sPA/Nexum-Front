import { LocalStorageService } from "@/lib/services/local-storage.service"

export type RequestHeaders = Record<string, string>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const defaultApiUrl = process.env.NEXT_PUBLIC_API_PROFILE_URL ?? 'http://localhost:8100/nexum/v1';

export function getAuthToken(): string | null {
  const user = LocalStorageService.getItem<{ token: string }>("user");
  console.log("🔑 getAuthToken - user from localStorage:", user)
  const token = user?.token || null;
  console.log("🔑 getAuthToken - token:", token ? "Present" : "Missing")
  return token;
}

export function getAuthHeaders(): RequestHeaders {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export function getAuthHeadersForBinary(): RequestHeaders {
  const token = getAuthToken();
  return {
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
  const fullUrl = `${apiUrl}${endpoint}`;
  const body = requestBody ? JSON.stringify(requestBody) : undefined;
  
  console.log("🌐 Making HTTP request:", { method, fullUrl, hasBody: !!body, headers })
  
  try {
    console.log("📡 Sending fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    console.log("📡 Response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    console.log("📦 Parsing response body...")
    const responseBody = await response.json();
    console.log("📦 Response body:", responseBody)
    
    return { status: response.status, ok: response.ok, body: responseBody };
  } catch (error) {
    console.error("💥 Fetch error:", error)
    throw error
  }
}

export async function serviceWithAuth<Request, Response = any>(
  endpoint: string,
  method: RequestMethod,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: Response }> {
  console.log("🔗 serviceWithAuth called with:", { endpoint, method, host })
  const headers = getAuthHeaders()
  console.log("🔑 Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    console.log("📤 About to call service function...")
    const result = await service(endpoint, method, headers, requestBody, host)
    console.log("✅ serviceWithAuth result:", { status: result.status, ok: result.ok })
    return result
  } catch (error) {
    console.error("❌ serviceWithAuth error:", error)
    throw error
  }
}

export async function serviceWithAuthBinary<Request>(
  endpoint: string,
  method: RequestMethod,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: string }> {
  const apiUrl = host ?? defaultApiUrl;
  const fullUrl = `${apiUrl}${endpoint}`;
  const headers = getAuthHeadersForBinary();
  const body = requestBody ? JSON.stringify(requestBody) : undefined;
  
  console.log("🌐 Making binary HTTP request:", { method, fullUrl, hasBody: !!body })
  console.log("🔑 Binary Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    console.log("📡 Sending binary fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    console.log("📡 Binary response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log("📦 Getting response as text (base64)...")
    const responseText = await response.text();
    console.log("📦 Response text length:", responseText.length)
    
    return { status: response.status, ok: response.ok, body: responseText };
  } catch (error) {
    console.error("💥 Binary fetch error:", error)
    throw error
  }
}

export async function serviceWithAuthRawBinary<Request>(
  endpoint: string,
  method: RequestMethod,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: ArrayBuffer }> {
  const apiUrl = host ?? defaultApiUrl;
  const fullUrl = `${apiUrl}${endpoint}`;
  const headers = getAuthHeadersForBinary();
  const body = requestBody ? JSON.stringify(requestBody) : undefined;
  
  console.log("🌐 Making raw binary HTTP request:", { method, fullUrl, hasBody: !!body })
  console.log("🔑 Raw Binary Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    console.log("📡 Sending raw binary fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    console.log("📡 Raw binary response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log("📦 Getting response as ArrayBuffer...")
    const responseBuffer = await response.arrayBuffer();
    console.log("📦 Response buffer size:", responseBuffer.byteLength)
    
    return { status: response.status, ok: response.ok, body: responseBuffer };
  } catch (error) {
    console.error("💥 Raw binary fetch error:", error)
    throw error
  }
} 