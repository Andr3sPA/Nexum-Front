// Base services
export { service, serviceWithAuth } from "./base.service"
export { LocalStorageService } from "./local-storage.service"

// Authentication and user services
export { AuthenticationService } from "./profile/auth.service"
export { UserService } from "./profile/user.service"

// Profile services
export { ContactInformationService } from "./profile/contact-information.service"
export { FamilyInformationService } from "./profile/family-information.service"
export { JobService } from "./profile/job.service"
export { GraduateParticipationService } from "./profile/graduate-participation.service"
export { CoursedProgramService } from "./profile/coursed-program.service"
export { AcademicEducationService } from "./profile/academic-education.service"
export { ProgramOpinionService } from "./profile/program-opinion.service"

// Catalog services
export { IdentityDocumentTypeService } from "./catalog/identity-document-type.service"
export { SalaryRangeService } from "./catalog/salary-range.service"
export { ProgramService } from "./catalog/program.service"
export { ProgramVersionService } from "./catalog/program-version.service"
export { ProgramCompetencyService } from "./catalog/program-competency.service"
export { JobInstitutionTypeService } from "./catalog/job-institution-type.service"
export { JobDelayService } from "./catalog/job-delay.service"
export { JobAreaService } from "./catalog/job-area.service"
export { InnovationProcessTypeService } from "./catalog/innovation-process-type.service"
export { AlternativeAcademicRouteService } from "./catalog/alternative-academic-route.service"

// Search services
export { GraduateSearchService } from "./profile/graduate-search.service"

// Constants
export * from "./constants/api.constants"

// Export detailed user service separately to avoid type conflicts
export { DetailedUserService } from "./profile/detailed-user.service" 