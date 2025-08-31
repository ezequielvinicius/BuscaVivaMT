import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { PaginatedResponse, PersonListItem } from '@/types/person'

export async function listPessoas(params: FiltroParams): Promise<PaginatedResponse<PersonListItem>> {
  const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, { params })
  return data
}
