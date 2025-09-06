/**
 * Tipos do frontend - dados normalizados e limpos
 * Derivados da API mas otimizados para UX
 */

export type PersonStatus = "DESAPARECIDO" | "LOCALIZADO"
export type Sexo = "MASCULINO" | "FEMININO"

// Interface para cards na listagem
export interface PersonListItem {
  id: number
  nome: string
  idade?: number
  sexo: Sexo
  status: PersonStatus  // ⚠️ CALCULADO, NÃO DIRETO DA API
  fotoPrincipal: string
  cidade: string
  dataDesaparecimento: string
}

// Interface para página de detalhes
export interface PersonDetail extends PersonListItem {
  ocoId?: number
  localDesaparecimento: string
  dataLocalizacao?: string
  encontradoVivo?: boolean
  informacaoBreve: string
  vestimentas: string
  cartazes: Array<{
    urlCartaz: string
    tipoCartaz: string
  }>
}

// ⚠️ IMPORTANTE: Este tipo estava faltando e causando erro
export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  numberOfElements: number
  currentPage: number
  pageSize: number
  first: boolean
  last: boolean
  empty: boolean
}
