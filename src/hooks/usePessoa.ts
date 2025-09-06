import { useQuery } from '@tanstack/react-query'
import { getPessoaDetalhes } from '@/service/personService'

export function usePessoa(id: string | number) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: () => getPessoaDetalhes(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,  // 10 minutos
    gcTime: 30 * 60 * 1000,     // 30 minutos (era cacheTime)
  })
}
