import type { UserFilterRequest } from "@/lib/services/profile/graduate-search.service"

export type SearchFilterData = Pick<UserFilterRequest, 'gender' | 'startYear' | 'endYear' | 'programIds' | 'country' | 'city' | 'mobile' | 'email' | 'academicEmail' | 'complementaryStudies'> & {
  names: string
  lastnames: string
}

export type SearchFilterChangeHandler = (field: string, value: string | string[] | number | number[] | undefined) => void

export interface GraduateSearchProps {
  filters: SearchFilterData
  onFilterChange: SearchFilterChangeHandler
  onSearch: (e?: React.FormEvent) => void
  onClearFilters: () => void
  onViewProfile: (id: string) => void
  onExport?: () => void
  onPageChange: (page: number) => void
  results: Array<{
    id: string
    name: string
    middleName?: string
    lastname: string
    secondLastname?: string
    email?: string
    academicEmail?: string
    mobile?: string
    programs?: Array<{ name: string }>
    country?: string
    city?: string
    gender?: string
    role?: string
    graduationYear?: string
    lastUpdateDate?: string
    company?: string
    collaborationInfo?: string
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  isLoading?: boolean
  isSearching?: boolean
  programs: Array<{ id: number, name: string, code: string }>
  catalogError?: string | null
  filtersWidthClass?: string
  contentGapClass?: string
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  sortBy?: string
  asc?: boolean
  onSortChange?: (sortBy: string, asc: boolean) => void
}