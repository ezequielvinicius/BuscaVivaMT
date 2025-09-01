import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listPessoas } from '@/services/personService'
import type { FiltroParams } from '@/types/api'
import type { PaginatedResponse, PersonListItem } from '@/types/person'

export function usePessoas(params: FiltroParams) {
  return useQuery<PaginatedResponse<PersonListItem>>({
    queryKey: ['pessoas', params],
    queryFn: () => listPessoas(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
}
