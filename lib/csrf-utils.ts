/**
 * CSRF protection utilities
 */

// Get CSRF token from meta tag or cookie
export function getCsrfToken(): string {
  if (typeof document !== "undefined") {
    // Try to get from meta tag first (preferred method)
    const metaTag = document.querySelector('meta[name="csrf-token"]')
    if (metaTag && metaTag.getAttribute("content")) {
      return metaTag.getAttribute("content") || ""
    }
    
    // Fallback to cookie if necessary
    return getCsrfTokenFromCookie()
  }
  return ""
}

// Extract CSRF token from cookies
function getCsrfTokenFromCookie(): string {
  const cookies = document.cookie.split(";").map(cookie => cookie.trim())
  const csrfCookie = cookies.find(cookie => cookie.startsWith("XSRF-TOKEN="))
  
  if (csrfCookie) {
    return csrfCookie.substring("XSRF-TOKEN=".length)
  }
  
  return ""
}