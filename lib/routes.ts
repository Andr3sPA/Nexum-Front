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

  // Admin routes (Administrativo role)
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SEARCH_GRADUATES: "/admin/search-graduates",
    REPORTS: "/admin/reports",
    COMPLETE_PROFILE: "/admin/complete-profile", // For completing graduate profile after registration
    VIEW_PROFILE: "/admin/profile", // For viewing specific user profiles
  },

  // Dean routes (Decano role)
  DEAN: {
    DASHBOARD: "/dean/dashboard",
    SEARCH_GRADUATES: "/dean/search-graduates",
    REPORTS: "/dean/reports",
    VIEW_PROFILE: "/dean/profile", // For viewing specific user profiles
  },
} as const

export const ROLE_ROUTES = {
  [ROLES.GRADUATE]: [ROUTES.DASHBOARD, ROUTES.PROFILE],
  [ROLES.ADMINISTRATIVE]: [
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.SEARCH_GRADUATES,
    ROUTES.ADMIN.REPORTS,
    ROUTES.ADMIN.COMPLETE_PROFILE,
    ROUTES.ADMIN.VIEW_PROFILE,
  ],
  [ROLES.DEAN]: [
    ROUTES.DEAN.DASHBOARD, 
    ROUTES.DEAN.SEARCH_GRADUATES, 
    ROUTES.DEAN.REPORTS,
    ROUTES.DEAN.VIEW_PROFILE,
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
