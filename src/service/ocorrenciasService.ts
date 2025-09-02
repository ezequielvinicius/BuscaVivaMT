import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'

// === TIPOS ===
export interface InfoOcorrencia {
  id: number
  ocoId: number
  informacao: string
  data: string // yyyy-MM-dd
  anexos?: string[]
}

export interface CreateInfoPayload {
  ocoId: number
  informacao: string
  descricao: string
  data: string // yyyy-MM-dd
  telefone?: string
  latitude?: number
  longitude?: number
  files?: File[]
}

export interface DDVerificarReq {
  nome: string
  mae?: string
  cpf?: string
  dataNascimento?: string // yyyy-MM-dd
  dataDesaparecimento?: string // yyyy-MM-dd
}

export interface DDVerificarRes {
  duplicado: boolean
  protocolo?: string
  mensagem?: string
}

export interface DDCriarReq {
  vitima: {
    nome: string
    mae?: string
    pai?: string
    cpf?: string
    dtNascimento?: string // yyyy-MM-dd
    sexo: 'MASCULINO' | 'FEMININO'
    telefones?: Array<{
      numero: string
      tipoTelefone: 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL'
    }>
    enderecos?: Array<{
      logradouro: string
      numero?: string
      complemento?: string
      bairro?: string
      cidadeId?: number
      uf?: string
      cep?: string
      tipoEndereco: 'RESIDENCIAL' | 'COMERCIAL' | 'OUTRO'
    }>
  }
  comunicante?: {
    nome: string
    telefones?: Array<{
      numero: string
      tipoTelefone: 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL'
    }>
  }
  entrevistaDesaparecimento?: {
    informacao?: string
    vestimenta?: string
    ondeFoiVistoUltimaVez?: string
  }
  unidadeId?: number
  dataHoraFato?: string // ISO string
}

export interface DDCriarRes {
  protocolo: string
  numAip?: string
  ocoId?: number
  mensagem?: string
}

export interface MotivoOcorrencia {
  id: number
  descricao: string
}

// === FUNÇÕES DE SERVIÇO ===

/**
 * Lista informações sobre uma ocorrência específica
 * GET /v1/ocorrencias/informacoes-desaparecido?ocorrenciaId={id}
 */
export async function getInformacoesOcorrencia(ocorrenciaId: number): Promise<InfoOcorrencia[]> {
  try {
    const { data } = await api.get<InfoOcorrencia[]>(
      API_ENDPOINTS.OCORRENCIAS.INFO_LIST,
      { params: { ocorrenciaId } }
    )

    // Deduplica por ID e ordena por data (mais recente primeiro)
    const seen = new Set<number>()
    const deduped = data.filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })

    // Ordena por data desc, depois por ID desc
    return deduped.sort((a, b) => {
      const dateA = new Date(a.data).getTime()
      const dateB = new Date(b.data).getTime()
      if (dateB !== dateA) return dateB - dateA
      return b.id - a.id
    })
  } catch (error) {
    console.error('Erro ao buscar informações da ocorrência:', error)
    return []
  }
}

/**
 * Cria nova informação sobre uma ocorrência
 * POST /v1/ocorrencias/informacoes-desaparecido
 */
export async function createInfoOcorrencia(payload: CreateInfoPayload): Promise<InfoOcorrencia> {
  const formData = new FormData()
  
  // Adiciona arquivos ao FormData
  if (payload.files?.length) {
    payload.files.forEach(file => {
      formData.append('files', file)
    })
  }

  // Monta query params
  const queryParams = new URLSearchParams()
  queryParams.set('ocoId', payload.ocoId.toString())
  queryParams.set('informacao', payload.informacao)
  queryParams.set('descricao', payload.descricao)
  queryParams.set('data', payload.data)
  
  if (payload.telefone) {
    queryParams.set('telefone', payload.telefone)
  }
  if (payload.latitude !== undefined) {
    queryParams.set('latitude', payload.latitude.toString())
  }
  if (payload.longitude !== undefined) {
    queryParams.set('longitude', payload.longitude.toString())
  }

  const { data } = await api.post<InfoOcorrencia>(
    `${API_ENDPOINTS.OCORRENCIAS.INFO_CREATE}?${queryParams}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return data
}

/**
 * Verifica duplicidade antes de criar ocorrência na Delegacia Digital
 * POST /v1/ocorrencias/delegacia-digital/verificar-duplicidade
 */
export async function ddVerificarDuplicidade(payload: DDVerificarReq): Promise<DDVerificarRes> {
  const { data } = await api.post<DDVerificarRes>(
    API_ENDPOINTS.OCORRENCIAS.DD_VERIFICAR,
    payload
  )
  
  return data
}

/**
 * Cria nova ocorrência na Delegacia Digital
 * POST /v1/ocorrencias/delegacia-digital
 */
export async function ddCriarOcorrencia(payload: DDCriarReq): Promise<DDCriarRes> {
  const { data } = await api.post<DDCriarRes>(
    API_ENDPOINTS.OCORRENCIAS.DD_CRIAR,
    payload
  )
  
  return data
}

/**
 * Lista motivos de ocorrência disponíveis
 * GET /v1/ocorrencias/motivos
 */
export async function getMotivosOcorrencia(): Promise<MotivoOcorrencia[]> {
  try {
    const { data } = await api.get<MotivoOcorrencia[]>(
      API_ENDPOINTS.OCORRENCIAS.MOTIVOS
    )
    
    return data || []
  } catch (error) {
    console.error('Erro ao buscar motivos:', error)
    return []
  }
}

// === UTILITÁRIOS ===

/**
 * Formata dados básicos para verificação de duplicidade
 */
export function formatarParaVerificacao(dados: {
  nome: string
  mae?: string
  cpf?: string
  dataNascimento?: string
  dataDesaparecimento?: string
}): DDVerificarReq {
  return {
    nome: dados.nome.trim().toUpperCase(),
    mae: dados.mae?.trim().toUpperCase(),
    cpf: dados.cpf?.replace(/\D/g, ''),
    dataNascimento: dados.dataNascimento,
    dataDesaparecimento: dados.dataDesaparecimento
  }
}

/**
 * Valida payload antes de enviar para Delegacia Digital
 */
export function validarPayloadDD(payload: DDCriarReq): { valido: boolean; erros: string[] } {
  const erros: string[] = []

  // Validações obrigatórias
  if (!payload.vitima?.nome?.trim()) {
    erros.push('Nome da vítima é obrigatório')
  }

  if (!payload.vitima?.sexo) {
    erros.push('Sexo da vítima é obrigatório')
  }

  if (!payload.vitima?.dtNascimento) {
    erros.push('Data de nascimento da vítima é obrigatória')
  }

  // Validação de CPF se fornecido
  if (payload.vitima?.cpf && !validarCPF(payload.vitima.cpf)) {
    erros.push('CPF inválido')
  }

  return {
    valido: erros.length === 0,
    erros
  }
}

/**
 * Valida CPF básico
 */
function validarCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false // Todos os dígitos iguais
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit1 = (sum * 10) % 11
  if (digit1 === 10) digit1 = 0
  
  if (digit1 !== parseInt(cleaned.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  let digit2 = (sum * 10) % 11
  if (digit2 === 10) digit2 = 0
  
  return digit2 === parseInt(cleaned.charAt(10))
}