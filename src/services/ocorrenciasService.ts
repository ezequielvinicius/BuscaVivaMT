import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

/** Lista de informações públicas da ocorrência (relatos + anexos) */
export type InfoOcorrencia = {
  ocoId: number
  informacao: string
  data: string // yyyy-MM-dd
  id: number
  anexos?: string[]
}
export async function getInformacoesOcorrencia(ocorrenciaId: number) {
  const { data } = await api.get<InfoOcorrencia[]>(
    API_ENDPOINTS.OCORRENCIAS.INFO_LIST,
    { params: { ocorrenciaId } }
  )
  return data
}

/** Criação de informação (RF004) — multipart + query params */
export type CreateInfoPayload = {
  informacao: string
  descricao: string
  data: string // yyyy-MM-dd
  ocoId: number
  files?: File[]
}
export async function createInfoOcorrencia(p: CreateInfoPayload) {
  const fd = new FormData()
  for (const f of p.files ?? []) fd.append('files', f)
  // query params: informacao, descricao, data, ocoId
  const { data } = await api.post(
    API_ENDPOINTS.OCORRENCIAS.INFO_CREATE,
    fd,
    { params: { informacao: p.informacao, descricao: p.descricao, data: p.data, ocoId: p.ocoId } }
  )
  return data
}

/** Motivos (opcional, para um select no form) */
export async function getMotivos() {
  const { data } = await api.get<{ id: number; descricao: string }[]>(API_ENDPOINTS.OCORRENCIAS.MOTIVOS)
  return data
}

/** Delegacia Digital — verificar duplicidade (passo 0 do wizard) */
export type DDVerificarReq = {
  nome: string
  mae?: string
  cpf?: string
  dataNascimento?: string // yyyy-MM-dd
  dataDesaparecimento?: string // yyyy-MM-dd
}
export async function ddVerificarDuplicidade(body: DDVerificarReq) {
  const { data } = await api.post(API_ENDPOINTS.OCORRENCIAS.DD_VERIFICAR, body)
  return data as { duplicado?: boolean; protocolos?: string[] } // shape típico
}

/** Delegacia Digital — criar ocorrência completa */
export type DDCriarReq = any // (use o payload grande do swagger; podemos tipar aos poucos)
export async function ddCriarOcorrencia(body: DDCriarReq) {
  const { data } = await api.post(API_ENDPOINTS.OCORRENCIAS.DD_CRIAR, body)
  return data as { protocolo: string }
}
