import type { PagePessoaDTO, PessoaDTO } from '@/types/api';
import type { PersonListItem, PersonDetail, PersonStatus, PaginatedResponse } from '@/types/person';

function corrigirStatusVisual(pessoa: PessoaDTO): PersonStatus {
  if (pessoa.ultimaOcorrencia?.dataLocalizacao) {
    return 'LOCALIZADO';
  }
  return 'DESAPARECIDO';
}

export function adaptPersonToListItem(pessoa: PessoaDTO | null): PersonListItem {
  if (!pessoa) {
    return {
      id: 0,
      nome: 'Dados não disponíveis',
      sexo: 'MASCULINO',
      status: 'DESAPARECIDO',
      fotoPrincipal: '',
      cidade: '',
      dataDesaparecimento: ''
    };
  }

  return {
    id: pessoa.id ?? 0,
    nome: (pessoa.nome || '').trim() || 'Nome não informado',
    idade: pessoa.idade,
    sexo: ['MASCULINO', 'FEMININO'].includes(pessoa.sexo) ? pessoa.sexo : 'MASCULINO',
    status: corrigirStatusVisual(pessoa),
    fotoPrincipal: pessoa.urlFoto || '',
    cidade: pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || '',
    dataDesaparecimento: pessoa.ultimaOcorrencia?.dtDesaparecimento || ''
  };
}

export function adaptPersonToDetail(pessoa: PessoaDTO | null): PersonDetail {
  const baseItem = adaptPersonToListItem(pessoa);
  
  if (!pessoa) {
    return {
      ...baseItem,
      ocoId: undefined,
      localDesaparecimento: '',
      informacaoBreve: '',
      vestimentas: '',
      cartazes: []
    };
  }

  const ocorrencia = pessoa.ultimaOcorrencia;

  return {
    ...baseItem,
    ocoId: ocorrencia?.ocoId,
    localDesaparecimento: ocorrencia?.localDesaparecimentoConcat || '',
    dataLocalizacao: ocorrencia?.dataLocalizacao,
    encontradoVivo: ocorrencia?.encontradoVivo,
    informacaoBreve: ocorrencia?.ocorrenciaEntrevDesapDTO?.informacao || '',
    vestimentas: ocorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido || '',
    cartazes: (ocorrencia?.listaCartaz || [])
      .filter(cartaz => cartaz && cartaz.urlCartaz)
      .map(cartaz => ({
        urlCartaz: cartaz.urlCartaz,
        tipoCartaz: cartaz.tipoCartaz || 'Cartaz'
      }))
  };
}

export function removeDuplicatedPersons<T extends { id: number }>(persons: T[]): T[] {
  const seen = new Set<number>();
  return persons.filter(person => {
    if (seen.has(person.id)) return false;
    seen.add(person.id);
    return true;
  });
}

// A função aceita o tipo específico 'PagePessoaDTO'
export function adaptPaginatedResponse(apiResponse: PagePessoaDTO | null | undefined): PaginatedResponse<PersonListItem> {
  if (!apiResponse || typeof apiResponse !== 'object') {
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      currentPage: 0,
      pageSize: 0,
      first: true,
      last: true,
      empty: true
    };
  }

  // TypeScript sabe que 'apiResponse.content' é um array de 'PessoaDTO',
  // então 'pessoa' é corretamente tipado como 'PessoaDTO' no map.
  const pessoas = (Array.isArray(apiResponse.content) ? apiResponse.content : [])
    .map(pessoa => adaptPersonToListItem(pessoa))
    .filter((person: PersonListItem) => person.id > 0);

  return {
    content: removeDuplicatedPersons(pessoas),
    totalPages: apiResponse.totalPages ?? 0,
    totalElements: apiResponse.totalElements ?? 0,
    numberOfElements: pessoas.length,
    currentPage: apiResponse.number ?? 0,
    pageSize: apiResponse.size ?? 0,
    first: apiResponse.first ?? true,
    last: apiResponse.last ?? true,
    empty: pessoas.length === 0
  };
}