import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listTodasPessoas } from '@/service/personService' // ✅ Correto
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
  // Remove status/paginação do servidor; vamos filtrar e paginar no front
  const backendFilters = useMemo(() => {
    const { status, pagina, porPagina, ...rest } = filters
    return { ...rest }
  }, [filters])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pessoas-all', backendFilters],
    queryFn: () => listTodasPessoas(backendFilters), // ✅ CORRIGIDO AQUI
    staleTime: 2 * 60 * 1000,
  })

  const filteredResult = useMemo(() => {
    const originalList = data?.content ?? []

    // Mapeia para o formato PersonListItem
    const mappedList: PersonListItem[] = originalList.map((pessoa: any) => ({
      id: pessoa.id,
      nome: pessoa.nome,
      idade: pessoa.idade,
      sexo: pessoa.sexo,
      status: pessoa.vivo === false ? 'LOCALIZADO' : 'DESAPARECIDO',
      fotoPrincipal: pessoa.urlFoto,
      cidade: pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || '',
      dataDesaparecimento: pessoa.ultimaOcorrencia?.dtDesaparecimento,
    }))

    let filteredList = [...mappedList]

    // Filtro de status (feito no front para contornar a API)
    if (filters.status) {
      filteredList = filteredList.filter(p => p.status === filters.status)
    }
    if (filters.sexo) {
      filteredList = filteredList.filter(p => p.sexo === filters.sexo)
    }
    if (filters.faixaIdadeInicial !== undefined) {
      filteredList = filteredList.filter(p => (p.idade ?? 0) >= filters.faixaIdadeInicial!)
    }
    if (filters.faixaIdadeFinal !== undefined) {
      filteredList = filteredList.filter(p => (p.idade ?? 0) <= filters.faixaIdadeFinal!)
    }
    if (filters.nome?.trim()) {
      const q = filters.nome.trim().toLowerCase()
      filteredList = filteredList.filter(p => p.nome.toLowerCase().includes(q))
    }

    // Paginação manual
    const itemsPerPage = filters.porPagina ?? 10
    const currentPage = filters.pagina ?? 0
    const totalFiltered = filteredList.length
    const totalPages = Math.ceil(totalFiltered / itemsPerPage)

    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    const paginatedList = filteredList.slice(start, end)

    // Estatísticas
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
      originalTotalElements: mappedList.length,
    }
  }, [data, filters])

  return {
    ...filteredResult,
    isLoading,
    isError,
    error,
  }
}
