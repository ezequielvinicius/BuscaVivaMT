import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { listPessoas } from '@/service/personService';
import { adaptPaginatedResponse } from '@/service/adapters/personAdapter';
import type { FiltroParams, PagePessoaDTO } from '@/types/api';
import type { PaginatedResponse, PersonListItem } from '@/types/person';

export function usePessoas(params: FiltroParams) {
  // Limpa os parâmetros para garantir que a queryKey seja consistente
  const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      (acc as any)[key] = value;
    }
    return acc;
  }, {} as Record<string, any>) as FiltroParams;

  // Aplicado o mesmo padrão do useFilteredPessoas
  return useQuery<PagePessoaDTO, Error, PaginatedResponse<PersonListItem>>({
    queryKey: ['pessoas', cleanParams],
    queryFn: () => listPessoas(cleanParams),

    // O adapter transforma os dados crus da API para o formato do frontend
    select: adaptPaginatedResponse,

    staleTime: 2 * 60 * 1000,

    placeholderData: keepPreviousData,

    retry: 3,
    retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
  });
}