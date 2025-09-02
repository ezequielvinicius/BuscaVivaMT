import { useQuery, useMutation } from '@tanstack/react-query'
import { getInformacoesOcorrencia, createInfoOcorrencia } from '@/services/ocorrenciasService'

export function useInformacoesOcorrencia(ocoId?: number) {
  const list = useQuery({
    queryKey: ['ocorrencia-infos', ocoId],
    queryFn: () => getInformacoesOcorrencia(ocoId!),
    enabled: typeof ocoId === 'number' && ocoId > 0,
    staleTime: 2 * 60 * 1000,
  })

  const create = useMutation({
    mutationFn: createInfoOcorrencia,
  })

  return { list, create }
}
