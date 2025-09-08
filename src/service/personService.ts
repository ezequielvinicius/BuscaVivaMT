// src/service/personService.ts - VOLTANDO AO CÓDIGO SIMPLES
import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { PersonDetail, PaginatedResponse, PersonListItem } from '@/types/person'
import { 
  adaptPaginatedResponse, 
  adaptPersonToDetail,
  adaptPersonToListItem
} from './adapters/personAdapter'

export async function listPessoas(filtros: Partial<FiltroParams> = {}): Promise<PaginatedResponse<PersonListItem>> {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => 
        value !== undefined && value !== null && value !== '' && value !== 'Todos'
      )
    )

    console.log('📤 Filtros enviados:', cleanFilters)

    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, {
      params: cleanFilters
    })

    const result = adaptPaginatedResponse(data)
    
    // ✅ FILTRO CLIENT-SIDE simples para corrigir inconsistências
    if (filtros.status && filtros.status !== 'Todos') {
      const pessoasFiltradas = result.content.filter(pessoa => {
        return pessoa.status === filtros.status
      })
      
      console.log(`🔧 Filtro client-side ${filtros.status}: ${result.content.length} → ${pessoasFiltradas.length}`)
      
      return {
        ...result,
        content: pessoasFiltradas,
        numberOfElements: pessoasFiltradas.length,
        empty: pessoasFiltradas.length === 0
      }
    }
    
    return result

  } catch (error) {
    console.error('❌ Erro:', error)
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

export async function getPessoaDetalhes(id: string | number): Promise<PersonDetail> {
  try {
    const numericId = Number(id)
    if (!id || isNaN(numericId) || numericId <= 0) {
      return adaptPersonToDetail(null)
    }

    const { data } = await api.get(API_ENDPOINTS.PESSOAS.DETALHE(numericId))
    return adaptPersonToDetail(data)

  } catch (error) {
    console.error('❌ Erro ao buscar detalhes:', error)
    return adaptPersonToDetail(null)
  }
}

export async function getPessoasDestaque(quantidade: number = 4): Promise<PersonListItem[]> {
  try {
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
      params: { registros: quantidade }
    })

    if (!Array.isArray(data)) return []

    return data
      .map(pessoa => adaptPersonToListItem(pessoa))
      .filter(person => person.id > 0 && person.fotoPrincipal)
      .slice(0, quantidade)

  } catch (error) {
    console.error('❌ Erro ao buscar destaque:', error)
    return []
  }
}
