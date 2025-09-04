import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  OcorrenciaInformacao,
  CreateInfoPayload,
  MotivoDesaparecimento,
  VerificarDuplicidadeRequest,
  VerificarDuplicidadeResponse,
  CriarOcorrenciaRequest,
  CriarOcorrenciaResponse
} from '@/types/ocorrencia'
import {
  adaptOcorrenciaInformacao,
  adaptMotivoDesaparecimento,
  adaptVerificarDuplicidade,
  sanitizeCreateInfoPayload,
  validateUploadFiles
} from './adapters/ocorrenciaAdapter'

/**
 * Lista informações de uma ocorrência
 * @param ocorrenciaId ID da ocorrência
 * @returns Lista normalizada de informações
 */
export async function getInformacoesOcorrencia(ocorrenciaId: number): Promise<OcorrenciaInformacao[]> {
  try {
    if (!ocorrenciaId || ocorrenciaId <= 0) {
      throw new Error('ID da ocorrência inválido')
    }

    const { data } = await api.get(API_ENDPOINTS.OCORRENCIAS.INFO_LIST, {
      params: { ocorrenciaId }
    })

    const informacoes = (Array.isArray(data) ? data : [])
      .map(adaptOcorrenciaInformacao)
      .filter(info => info.id > 0) // Remove itens inválidos

    // Ordena por data/ID decrescente e remove duplicatas
    return removeDuplicatedInformacoes(informacoes)
      .sort((a, b) => {
        const dateA = new Date(a.data).getTime()
        const dateB = new Date(b.data).getTime()
        return dateB - dateA || b.id - a.id
      })

  } catch (error) {
    console.error('Erro ao buscar informações da ocorrência:', error)
    return []
  }
}

/**
 * Cria nova informação sobre ocorrência
 * @param payload Dados da informação
 * @returns Informação criada normalizada
 */
export async function createInfoOcorrencia(payload: CreateInfoPayload): Promise<OcorrenciaInformacao> {
  try {
    // Validação prévia
    const validationErrors = validateCreateInfoPayload(payload)
    if (validationErrors.length > 0) {
      throw new Error(`Dados inválidos: ${validationErrors.join(', ')}`)
    }

    // Sanitização
    const sanitizedPayload = sanitizeCreateInfoPayload(payload)

    // Preparação do FormData
    const formData = new FormData()
    if (payload.files) {
      const fileValidation = validateUploadFiles(payload.files)
      if (!fileValidation.valid) {
        throw new Error(`Arquivos inválidos: ${fileValidation.errors.join(', ')}`)
      }

      Array.from(payload.files).forEach(file => {
        formData.append('files', file)
      })
    }

    // Query parameters
    const queryParams = new URLSearchParams()
    queryParams.set('ocoId', String(sanitizedPayload.ocoId))
    queryParams.set('informacao', sanitizedPayload.informacao)
    queryParams.set('descricao', sanitizedPayload.descricao)
    queryParams.set('data', sanitizedPayload.data)
    
    if (sanitizedPayload.telefone) {
      queryParams.set('telefone', sanitizedPayload.telefone)
    }
    if (sanitizedPayload.latitude) {
      queryParams.set('latitude', String(sanitizedPayload.latitude))
    }
    if (sanitizedPayload.longitude) {
      queryParams.set('longitude', String(sanitizedPayload.longitude))
    }

    const { data } = await api.post(
      `${API_ENDPOINTS.OCORRENCIAS.INFO_CREATE}?${queryParams.toString()}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000 // 30s para upload
      }
    )

    return adaptOcorrenciaInformacao(data)

  } catch (error) {
    console.error('Erro ao criar informação:', error)
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Erro ao enviar informação. Tente novamente.'
    )
  }
}

/**
 * Verifica duplicidade de vítima
 */
export async function verificarDuplicidade(payload: VerificarDuplicidadeRequest): Promise<VerificarDuplicidadeResponse> {
  try {
    const sanitizedPayload = {
      ...payload,
      nome: payload.nome.trim().toUpperCase(),
      mae: payload.mae?.trim().toUpperCase(),
      cpf: payload.cpf?.replace(/\D/g, '')
    }

    const { data } = await api.post(API_ENDPOINTS.OCORRENCIAS.DD_VERIFICAR, sanitizedPayload)
    return adaptVerificarDuplicidade(data)

  } catch (error) {
    console.error('Erro ao verificar duplicidade:', error)
    return { duplicado: false, mensagem: 'Erro na verificação. Prossiga com cadastro.' }
  }
}

/**
 * Cria ocorrência na Delegacia Digital
 */
export async function criarOcorrencia(payload: CriarOcorrenciaRequest): Promise<CriarOcorrenciaResponse> {
  try {
    const { data } = await api.post(API_ENDPOINTS.OCORRENCIAS.DD_CRIAR, payload, {
      timeout: 60000 // 1min para criação de ocorrência
    })
    
    return {
      protocolo: data.protocolo,
      numAip: data.numAip,
      ocoId: data.ocoId ? Number(data.ocoId) : undefined,
      mensagem: data.mensagem
    }

  } catch (error) {
    console.error('Erro ao criar ocorrência:', error)
    throw new Error('Erro ao criar ocorrência na Delegacia Digital')
  }
}

/**
 * Lista motivos de desaparecimento
 */
export async function getMotivosDesaparecimento(): Promise<MotivoDesaparecimento[]> {
  try {
    const { data } = await api.get(API_ENDPOINTS.OCORRENCIAS.MOTIVOS)
    
    return (Array.isArray(data) ? data : [])
      .map(adaptMotivoDesaparecimento)
      .filter(motivo => motivo.id > 0 && motivo.descricao.length > 0)

  } catch (error) {
    console.error('Erro ao buscar motivos:', error)
    return []
  }
}

// Utilitários internos
function validateCreateInfoPayload(payload: CreateInfoPayload): string[] {
  const errors: string[] = []

  if (!payload.ocoId || payload.ocoId <= 0) {
    errors.push('ID da ocorrência é obrigatório')
  }
  if (!payload.informacao || payload.informacao.trim().length < 10) {
    errors.push('Informação deve ter pelo menos 10 caracteres')
  }
  if (!payload.descricao || payload.descricao.trim().length < 5) {
    errors.push('Descrição deve ter pelo menos 5 caracteres')
  }
  if (!payload.data || !/^\d{4}-\d{2}-\d{2}$/.test(payload.data)) {
    errors.push('Data deve estar no formato yyyy-MM-dd')
  }

  return errors
}

function removeDuplicatedInformacoes(informacoes: OcorrenciaInformacao[]): OcorrenciaInformacao[] {
  const seen = new Set<number>()
  return informacoes.filter(info => {
    if (seen.has(info.id)) return false
    seen.add(info.id)
    return true
  })
}
