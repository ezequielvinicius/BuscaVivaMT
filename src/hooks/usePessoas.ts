import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { listPessoas } from '@/services/personService'
import type { FiltroParams } from '@/types/api'
import type { PaginatedResponse, PersonListItem } from '@/types/person'

export function usePessoas(params: FiltroParams) {
  // Limpa parâmetros vazios antes de fazer a requisição
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>) as FiltroParams;

  return useQuery<PaginatedResponse<PersonListItem>>({
    queryKey: ['pessoas', cleanParams],
    queryFn: () => listPessoas(cleanParams),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}