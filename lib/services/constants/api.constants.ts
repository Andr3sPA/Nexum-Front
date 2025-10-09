// API Hosts
export const PROFILE_HOST =
  process.env.NEXT_PUBLIC_API_PROFILE_URL ?? "http://localhost:8100/nexum/v1";
export const CATALOG_HOST =
  process.env.NEXT_PUBLIC_API_CATALOG_URL ?? "http://localhost:8110/nexum/v1";
export const OPPORTUNITY_HOST =
  process.env.NEXT_PUBLIC_API_OPPORTUNITY_URL ?? "http://localhost:8120/nexum/v1";

// Endpoints
export const AUTHENTICATION_ENDPOINT = "/auth";
export const USER_ENDPOINT = "/users";
export const DETAILED_USER_ENDPOINT = "/detailed-users";
export const OPPORTUNITY_ENDPOINT = "/opportunities";

// Catalog endpoints
export const CATALOG_IDENTITY_DOCUMENT_TYPE_ENDPOINT =
  "/identity-document-types";
export const CATALOG_SALARY_RANGE_ENDPOINT = "/salary-ranges";
export const CATALOG_PROGRAM_ENDPOINT = "/programs";
export const CATALOG_PROGRAM_VERSION_ENDPOINT = "/program-versions";
export const CATALOG_PROGRAM_COMPETENCY_ENDPOINT = "/program-competencies";
export const CATALOG_JOB_INSTITUTION_TYPE_ENDPOINT = "/job-institution-types";
export const CATALOG_JOB_DELAY_ENDPOINT = "/job-delay";
export const CATALOG_JOB_AREA_ENDPOINT = "/job-areas";
export const CATALOG_INNOVATION_PROCESS_TYPE_ENDPOINT =
  "/innovation-process-types";
export const CATALOG_ALTERNATIVE_ACADEMIC_ROUTE_ENDPOINT =
  "/alternative-academic-routes";

// Headers
export const BASIC_HEADER = { "Content-Type": "application/json" };

// HTTP Methods
export const METHOD = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
  patch: "PATCH",
} as const;

// User Roles
export const ROLES = {
  ADMIN: "ADMIN",
  ADMINISTRATIVE: "ADMINISTRATIVE",
  GRADUATE: "GRADUATE",
  PRE_GRADUATE: "PRE_GRADUATE",
  DEAN: "DEAN",
  EMPLOYER: "EMPLOYER",
} as const;

