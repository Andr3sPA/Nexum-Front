// Catalog services
export * from "./identity-document-type.service"
export * from "./salary-range.service"
export * from "./program.service"
export * from "./program-version.service"
export * from "./program-competency.service"
export * from "./job-institution-type.service"
export * from "./job-delay.service"
export * from "./job-area.service"
export * from "./innovation-process-type.service"
export * from "./alternative-academic-route.service"

// Re-export specific types to avoid conflicts
export type {
  IdentityDocumentTypeResponse
} from "./identity-document-type.service"

export type {
  SalaryRangeRequest,
  SalaryRangeResponse
} from "./salary-range.service"

export type {
  ProgramRequest,
  ProgramResponse
} from "./program.service"

export type {
  ProgramVersionRequest,
  ProgramVersionResponse
} from "./program-version.service"

export type {
  ProgramCompetencyRequest,
  ProgramCompetencyResponse
} from "./program-competency.service"

export type {
  JobInstitutionTypeRequest,
  JobInstitutionTypeResponse
} from "./job-institution-type.service"

export type {
  JobDelayRequest,
  JobDelayResponse
} from "./job-delay.service"

export type {
  JobAreaRequest,
  JobAreaResponse
} from "./job-area.service"

export type {
  InnovationProcessTypeRequest,
  InnovationProcessTypeResponse
} from "./innovation-process-type.service"

export type {
  AlternativeAcademicRouteRequest,
  AlternativeAcademicRouteResponse
} from "./alternative-academic-route.service" 