import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { PessoaDTO, PersonListItem, PersonDetail, PaginatedResponse } from '@/types/person'
import { adaptPersonToListItem, adaptPersonToDetail } from './adapters/personAdapter'

/**
 * Lista pessoas com filtros aplicados
 * @param params Parâmetros de filtro
 * @returns Promise com lista paginada normalizada
 */
export async function listPessoas(params: FiltroParams): Promise<PaginatedResponse<PersonListItem>> {
  try {
    const cleanParams = sanitizeParams(params)
    const { data } = await api.get<PaginatedResponse<PessoaDTO>>(
      API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, 
      { params: cleanParams }
    )

    return {
      ...data,
      content: (data.content || []).map(adaptPersonToListItem)
    }
  } catch (error) {
    console.error('Erro ao listar pessoas:', error)
    return createEmptyPaginatedResponse()
  }
}

/**
 * Busca todas as pessoas (concatena páginas)
 * @param params Parâmetros de filtro
 * @returns Promise com todas as pessoas normalizadas
 */
export async function listTodasPessoas(params: FiltroParams): Promise<PaginatedResponse<PersonListItem>> {
  try {
    const allPeople: PersonListItem[] = []
    let currentPage = 0
    const pageSize = 200
    let hasMore = true

    while (hasMore) {
      const response = await listPessoas({
        ...params,
        pagina: currentPage,
        porPagina: pageSize
      })

      allPeople.push(...response.content)
      hasMore = !response.last && response.content.length === pageSize
      currentPage++

      // Safety break para evitar loops infinitos
      if (currentPage > 50) break
    }

    return {
      content: allPeople,
      totalElements: allPeople.length,
      totalPages: 1,
      numberOfElements: allPeople.length,
      size: allPeople.length,
      number: 0,
      first: true,
      last: true,
      empty: allPeople.length === 0,
      pageable: {
        pageNumber: 0,
        pageSize: allPeople.length,
        offset: 0,
        paged: true,
        unpaged: false
      }
    }
  } catch (error) {
    console.error('Erro ao buscar todas as pessoas:', error)
    return createEmptyPaginatedResponse()
  }
}

/**
 * Busca detalhes de uma pessoa
 * @param id ID da pessoa
 * @returns Promise com pessoa detalhada normalizada
 */
export async function getPessoaDetalhes(id: string | number): Promise<PersonDetail> {
  try {
    if (!id) throw new Error('ID é obrigatório')

    const { data } = await api.get<PessoaDTO>(API_ENDPOINTS.PESSOAS.DETALHE(id))
    return adaptPersonToDetail(data)
  } catch (error) {
    console.error(`Erro ao buscar pessoa ${id}:`, error)
    return adaptPersonToDetail(null)
  }
}

/**
 * Busca estatísticas gerais
 */
export async function getEstatisticas(): Promise<{ desaparecidas: number; localizadas: number }> {
  try {
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_ESTATISTICO)
    return {
      desaparecidas: Number(data.quantPessoasDesaparecidas) || 0,
      localizadas: Number(data.quantPessoasEncontradas) || 0
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return { desaparecidas: 0, localizadas: 0 }
  }
}

/**
 * Busca pessoas aleatórias com foto
 */
export async function getPessoasDinamicas(quantidade = 4): Promise<PersonListItem[]> {
  try {
    const { data } = await api.get<PessoaDTO[]>(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
      params: { registros: quantidade }
    })
    
    return (Array.isArray(data) ? data : []).map(adaptPersonToListItem)
  } catch (error) {
    console.error('Erro ao buscar pessoas dinâmicas:', error)
    return []
  }
}

// Utilitários internos
function sanitizeParams(params: FiltroParams): Record<string, any> {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, any>)
}

function createEmptyPaginatedResponse<T>(): PaginatedResponse<T> {
  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    numberOfElements: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    empty: true,
    pageable: {
      pageNumber: 0,
      pageSize: 0,
      offset: 0,
      paged: false,
      unpaged: true
    }
  }
}
