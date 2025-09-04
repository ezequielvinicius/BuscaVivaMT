/**
 * Tipos baseados no OpenAPI Schema PessoaDTO
 */
export type Sexo = 'MASCULINO' | 'FEMININO'
export type StatusPessoa = 'DESAPARECIDO' | 'LOCALIZADO'

/**
 * Cartaz associado à pessoa (schema OcorrenciaCartazDTO)
 */
export interface Cartaz {
  urlCartaz: string
  tipoCartaz: 'PDF_DESAPARECIDO' | 'PDF_LOCALIZADO' | 'JPG_DESAPARECIDO' | 'JPG_LOCALIZADO' | 'INSTA_DESAPARECIDO' | 'INSTA_LOCALIZADO'
}

/**
 * Ocorrência simplificada (schema OcorrenciaDTO)
 */
export interface Ocorrencia {
  ocoId: number
  dtDesaparecimento?: string
  dataLocalizacao?: string
  encontradoVivo?: boolean
  localDesaparecimentoConcat?: string
  listaCartaz?: Cartaz[]
  ocorrenciaEntrevDesapDTO?: {
    informacao?: string
    vestimentasDesaparecido?: string
  }
}

/**
 * DTO da API (schema PessoaDTO) - NUNCA use diretamente na UI
 */
export interface PessoaDTO {
  id: number
  nome: string
  idade?: number
  sexo: Sexo
  vivo: boolean
  urlFoto?: string
  ultimaOcorrencia?: Ocorrencia
}

/**
 * Pessoa normalizada para listagens - USE SEMPRE na UI
 */
export interface PersonListItem {
  id: number
  nome: string
  idade?: number
  sexo: Sexo
  status: StatusPessoa
  fotoPrincipal?: string
  cidade: string
  dataDesaparecimento: string
}

/**
 * Pessoa detalhada para tela de detalhes
 */
export interface PersonDetail extends PersonListItem {
  cartazes: Cartaz[]
  informacaoBreve: string
  vestimentas: string
  localDesaparecimento: string
  dataLocalizacao: string
  encontradoVivo?: boolean
  ocoId?: number
}

/**
 * Resposta paginada (schema PagePessoaDTO)
 */
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  numberOfElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
}
