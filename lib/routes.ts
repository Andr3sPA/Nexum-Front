/**
 * Application Routes Configuration
 * Defines all available routes and role-based access
 */

import { ROLES } from "./services/constants/api.constants"

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Egresado routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SEARCH_GRADUATES: "/search-graduates",

  // Admin routes (Administrativo role)
  ADMIN: {
    DASHBOARD: "/dashboard",
    SEARCH_GRADUATES: "/search-graduates",
    REPORTS: "/reports",
    COMPLETE_PROFILE: "/admin/complete-profile", // For completing graduate profile after registration
    VIEW_PROFILE: "/profile", // For viewing specific user profiles
  },

  // Dean routes (Decano role)
  DEAN: {
    DASHBOARD: "/dashboard",
    SEARCH_GRADUATES: "/search-graduates",
    REPORTS: "/reports",
    VIEW_PROFILE: "/profile", // For viewing specific user profiles
  },
} as const

export const ROLE_ROUTES = {
  [ROLES.GRADUATE]: [ROUTES.DASHBOARD, ROUTES.PROFILE],
  [ROLES.ADMINISTRATIVE]: [
    ROUTES.DASHBOARD,
    ROUTES.SEARCH_GRADUATES,
    ROUTES.ADMIN.REPORTS,
    ROUTES.ADMIN.COMPLETE_PROFILE,
    ROUTES.PROFILE,
  ],
  [ROLES.DEAN]: [
    ROUTES.DASHBOARD, 
    ROUTES.SEARCH_GRADUATES, 
    ROUTES.DEAN.REPORTS,
    ROUTES.PROFILE,
  ],
} as const

export type UserRole = keyof typeof ROLE_ROUTES
export type RouteKey = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case ROLES.ADMINISTRATIVE:
      return ROUTES.ADMIN.DASHBOARD
    case ROLES.DEAN:
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
