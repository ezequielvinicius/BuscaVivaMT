import { useQuery } from '@tanstack/react-query';
import { getPessoaDetalhes } from '@/service/personService';
import { adaptPersonToDetail } from '@/service/adapters/personAdapter';
import type { PersonDetail } from '@/types/person';
import type { PessoaDTO as RawPessoaFromApi } from '@/types/api';

export function usePessoa(id: string | number) {
  return useQuery<RawPessoaFromApi, Error, PersonDetail>({ // Define os 3 tipos: Dado da API, Erro, Dado Selecionado/Final
    queryKey: ['pessoa', id],
    queryFn: () => getPessoaDetalhes(id),
    select: adaptPersonToDetail, // O adapter transforma os dados crus para o formato PersonDetail
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}