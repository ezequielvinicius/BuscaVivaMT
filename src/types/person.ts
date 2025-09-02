export type Sexo = 'MASCULINO' | 'FEMININO'
export type StatusPessoa = 'DESAPARECIDO' | 'LOCALIZADO'

export interface PersonListItem {
  id: number
  nome: string
  idade?: number
  sexo: Sexo
  status: StatusPessoa // Calculado a partir do campo 'vivo'
  fotoPrincipal?: string
  cidade?: string
  dataDesaparecimento?: string
}

// Tipo real da API (baseado na documentação)
export interface APIPersonResponse {
  id: number
  nome: string
  idade?: number
  sexo: Sexo
  vivo: boolean // Campo real da API
  urlFoto?: string
  ultimaOcorrencia?: {
    dtDesaparecimento?: string
    dataLocalizacao?: string
    encontradoVivo?: boolean
    localDesaparecimentoConcat?: string
    ocorrenciaEntrevDesapDTO?: {
      informacao?: string
      vestimentasDesaparecido?: string
    }
    listaCartaz?: Array<{
      urlCartaz?: string
      tipoCartaz?: string
    }>
    ocoId?: number
  }
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort?: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  offset?: number
  paged?: boolean
  unpaged?: boolean
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  pageable: Pageable
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  number: number
  sort?: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  empty: boolean
}