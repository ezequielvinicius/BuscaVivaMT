// src/hooks/useFilteredPessoas.ts - CÓDIGO ORIGINAL (SEM MUDANÇAS)
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listPessoas } from '@/service/personService'
import type { FiltroParams } from '@/types/api'
import type { PersonListItem, PaginatedResponse } from '@/types/person'

interface UseFilteredPessoasResult {
  data: PersonListItem[]
  totalPages: number
  currentPage: number
  isLoading: boolean
  isError: boolean
  error: any
  hasActiveFilters: boolean
  filterStats: {
    total: number
    filtered: number
    percentageFiltered: number
  }
  goToPage: (page: number) => void
  originalTotalElements: number
}

export function useFilteredPessoas(filtros: Partial<FiltroParams> = {}): UseFilteredPessoasResult {
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    console.log('🔄 Filtros mudaram, resetando página para 0')
    setCurrentPage(0)
  }, [JSON.stringify(filtros)])

  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery<PaginatedResponse<PersonListItem>, Error>({
    queryKey: ['pessoas', filtros, currentPage],
    queryFn: () => {
      console.log('🚀 Query executada:', { filtros, currentPage })
      return listPessoas({
        ...filtros,
        pagina: currentPage,
        porPagina: pageSize
      })
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    keepPreviousData: true
  })

  const goToPage = useCallback((page: number) => {
    console.log('📄 Mudando para página:', page)
    const totalPages = data?.totalPages ?? 0
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }, [data?.totalPages])

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filtros.nome || 
      (filtros.sexo && filtros.sexo !== 'Todos') || 
      (filtros.status && filtros.status !== 'Todos')
    )
  }, [filtros.nome, filtros.sexo, filtros.status])

  const filterStats = useMemo(() => {
    const total = data?.totalElements ?? 0
    const filtered = data?.numberOfElements ?? 0
    const percentageFiltered = total > 0 ? Math.round((filtered / total) * 100) : 100

    return {
      total,
      filtered,
      percentageFiltered
    }
  }, [data?.totalElements, data?.numberOfElements])

  return {
    data: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    currentPage,
    goToPage,
    isLoading,
    isError,
    error,
    hasActiveFilters,
    filterStats,
    originalTotalElements: data?.totalElements ?? 0
  }
}
