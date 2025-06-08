/**
 * Application Routes Configuration
 * Defines all available routes and role-based access
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Egresado routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  // Admin routes (Administrativo role)
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SEARCH_GRADUATES: "/admin/search-graduates",
    REPORTS: "/admin/reports",
    COMPLETE_PROFILE: "/admin/complete-profile", // For completing graduate profile after registration
  },

  // Dean routes (Decano role)
  DEAN: {
    DASHBOARD: "/dean/dashboard",
    SEARCH_GRADUATES: "/dean/search-graduates",
    REPORTS: "/dean/reports",
  },
} as const

export const ROLE_ROUTES = {
  egresado: [ROUTES.DASHBOARD, ROUTES.PROFILE],
  administrativo: [
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.SEARCH_GRADUATES,
    ROUTES.ADMIN.REPORTS,
    ROUTES.ADMIN.COMPLETE_PROFILE,
  ],
  decano: [ROUTES.DEAN.DASHBOARD, ROUTES.DEAN.SEARCH_GRADUATES, ROUTES.DEAN.REPORTS],
} as const

export type UserRole = keyof typeof ROLE_ROUTES
export type RouteKey = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case "administrativo":
      return ROUTES.ADMIN.DASHBOARD
    case "decano":
      return ROUTES.DEAN.DASHBOARD
    default:
      return ROUTES.DASHBOARD
  }
}

/**
 * Check if user has access to route
 */
export function hasRouteAccess(role: UserRole, route: string): boolean {
  return ROLE_ROUTES[role].some((allowedRoute) => route.startsWith(allowedRoute))
}
