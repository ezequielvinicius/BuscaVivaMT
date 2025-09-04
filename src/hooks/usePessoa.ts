import { useQuery } from '@tanstack/react-query'
import { getPessoaDetalhes } from '@/service/personService' 

export function usePessoa(id?: string) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: () => getPessoaDetalhes(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}