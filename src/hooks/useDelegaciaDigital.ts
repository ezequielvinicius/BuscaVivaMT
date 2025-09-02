import { useMutation } from '@tanstack/react-query'
import { ddVerificarDuplicidade, ddCriarOcorrencia, type DDVerificarReq, type DDCriarReq } from '@/service/ocorrenciasService'

export function useDelegaciaDigital() {
  const verificar = useMutation({ mutationFn: (b: DDVerificarReq) => ddVerificarDuplicidade(b) })
  const criar = useMutation({ mutationFn: (b: DDCriarReq) => ddCriarOcorrencia(b) })
  return { verificar, criar }
}