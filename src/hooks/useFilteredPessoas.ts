import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listPessoas } from '@/service/personService';
import { adaptPaginatedResponse } from '@/service/adapters/personAdapter';
import type { FiltroParams } from '@/types/api';
import type { PersonListItem } from '@/types/person';

interface UseFilteredPessoasResult {
  data: PersonListItem[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  error: any;
  hasActiveFilters: boolean;
  filterStats: {
    total: number;
    filtered: number;
    percentageFiltered: number;
  };
  goToPage: (page: number) => void;
  originalTotalElements: number;
}

export function useFilteredPessoas(filtros: Partial<FiltroParams> = {}): UseFilteredPessoasResult {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(0);
  }, [JSON.stringify(filtros)]);

  const {
    data: dadosLimpos,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pessoas', filtros, currentPage],
    queryFn: () => listPessoas({
      ...filtros,
      pagina: currentPage,
      porPagina: pageSize,
    }),
    select: adaptPaginatedResponse,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    placeholderData: keepPreviousData,
  });

  const dadosFinais = useMemo(() => {
    const dadosParaFiltrar = dadosLimpos?.content || [];
    if (!filtros.status || filtros.status === 'Todos') {
      return dadosParaFiltrar;
    }
    return dadosParaFiltrar.filter(pessoa => pessoa.status === filtros.status);
  }, [dadosLimpos?.content, filtros.status]);

  const goToPage = useCallback((page: number) => {
    const totalPages = dadosLimpos?.totalPages ?? 0;
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [dadosLimpos?.totalPages]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filtros.nome ||
      (filtros.sexo && filtros.sexo !== 'Todos') ||
      (filtros.status && filtros.status !== 'Todos')
    );
  }, [filtros.nome, filtros.sexo, filtros.status]);

  const filterStats = useMemo(() => {
    const total = dadosLimpos?.totalElements ?? 0;
    const filtered = dadosFinais.length;
    const percentageFiltered = total > 0 ? Math.round((filtered / total) * 100) : 100;
    return { total, filtered, percentageFiltered };
  }, [dadosLimpos?.totalElements, dadosFinais]);

  return {
    data: dadosFinais,
    totalPages: dadosLimpos?.totalPages ?? 0,
    currentPage,
    goToPage,
    isLoading,
    isError,
    error,
    hasActiveFilters,
    filterStats,
    originalTotalElements: dadosLimpos?.totalElements ?? 0,
  };
}