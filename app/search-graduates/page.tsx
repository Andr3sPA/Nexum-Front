"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { GraduateSearch } from "@/components/organisms/graduate-search";
import { ROUTES } from "@/lib/routes";
import {
  GraduateSearchService,
  UserFilterRequest,
  PageQuery,
  BasicUserResponse,
} from "@/lib/services/profile/graduate-search.service";
import { LocalStorageService } from "@/lib/services/local-storage.service";
import { logger } from "@/lib/logging";
import { ROLES } from "@/lib/services/constants/api.constants";
import { ProgramService } from "@/lib/services/catalog/program.service";
import { convertFiltersToDetailed } from "@/lib/utils/search-utils";

export default function SearchGraduatesPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [firstLastname, setFirstLastname] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState("");
  const [role, setRole] = useState<string | null>(null);

  // Catálogos
  const [programs, setPrograms] = useState<
    { id: number; name: string; code: string }[]
  >([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Filtros simplificados
  const [filters, setFilters] = useState({
    names: "",
    lastnames: "",
    gender: "",
    startYear: "",
    endYear: "",
    programIds: [] as string[],
    country: "",
    city: "",
    mobile: "",
    email: "",
    academicEmail: "",
  });

  // Resultados y paginación
  const [searchResults, setSearchResults] = useState<BasicUserResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string>("");
  const [asc, setAsc] = useState<boolean>(true);

  // Inicializar datos del usuario cuando el componente se monta en el cliente
  useEffect(() => {
    setIsClient(true);
    const storedUserProfile = LocalStorageService.getItem<any>("userProfile");
    const storedUser = LocalStorageService.getItem<any>("user");

    setUserProfile(storedUserProfile);
    setUser(storedUser);

    if (storedUserProfile) {
      const fName = storedUserProfile?.name?.split(" ")[0] || "";
      const fLastname = storedUserProfile?.lastname?.split(" ")[0] || "";
      setFirstName(fName);
      setFirstLastname(fLastname);
      setInitials((fName[0] || "") + (fLastname[0] || ""));
    }

    if (storedUser) {
      setEmail(storedUser.email || "");
      setRole(storedUser.role);
    }
  }, []);

  useEffect(() => {
    if (
      isClient &&
      role &&
      role !== ROLES.ADMINISTRATIVE &&
      role !== ROLES.DEAN &&
      role !== ROLES.EMPLOYER
    ) {
      router.replace("/dashboard");
    }
  }, [isClient, role, router]);

  useEffect(() => {
    if (isClient) {
      setIsLoadingCatalogs(true);
      setCatalogError(null);
      ProgramService.getAll()
        .then((programs) => {
          setPrograms(programs);
          setIsLoadingCatalogs(false);
        })
        .catch((err) => {
          setPrograms([]);
          setIsLoadingCatalogs(false);
          setCatalogError(
            "No se pudieron cargar los catálogos. Intenta de nuevo más tarde.",
          );
        });
    }
  }, [isClient]);

  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    try {
      // Convertir filtros simplificados a filtros detallados
      const detailedFilters = convertFiltersToDetailed(filters);

      const searchFilters: UserFilterRequest = {
        name: detailedFilters.name || undefined,
        middleName: detailedFilters.middleName || undefined,
        lastname: detailedFilters.lastname || undefined,
        secondLastname: detailedFilters.secondLastname || undefined,
        gender: detailedFilters.gender || undefined,
        startYear: detailedFilters.startYear
          ? Number(detailedFilters.startYear)
          : undefined,
        endYear: detailedFilters.endYear
          ? Number(detailedFilters.endYear)
          : undefined,
        programIds: detailedFilters.programIds
          ? detailedFilters.programIds.map(Number)
          : undefined,
        country: detailedFilters.country || undefined,
        city: detailedFilters.city || undefined,
        mobile: detailedFilters.mobile || undefined,
        email: detailedFilters.email || undefined,
        academicEmail: detailedFilters.academicEmail || undefined,
        role: "GRADUATE", // Por defecto buscar solo graduados
      };
      const pageQuery: PageQuery = { page, pageSize, sortBy: sortBy || undefined, asc };
      const result = await GraduateSearchService.searchGraduates(
        searchFilters,
        pageQuery,
      );
      setSearchResults(result.content);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      logger.error("Error searching graduates:", error);
      setSearchResults([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, page, pageSize]);

  const handleClearFilters = () => {
    setFilters({
      names: "",
      lastnames: "",
      gender: "",
      startYear: "",
      endYear: "",
      programIds: [],
      country: "",
      city: "",
      mobile: "",
      email: "",
      academicEmail: "",
    });
  };

  const handleViewProfile = (id: string) => {
    router.push(`${ROUTES.ADMIN.VIEW_PROFILE}?userId=${id}`);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting results");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleSortChange = (newSortBy: string, newAsc: boolean) => {
    setSortBy(newSortBy);
    setAsc(newAsc);
    setPage(0);
    handleSearch();
  };

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  // Verificar permisos después de que los datos estén cargados
  if (
    role !== ROLES.ADMINISTRATIVE &&
    role !== ROLES.DEAN &&
    role !== ROLES.EMPLOYER
  ) {
    return null;
  }

  return (
    <>
      {user && userProfile && (
        <Navbar
          user={{
            name: userProfile.name,
            lastname: userProfile.lastname,
            email: user.email,
            role: user.role,
            initials: user.initials,
            firstName: userProfile.name?.split(" ")[0] || "",
            firstLastname: userProfile.lastname?.split(" ")[0] || "",
            ...userProfile,
          }}
        />
      )}
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto py-6 sm:px-8 lg:px-12">
          <div className="px-0 py-6">
            <GraduateSearch
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
              onClearFilters={handleClearFilters}
              onViewProfile={handleViewProfile}
              onExport={handleExport}
              onPageChange={handlePageChange}
              results={searchResults}
              totalCount={totalCount}
              currentPage={page}
              totalPages={totalPages}
              isSearching={isSearching}
              programs={programs}
              catalogError={catalogError}
              filtersWidthClass="w-full md:w-[420px] lg:w-[480px]"
              contentGapClass="gap-10"
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              sortBy={sortBy}
              asc={asc}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
