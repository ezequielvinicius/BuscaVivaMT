import type { PessoaDTO } from '@/types/api'
import type { PersonListItem, PersonDetail, PersonStatus, PaginatedResponse } from '@/types/person'

/**
 * 🛡️ ADAPTER DEFENSIVO - CONVERTE API → FRONTEND
 * Protege contra mudanças na API e dados inconsistentes
 */

/**
 * Determina o status real baseado nos dados da API
 * ⚠️ LÓGICA CRÍTICA: Interpreta corretamente vivo/morto vs desaparecido/localizado
 */
function determinePersonStatus(pessoa: PessoaDTO): PersonStatus {
  // ✅ LÓGICA CORRETA: Baseada nos dados reais da API
  
  // Se encontradoVivo = true, pessoa foi localizada VIVA
  if (pessoa.ultimaOcorrencia?.encontradoVivo === true) {
    return "LOCALIZADO"
  }
  
  // Se vivo = false, pessoa foi localizada MORTA
  if (pessoa.vivo === false) {
    return "LOCALIZADO"
  }
  
  // Se vivo = true e encontradoVivo != true, ainda está DESAPARECIDA
  return "DESAPARECIDO"
}


/**
 * Converte PessoaDTO → PersonListItem (para cards na listagem)
 */
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
    }
  }

  return {
    id: pessoa.id ?? 0,
    nome: (pessoa.nome || '').trim() || 'Nome não informado',
    idade: pessoa.idade,
    sexo: ['MASCULINO', 'FEMININO'].includes(pessoa.sexo) ? pessoa.sexo : 'MASCULINO',
    status: determinePersonStatus(pessoa),
    fotoPrincipal: pessoa.urlFoto || '',
    cidade: pessoa.ultimaOcorrencia?.localDesaparecimentoConcat || '',
    dataDesaparecimento: pessoa.ultimaOcorrencia?.dtDesaparecimento || ''
  }
}

/**
 * Converte PessoaDTO → PersonDetail (para página de detalhes)
 */
export function adaptPersonToDetail(pessoa: PessoaDTO | null): PersonDetail {
  const baseItem = adaptPersonToListItem(pessoa)
  
  if (!pessoa) {
    return {
      ...baseItem,
      ocoId: undefined,
      localDesaparecimento: '',
      informacaoBreve: '',
      vestimentas: '',
      cartazes: []
    }
  }

  const ocorrencia = pessoa.ultimaOcorrencia

  return {
    ...baseItem,
    ocoId: ocorrencia?.ocoId,
    localDesaparecimento: ocorrencia?.localDesaparecimentoConcat || '',
    dataLocalizacao: ocorrencia?.dataLocalizacao,
    encontradoVivo: ocorrencia?.encontradoVivo,
    informacaoBreve: ocorrencia?.ocorrenciaEntrevDesapDTO?.informacao || '',
    vestimentas: ocorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido || '',
    cartazes: (ocorrencia?.listaCartaz || [])
      .filter(cartaz => cartaz && cartaz.urlCartaz) // Remove inválidos
      .map(cartaz => ({
        urlCartaz: cartaz.urlCartaz,
        tipoCartaz: cartaz.tipoCartaz || 'Cartaz'
      }))
  }
}

/**
 * Remove entradas duplicadas baseado no ID
 */
export function removeDuplicatedPersons<T extends { id: number }>(persons: T[]): T[] {
  const seen = new Set<number>()
  return persons.filter(person => {
    if (seen.has(person.id)) return false
    seen.add(person.id)
    return true
  })
}

/**
 * Converte PagePessoaDTO → PaginatedResponse<PersonListItem>
 */
export function adaptPaginatedResponse(apiResponse: any): PaginatedResponse<PersonListItem> {
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
    }
  }

  const pessoas = (Array.isArray(apiResponse.content) ? apiResponse.content : [])
    .map(adaptPersonToListItem)
    .filter((person: PersonListItem) => person.id > 0) // ✅ TIPAGEM EXPLÍCITA ADICIONADA

  return {
    content: removeDuplicatedPersons(pessoas),
    totalPages: apiResponse.totalPages ?? 0,
    totalElements: apiResponse.totalElements ?? 0,
    numberOfElements: apiResponse.numberOfElements ?? 0,
    currentPage: apiResponse.number ?? 0,
    pageSize: apiResponse.size ?? 0,
    first: apiResponse.first ?? true,
    last: apiResponse.last ?? true,
    empty: pessoas.length === 0
  }
}
