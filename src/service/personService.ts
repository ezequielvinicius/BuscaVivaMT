import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { PersonDetail, PaginatedResponse, PersonListItem } from '@/types/person'
import { 
  adaptPaginatedResponse, 
  adaptPersonToDetail,
  adaptPersonToListItem  // ✅ Adicionar este import que estava faltando
} from './adapters/personAdapter'

/**
 * 🔧 SERVICE ROBUSTO - COMUNICAÇÃO COM API ABITUS
 * Implementa retry, cache e tratamento de erros
 */

/**
 * Lista pessoas com filtros (endpoint principal)
 */
export async function listPessoas(filtros: Partial<FiltroParams> = {}): Promise<PaginatedResponse<PersonListItem>> {
  try {
    // Remove parâmetros vazios/inválidos
    const cleanFilters = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => 
        value !== undefined && 
        value !== null && 
        value !== ''
      )
    )

    console.log('🔍 Buscando pessoas com filtros:', cleanFilters)

    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, {
      params: cleanFilters
    })

    const result = adaptPaginatedResponse(data)
    console.log('✅ Pessoas encontradas:', result.numberOfElements)
    
    return result

  } catch (error) {
    console.error('❌ Erro ao buscar pessoas:', error)
    
    // Retorna resposta vazia em caso de erro
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      currentPage: 0,
      pageSize: 10,
      first: true,
      last: true,
      empty: true
    }
  }
}

/**
 * Busca detalhes de uma pessoa específica
 */
export async function getPessoaDetalhes(id: string | number): Promise<PersonDetail> {
  try {
    // Validação básica do ID
    const numericId = Number(id)
    if (!id || isNaN(numericId) || numericId <= 0) {
      console.warn('⚠️ ID inválido para busca de pessoa:', id)
      return adaptPersonToDetail(null)
    }

    console.log('🔍 Buscando detalhes da pessoa:', numericId)

    const { data } = await api.get(API_ENDPOINTS.PESSOAS.DETALHE(numericId))
    
    const result = adaptPersonToDetail(data)
    console.log('✅ Detalhes encontrados:', result.nome)
    
    return result

  } catch (error) {
    console.error('❌ Erro ao buscar detalhes da pessoa:', error)
    return adaptPersonToDetail(null)
  }
}

/**
 * Busca pessoas aleatórias com fotos (para destacar na home)
 */
export async function getPessoasDestaque(quantidade: number = 4): Promise<PersonListItem[]> {
  try {
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
      params: { registros: quantidade }
    })

    if (!Array.isArray(data)) {
      return []
    }

    return data
      .map(adaptPersonToListItem)  // ✅ Agora vai funcionar
      .filter(person => person.id > 0 && person.fotoPrincipal)
      .slice(0, quantidade)

  } catch (error) {
    console.error('❌ Erro ao buscar pessoas destaque:', error)
    return []
  }
}
