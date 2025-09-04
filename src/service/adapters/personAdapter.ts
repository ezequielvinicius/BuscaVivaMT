import type { PessoaDTO, PersonListItem, PersonDetail, Cartaz } from '@/types/person'

/**
 * Adapter defensivo: PessoaDTO → PersonListItem
 * Garante que a UI nunca receba dados inconsistentes
 */
export function adaptPersonToListItem(dto: PessoaDTO | null | undefined): PersonListItem {
  if (!dto) {
    return createEmptyPersonListItem()
  }

  return {
    id: Number(dto.id) || 0,
    nome: String(dto.nome || '').trim() || 'Nome não informado',
    idade: typeof dto.idade === 'number' && dto.idade > 0 ? dto.idade : undefined,
    sexo: ['MASCULINO', 'FEMININO'].includes(dto.sexo) ? dto.sexo : 'MASCULINO',
    status: dto.vivo === false ? 'LOCALIZADO' : 'DESAPARECIDO',
    fotoPrincipal: dto.urlFoto || '',
    cidade: dto.ultimaOcorrencia?.localDesaparecimentoConcat || '',
    dataDesaparecimento: dto.ultimaOcorrencia?.dtDesaparecimento || ''
  }
}

/**
 * Adapter defensivo: PessoaDTO → PersonDetail
 */
export function adaptPersonToDetail(dto: PessoaDTO | null | undefined): PersonDetail {
  if (!dto) {
    return createEmptyPersonDetail()
  }

  const base = adaptPersonToListItem(dto)
  const ocorrencia = dto.ultimaOcorrencia

  return {
    ...base,
    cartazes: adaptCartazes(ocorrencia?.listaCartaz),
    informacaoBreve: ocorrencia?.ocorrenciaEntrevDesapDTO?.informacao || '',
    vestimentas: ocorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido || '',
    localDesaparecimento: ocorrencia?.localDesaparecimentoConcat || '',
    dataLocalizacao: ocorrencia?.dataLocalizacao || '',
    encontradoVivo: ocorrencia?.encontradoVivo,
    ocoId: ocorrencia?.ocoId
  }
}

/**
 * Adapter para lista de cartazes
 */
function adaptCartazes(cartazes: unknown): Cartaz[] {
  if (!Array.isArray(cartazes)) return []
  
  return cartazes
    .filter((item) => {
      return item && 
             typeof item === 'object' && 
             typeof item.urlCartaz === 'string' &&
             item.urlCartaz.trim().length > 0
    })
    .map((item: any) => ({
      urlCartaz: item.urlCartaz.trim(),
      tipoCartaz: item.tipoCartaz || 'PDF_DESAPARECIDO'
    }))
}

/**
 * Factory para PersonListItem vazio (fallback seguro)
 */
function createEmptyPersonListItem(): PersonListItem {
  return {
    id: 0,
    nome: 'Dados não disponíveis',
    sexo: 'MASCULINO',
    status: 'DESAPARECIDO',
    fotoPrincipal: '',
    cidade: '',
    dataDesaparecimento: ''
  }
}

/**
 * Factory para PersonDetail vazio (fallback seguro)
 */
function createEmptyPersonDetail(): PersonDetail {
  return {
    ...createEmptyPersonListItem(),
    cartazes: [],
    informacaoBreve: '',
    vestimentas: '',
    localDesaparecimento: '',
    dataLocalizacao: '',
    encontradoVivo: undefined,
    ocoId: undefined
  }
}
