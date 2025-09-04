import type { 
  OcorrenciaInformacaoDTO, 
  OcorrenciaInformacao, 
  MotivoDesaparecimento,
  VerificarDuplicidadeResponse 
} from '@/types/ocorrencia'

/**
 * Adapter: OcorrenciaInformacaoDTO → OcorrenciaInformacao
 */
export function adaptOcorrenciaInformacao(dto: OcorrenciaInformacaoDTO | null | undefined): OcorrenciaInformacao {
  if (!dto) {
    return createEmptyOcorrenciaInformacao()
  }

  return {
    id: Number(dto.id) || 0,
    ocoId: Number(dto.ocoId) || 0,
    informacao: String(dto.informacao || '').trim() || 'Informação não disponível',
    data: dto.data || new Date().toISOString().split('T')[0],
    anexos: adaptAnexos(dto.anexos)
  }
}

/**
 * Adapter para lista de anexos
 */
function adaptAnexos(anexos: unknown): string[] {
  if (!Array.isArray(anexos)) return []
  
  return anexos
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .map(item => item.trim())
}

/**
 * Adapter para motivos de desaparecimento
 */
export function adaptMotivoDesaparecimento(dto: any): MotivoDesaparecimento {
  return {
    id: Number(dto.id) || 0,
    descricao: String(dto.descricao || '').trim() || 'Motivo não especificado'
  }
}

/**
 * Adapter para resposta de verificação de duplicidade
 */
export function adaptVerificarDuplicidade(response: any): VerificarDuplicidadeResponse {
  return {
    duplicado: Boolean(response.duplicado),
    protocolo: response.protocolo || undefined,
    mensagem: response.mensagem || undefined
  }
}

/**
 * Sanitizador para payload de criação de informação
 */
export function sanitizeCreateInfoPayload(payload: any): any {
  return {
    ...payload,
    informacao: String(payload.informacao || '').trim(),
    descricao: String(payload.descricao || '').trim(),
    telefone: payload.telefone ? String(payload.telefone).replace(/\D/g, '') : undefined,
    data: payload.data || new Date().toISOString().split('T')[0],
    latitude: payload.latitude ? Number(payload.latitude) : undefined,
    longitude: payload.longitude ? Number(payload.longitude) : undefined
  }
}

/**
 * Factory para OcorrenciaInformacao vazia
 */
function createEmptyOcorrenciaInformacao(): OcorrenciaInformacao {
  return {
    id: 0,
    ocoId: 0,
    informacao: 'Dados não disponíveis',
    data: new Date().toISOString().split('T')[0],
    anexos: []
  }
}

/**
 * Validador de arquivos de upload
 */
export function validateUploadFiles(files: FileList | File[] | null): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!files || files.length === 0) {
    return { valid: true, errors: [] }
  }

  const fileArray = Array.from(files)
  
  if (fileArray.length > 3) {
    errors.push('Máximo 3 arquivos permitidos')
  }

  for (const file of fileArray) {
    if (file.size > 5_000_000) { // 5MB
      errors.push(`Arquivo "${file.name}" excede 5MB`)
    }
    
    if (!file.type.startsWith('image/')) {
      errors.push(`Arquivo "${file.name}" deve ser uma imagem`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
