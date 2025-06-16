/**
 * Secure authentication utilities for client-side
 * Note: Never store sensitive tokens in localStorage or sessionStorage
 */

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
  lastActivity: number
}

// User data interface for input to getSafeUserData
export interface UserData {
  id?: string | number
  name?: string
  email?: string
  role?: string
  [key: string]: unknown
}

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

// Get authentication state from secure storage (cookies handled by server)
export function getAuthState(): AuthState {
  // In a real implementation, this would check httpOnly cookies
  // For now, we'll use a basic implementation
  const defaultState: AuthState = {
    isAuthenticated: false,
    user: null,
    lastActivity: Date.now(),
  }

  try {
    // Check if user data exists in memory or from server-side props
    // Never use localStorage for sensitive data
    return defaultState
  } catch {
    return defaultState
  }
}

// Check if session is still valid
export function isSessionValid(authState: AuthState): boolean {
  if (!authState.isAuthenticated) {
    return false
  }

  const now = Date.now()
  const timeSinceLastActivity = now - authState.lastActivity

  return timeSinceLastActivity < SESSION_TIMEOUT
}

// Clear all client-side authentication state
export function clearAuthState(): void {
  // Clear any client-side auth state
  // In a real implementation, this would also call logout API

  // Remove any non-sensitive data from memory
  if (typeof window !== "undefined") {
    // Clear any cached data
    window.location.reload()
  }
}

// Update last activity timestamp
export function updateLastActivity(): number {
  return Date.now()
}

// Redirect to login if not authenticated
export function requireAuth(authState: AuthState): boolean {
  if (!isSessionValid(authState)) {
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
    return false
  }
  return true
}

// Safe user data extraction (remove sensitive fields)
export function getSafeUserData(user: UserData): {
  id: string
  name: string
  email: string
  role: string
} | null {
  if (!user || typeof user !== "object") {
    return null
  }

  return {
    id: String(user.id || ""),
    name: String(user.name || ""),
    email: String(user.email || ""),
    role: String(user.role || "user"),
  }
}
