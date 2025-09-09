/**
 * Tipos base extraídos diretamente da OpenAPI ABITUS
 * Garantem 100% de compatibilidade com o backend
 */

// ===== TIPOS BASE DA API =====
export interface PessoaDTO {
  id: number
  nome: string
  idade?: number
  sexo: "MASCULINO" | "FEMININO"
  vivo: boolean  
  urlFoto?: string  
  ultimaOcorrencia?: OcorrenciaDTO
}

export interface OcorrenciaDTO {
  dtDesaparecimento?: string  // format: date-time
  dataLocalizacao?: string   // format: date
  encontradoVivo?: boolean
  localDesaparecimentoConcat?: string
  ocorrenciaEntrevDesapDTO?: OcorrenciaEntrevDesapDTO
  listaCartaz?: OcorrenciaCartazDTO[]
  ocoId: number
}

export interface OcorrenciaCartazDTO {
  urlCartaz: string
  tipoCartaz: "PDF_DESAPARECIDO" | "PDF_LOCALIZADO" | "JPG_DESAPARECIDO" | "JPG_LOCALIZADO" | "INSTA_DESAPARECIDO" | "INSTA_LOCALIZADO"
}

export interface OcorrenciaEntrevDesapDTO {
  informacao?: string
  vestimentasDesaparecido?: string
}

export interface PagePessoaDTO {
  totalPages: number
  totalElements: number
  numberOfElements: number
  first: boolean
  last: boolean
  size: number
  content: PessoaDTO[]
  number: number
  empty: boolean
}

// ===== TIPOS PARA INFORMAÇÕES =====
export interface OcorrenciaInformacaoDTO {
  ocoId: number
  informacao: string
  data: string  // format: date
  id?: number
  anexos?: string[]
}

// ===== TIPOS DE FILTROS =====
export interface FiltroParams {
  nome?: string
  faixaIdadeInicial?: number
  faixaIdadeFinal?: number
  sexo?: "MASCULINO" | "FEMININO" | "Todos"  // Inclui 'Todos'
  pagina?: number
  porPagina?: number
  status?: "DESAPARECIDO" | "LOCALIZADO" | "Todos"  // Inclui 'Todos'
}
