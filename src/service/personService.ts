import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { FiltroParams, PagePessoaDTO, PessoaDTO as RawPessoaFromApi } from '@/types/api';

/**
 * Busca a lista paginada de pessoas da API.
 * RETORNA DADOS CRUS (RAW), SEM TRANSFORMAÇÃO.
 */
export async function listPessoas(filtros: Partial<FiltroParams> = {}): Promise<PagePessoaDTO> {
  try {
    const cleanFilters = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => 
        value !== undefined && value !== null && value !== '' && value !== 'Todos'
      )
    );
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, {
      params: cleanFilters
    });
    return data;
  } catch (error) {
    console.error('❌ Erro ao listar pessoas:', error);
    throw error;
  }
}

/**
 * Busca os detalhes de uma única pessoa pelo ID.
 * RETORNA DADOS CRUS (RAW), SEM TRANSFORMAÇÃO.
 */
export async function getPessoaDetalhes(id: string | number): Promise<RawPessoaFromApi> {
  try {
    const numericId = Number(id);
    if (!id || isNaN(numericId) || numericId <= 0) {
      throw new Error('ID de pessoa inválido');
    }
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.DETALHE(numericId));
    return data;
  } catch (error) {
    console.error(`❌ Erro ao buscar detalhes da pessoa com ID ${id}:`, error);
    throw error;
  }
}

/**
 * Busca pessoas em destaque para a home page.
 * RETORNA DADOS CRUS (RAW), SEM TRANSFORMAÇÃO.
 */
export async function getPessoasDestaque(quantidade: number = 4): Promise<RawPessoaFromApi[]> {
  try {
    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
      params: { registros: quantidade }
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ Erro ao buscar destaque:', error);
    return [];
  }
}