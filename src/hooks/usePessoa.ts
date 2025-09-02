import { useQuery } from '@tanstack/react-query'
import { getPessoa } from '@/service/personService' 

export function usePessoa(id?: string) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: () => getPessoa(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}