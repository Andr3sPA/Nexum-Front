import { LocalStorageService } from "@/lib/services/local-storage.service"
import { logger } from "@/lib/logging"

export type RequestHeaders = Record<string, string>;
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

const defaultApiUrl = process.env.NEXT_PUBLIC_API_PROFILE_URL ?? 'http://localhost:8100/nexum/v1';

export function getAuthToken(): string | null {
  const user = LocalStorageService.getItem<{ token: string }>("user");
  logger.info("🔑 getAuthToken - user from localStorage:", user)
  const token = user?.token || null;
  logger.info("🔑 getAuthToken - token:", token ? "Present" : "Missing")
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
  
  logger.info("🌐 Making HTTP request:", { method, fullUrl, hasBody: !!body, headers })
  
  try {
    logger.info("📡 Sending fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    logger.info("📡 Response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    logger.info("📦 Parsing response body...")
    let responseBody: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        responseBody = await response.json();
        logger.info("📦 Response body (JSON):", responseBody)
      } catch (jsonError) {
        logger.warn("⚠️ Failed to parse JSON response:", jsonError)
        responseBody = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
    } else {
      try {
        const textBody = await response.text();
        logger.info("📦 Response body (text):", textBody.substring(0, 200))
        responseBody = { message: textBody || `HTTP ${response.status}: ${response.statusText}` };
      } catch (textError) {
        logger.warn("⚠️ Failed to read response text:", textError)
        responseBody = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
    }
    
    return { status: response.status, ok: response.ok, body: responseBody };
  } catch (error) {
    logger.error("💥 Fetch error:", error)
    throw error
  }
}

export async function serviceWithAuth<Request, Response = any>(
  endpoint: string,
  method: RequestMethod,
  requestBody?: Request,
  host?: string
): Promise<{ status: number; ok: boolean; body: Response }> {
  logger.info("🔗 serviceWithAuth called with:", { endpoint, method, host })
  const headers = getAuthHeaders()
  logger.info("🔑 Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    logger.info("📤 About to call service function...")
    const result = await service(endpoint, method, headers, requestBody, host)
    logger.info("✅ serviceWithAuth result:", { status: result.status, ok: result.ok })
    return result
  } catch (error) {
    logger.error("❌ serviceWithAuth error:", error)
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
  
  logger.info("🌐 Making binary HTTP request:", { method, fullUrl, hasBody: !!body })
  logger.info("🔑 Binary Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    logger.info("📡 Sending binary fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    logger.info("📡 Binary response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    logger.info("📦 Getting response as text (base64)...")
    const responseText = await response.text();
    logger.info("📦 Response text length:", responseText.length)
    
    return { status: response.status, ok: response.ok, body: responseText };
  } catch (error) {
    logger.error("💥 Binary fetch error:", error)
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
  
  logger.info("🌐 Making raw binary HTTP request:", { method, fullUrl, hasBody: !!body })
  logger.info("🔑 Raw Binary Auth headers:", { ...headers, Authorization: headers.Authorization ? "Bearer [REDACTED]" : "None" })
  
  try {
    logger.info("📡 Sending raw binary fetch request...")
    const response = await fetch(fullUrl, { method, headers, body });
    logger.info("📡 Raw binary response received:", { status: response.status, ok: response.ok, statusText: response.statusText })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    logger.info("📦 Getting response as ArrayBuffer...")
    const responseBuffer = await response.arrayBuffer();
    logger.info("📦 Response buffer size:", responseBuffer.byteLength)
    
    return { status: response.status, ok: response.ok, body: responseBuffer };
  } catch (error) {
    logger.error("💥 Raw binary fetch error:", error)
    throw error
  }
} 