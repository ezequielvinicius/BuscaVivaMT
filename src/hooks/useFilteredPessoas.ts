import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listPessoas } from '@/service/personService'
import type { FiltroParams } from '@/types/api'


export function useFilteredPessoas(filtros: Partial<FiltroParams>) {
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['pessoas', filtros],
    queryFn: () => listPessoas(filtros),  // ✅ Nome correto
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2
  })

  const totalPages = data?.totalPages ?? 0
  const totalFiltered = data?.numberOfElements ?? 0
  const originalTotalElements = data?.totalElements ?? 0

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filtros.nome || 
      filtros.sexo || 
      filtros.status || 
      filtros.faixaIdadeInicial || 
      filtros.faixaIdadeFinal
    )
  }, [filtros])

  const filterStats = useMemo(() => {
    const percentageFiltered = originalTotalElements > 0 
      ? Math.round((totalFiltered / originalTotalElements) * 100)
      : 100

    return {
      total: originalTotalElements,
      filtered: totalFiltered,
      percentageFiltered
    }
  }, [totalFiltered, originalTotalElements])

  return {
    data: data?.content ?? [],
    totalPages,
    isLoading,
    isError,
    error,
    hasActiveFilters,
    filterStats,
    originalTotalElements
  }
}
