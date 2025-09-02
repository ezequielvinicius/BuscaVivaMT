import { useMemo } from 'react'
import { usePessoas } from './usePessoas'
import type { FiltroParams } from '@/types/api'
import type { PersonListItem } from '@/types/person'

interface FilteredResult {
  data: PersonListItem[]
  totalFiltered: number
  totalPages: number
  isLoading: boolean
  isError: boolean
  error: any
  hasActiveFilters: boolean
  filterStats: {
    total: number
    filtered: number
    percentageFiltered: number
  }
  originalTotalElements: number
}

export function useFilteredPessoas(filters: FiltroParams): FilteredResult {
  // Para contornar as "pegadinhas", vamos buscar TODOS os dados do backend
  // e aplicar os filtros problemáticos no frontend
  const backendFilters = useMemo(() => {
    // Remove apenas o filtro de STATUS (principal pegadinha)
    // e remove paginação para buscar todos os resultados
    const { status, pagina, porPagina, ...rest } = filters
    
    // Usa paginação grande para pegar mais resultados
    return {
      ...rest,
      pagina: 0,
      porPagina: 1000 // Busca uma quantidade maior
    }
  }, [filters])

  const { data, isLoading, isError, error } = usePessoas(backendFilters)

  const filteredResult = useMemo(() => {
    // Mapeia a resposta da API para o formato correto
    const originalList = data?.content ?? []
    
    // Converte para o formato PersonListItem correto
    const mappedList = originalList.map((pessoa: any) => ({
      id: pessoa.id,
      nome: pessoa.nome,
      idade: pessoa.idade,
      sexo: pessoa.sexo,
      status: pessoa.vivo === false ? 'LOCALIZADO' : 'DESAPARECIDO', // Mapeia vivo -> status
      fotoPrincipal: pessoa.urlFoto,
      cidade: pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || '',
      dataDesaparecimento: pessoa.ultimaOcorrencia?.dtDesaparecimento
    }))
    
    let filteredList = [...mappedList]
    
    // ===== FILTROS FRONTEND (para contornar pegadinhas da API) =====
    
    // Filtro de status (principal pegadinha da API)
    if (filters.status) {
      filteredList = filteredList.filter(pessoa => {
        if (filters.status === 'DESAPARECIDO') {
          return pessoa.status === 'DESAPARECIDO'
        } else if (filters.status === 'LOCALIZADO') {
          return pessoa.status === 'LOCALIZADO'
        }
        return true
      })
    }

    // ===== PAGINAÇÃO MANUAL =====
    const itemsPerPage = filters.porPagina ?? 10
    const currentPage = filters.pagina ?? 0
    const totalFiltered = filteredList.length
    const totalPages = Math.ceil(totalFiltered / itemsPerPage)
    
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    const paginatedList = filteredList.slice(start, end)

    // ===== ESTATÍSTICAS =====
    const hasActiveFilters = Boolean(
      filters.status || 
      filters.sexo || 
      filters.faixaIdadeInicial !== undefined || 
      filters.faixaIdadeFinal !== undefined ||
      filters.nome?.trim()
    )

    const filterStats = {
      total: mappedList.length,
      filtered: totalFiltered,
      percentageFiltered: mappedList.length > 0 
        ? Math.round((totalFiltered / mappedList.length) * 100)
        : 0
    }

    return {
      data: paginatedList,
      totalFiltered,
      totalPages,
      hasActiveFilters,
      filterStats,
      originalTotalElements: data?.totalElements ?? mappedList.length
    }
  }, [data, filters])

  return {
    ...filteredResult,
    isLoading,
    isError,
    error
  }
}