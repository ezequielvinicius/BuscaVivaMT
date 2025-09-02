import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { PaginatedResponse, PersonListItem } from '@/types/person'

export async function listPessoas(params: FiltroParams): Promise<PaginatedResponse<PersonListItem>> {
  try {
    // Remove apenas valores realmente vazios, mantém 0 como válido
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    console.log('Fazendo requisição com params:', cleanParams);

    const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, { 
      params: cleanParams 
    });
    
    console.log('Resposta da API:', data);
    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}
