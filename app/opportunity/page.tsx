// Copia exacta de la página de oportunidades de employer, pero ahora en app/opportunity/page.tsx

"use client";

import Navbar from "@/components/navbar";
import OpportunityTable from "@/components/organisms/opportunity-table";
import ApplicationTable from "@/components/organisms/application-table";
import { OpportunityCreationForm } from "@/components/organisms/opportunity-creation-form";
import { OpportunityConfirmationDialog } from "@/components/organisms/opportunity-confirmation-dialog";

import { toast } from "@/hooks/use-toast";
import { ROLES } from "@/lib/services/constants/api.constants";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { OpportunityRequest, OpportunityResponse, OpportunityService } from "@/lib/services/opportunity/opportunity.service";
import { AuthenticatedUserResponse, DetailedUserResponse } from "@/lib/services/profile";
import { EmployerService, EmployerProfileResponse } from "@/lib/services/profile/employer.service";
import { SalaryRangeService, SalaryRangeResponse } from "@/lib/services/catalog/salary-range.service";
import { ProgramService, ProgramResponse } from "@/lib/services/catalog/program.service";
import { ProgramCompetencyService, ProgramCompetencyResponse } from "@/lib/services/catalog/program-competency.service";
import { JobAreaService, JobAreaResponse } from "@/lib/services/catalog/job-area.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, DollarSign, Calendar, User, Settings, Building } from "lucide-react";

import { logger } from "@/lib/logging";

export default function OpportunityPage() {
  // ...exactamente igual que EmployerOpportunityPage...
}
