import { useQuery } from '@tanstack/react-query'
import { listPessoas } from '@/services/personService'
import type { FiltroParams } from '@/types/api'

export function usePessoas(params: FiltroParams) {
  return useQuery({
    queryKey: ['pessoas', params],
    queryFn: () => listPessoas(params),
    staleTime: 5 * 60 * 1000
  })
}
