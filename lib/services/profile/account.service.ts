import { serviceWithAuth } from '@/lib/services/base.service'
import { METHOD } from '@/lib/services/constants/api.constants'

export enum RoleName {
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  GRADUATE = 'GRADUATE',
  DEAN = 'DEAN',
}

export interface AuthFilterRequest {
  email?: string
  role?: RoleName
}

export interface AuthRequest {
  email: string
  password: string
  role: RoleName
}

export interface AuthResponse {
  email: string
  name: string
  middleName: string
  lastname: string
  secondLastname: string
  role: RoleName
}

export interface PageQuery {
  page?: number
  size?: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const ACCOUNT_ENDPOINT = '/v1/accounts'

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export const AccountService = {
  async findById(id: string): Promise<AuthResponse> {
    const { status, body } = await serviceWithAuth<undefined, AuthResponse>(
      `${ACCOUNT_ENDPOINT}/${id}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || 'No se pudo obtener la cuenta')
    return body
  },

  async updateById(id: string, data: AuthRequest): Promise<AuthResponse> {
    const { status, body } = await serviceWithAuth<AuthRequest, AuthResponse>(
      `${ACCOUNT_ENDPOINT}/${id}`,
      METHOD.put,
      data
    )
    if (status !== 200) throw new Error((body as any)?.message || 'No se pudo actualizar la cuenta')
    return body
  },

  async findAllFiltered(
    filter: AuthFilterRequest = {},
    pageQuery: PageQuery = {}
  ): Promise<PageResponse<AuthResponse>> {
    const queryString = buildQueryString({ ...filter, ...pageQuery })
    const { status, body } = await serviceWithAuth<undefined, PageResponse<AuthResponse>>(
      `${ACCOUNT_ENDPOINT}${queryString}`,
      METHOD.get
    )
    if (status !== 200) throw new Error((body as any)?.message || 'No se pudieron obtener las cuentas')
    return body
  },
} 