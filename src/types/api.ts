/**
 * Parâmetros de filtro padronizados para consultas
 * Baseado 100% no OpenAPI /v1/pessoas/aberto/filtro
 */
export interface FiltroParams {
  nome?: string
  faixaIdadeInicial?: number
  faixaIdadeFinal?: number
  sexo?: 'MASCULINO' | 'FEMININO'
  pagina?: number
  porPagina?: number
  status?: 'DESAPARECIDO' | 'LOCALIZADO'
}

/**
 * Resposta de erro padronizada da API
 */
export interface ApiError {
  message: string
  status: number
  timestamp: string
  path: string
}

/**
 * Wrapper para respostas da API com metadata
 */
export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

/**
 * Estados padrão para requests
 */
export type RequestState = 'idle' | 'loading' | 'success' | 'error'
