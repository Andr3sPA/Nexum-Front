import { DETAILED_USER_ENDPOINT, METHOD } from "@/lib/services/constants/api.constants";
import { serviceWithAuth } from "@/lib/services/base.service";

// Base models
export interface IdentityDocumentTypeResponse {
  id: number;
  name: string;
  abbreviation: string;
}

export interface ProgramVersionResponse {
  id: number;
  name: string;
  version: string;
}

export interface InnovationProcessTypeResponse {
  id: number;
  name: string;
  description?: string;
}

export interface JobSalaryRangeResponse {
  id: number;
  salary: string;
}

export interface JobDelayResponse {
  id: number;
  label: string;
}

export interface JobAreaResponse {
  id: number;
  name: string;
}

export interface JobInstitutionTypeResponse {
  id: number;
  name: string;
}

// Detailed response models
export interface DetailedJobResponse {
  id: number;
  companyName: string;
  country: string;
  position: string;
  relatedToProgram: boolean;
  salaryRange: JobSalaryRangeResponse;
  jobDelay: JobDelayResponse;
  jobArea: JobAreaResponse;
  institutionType: JobInstitutionTypeResponse;
  firstJob: boolean;
  currentJob: boolean;
}

export interface DetailedContactInformationResponse {
  id: number;
  address: string;
  country: string;
  state: string;
  city: string;
  landlinePhone: string;
  mobilePhone: string;
  personalEmail: string;
  academicEmail: string;
  whatsappGroupAuthorized: boolean;
  isCurrent: boolean;
}

export interface DetailedFamilyInformationResponse {
  id: number;
  maritalState: string; // MaritalState enum
  childNumber: number;
}

export interface DetailedGraduateParticipationResponse {
  id: number;
  participatedInnovationProcesses: InnovationProcessTypeResponse[];
  continuousEducationInterests: string[];
  willingToBeSpeaker: boolean;
  willingToBeProfessor: boolean;
  willingToTeachNonFormalEducation: boolean;
  willingToBePostgraduateStudent: boolean;
  willingToBeNonFormalStudent: boolean;
  willingToBeGraduateRepresentative: boolean;
  willingToAttendAlumniMeetings: boolean;
  willingToParticipateInAlumniActivities: boolean;
}

export interface DetailedCoursedProgramResponse {
  id: number;
  programVersion: ProgramVersionResponse;
  graduationYear: number;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
}

export interface DetailedAcademicEducationResponse {
  id: number;
  type: string;
  studyName: string;
  institution: string;
  country: string;
}

// Main detailed user response
export interface DetailedUserResponse {
  id: string;
  identityDocument: string;
  identityDocumentType: IdentityDocumentTypeResponse;
  name: string;
  middleName?: string;
  lastname: string;
  secondLastname: string;
  institutionalEmail: string;
  gender: string; // Gender enum
  birthdate: string; // LocalDate as string
  contactInformation: DetailedContactInformationResponse;
  familyInformation: DetailedFamilyInformationResponse;
  graduateParticipation: DetailedGraduateParticipationResponse;
  jobs: DetailedJobResponse[];
  coursedPrograms: DetailedCoursedProgramResponse[];
  academicEducationList: DetailedAcademicEducationResponse[];
}

export const DetailedUserService = {
  async getById(id: string): Promise<DetailedUserResponse> {
    const { status, body } = await serviceWithAuth<undefined, DetailedUserResponse>(
      `${DETAILED_USER_ENDPOINT}/${id}`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el usuario detallado");
    return body;
  },

  async getCurrentUserDetailed(): Promise<DetailedUserResponse> {
    const { status, body } = await serviceWithAuth<undefined, DetailedUserResponse>(
      `${DETAILED_USER_ENDPOINT}/authenticated`,
      METHOD.get
    );
    if (status !== 200) throw new Error((body as any)?.message || "No se pudo obtener el usuario detallado autenticado");
    return body;
  },
}; 