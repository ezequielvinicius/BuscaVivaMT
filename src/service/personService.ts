import { api } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type { FiltroParams } from '@/types/api'
import type { APIPersonResponse, PaginatedResponse, PersonListItem } from '@/types/person'

/** LISTA (uma página — usa paginação do backend) */
export async function listPessoas(params: FiltroParams): Promise<PaginatedResponse<any>> {
  const cleanParams = Object.entries(params).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null && v !== '') acc[k] = v
    return acc
  }, {} as Record<string, any>)

  const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, { params: cleanParams })
  return data
}

/** LISTA (TODAS as páginas — concatena tudo para filtrar no front) */
export async function listPessoasAll(params: FiltroParams): Promise<PaginatedResponse<any>> {
  // o backend limita porPagina a ~200, então varremos as páginas
  const base = { ...params, pagina: 0, porPagina: 200 }
  const first = await api
    .get<PaginatedResponse<any>>(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, { params: base })
    .then(r => r.data)

  const pages = first.totalPages ?? 1
  if (pages <= 1) return first

  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      api
        .get<PaginatedResponse<any>>(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, {
          params: { ...base, pagina: i + 1 },
        })
        .then(r => r.data.content)
    )
  )

  const content = first.content.concat(...rest)

  // devolvemos um "paginado" com tudo em uma única página
  return {
    ...first,
    content,
    numberOfElements: content.length,
    size: content.length,
    totalPages: 1,
    number: 0,
    first: true,
    last: true,
    empty: content.length === 0,
  }
}

/** DETALHE */
export async function getPessoa(id: string | number): Promise<{
  pessoa: PersonListItem & {
    cartazes?: { urlCartaz?: string; tipoCartaz?: string }[]
    ocoId?: number
    informacaoBreve?: string
    localDesaparecimento?: string
    dataLocalizacao?: string
    encontradoVivo?: boolean
    vestimentas?: string
  }
}> {
  const { data } = await api.get<APIPersonResponse>(API_ENDPOINTS.PESSOAS.DETALHE(id))
  const status = data.vivo === false ? 'LOCALIZADO' : 'DESAPARECIDO'

  const pessoa = {
    id: data.id,
    nome: data.nome,
    idade: data.idade,
    sexo: data.sexo,
    status,
    fotoPrincipal: data.urlFoto,
    cidade: data.ultimaOcorrencia?.localDesaparecimentoConcat || '',
    dataDesaparecimento: data.ultimaOcorrencia?.dtDesaparecimento,
    cartazes: data.ultimaOcorrencia?.listaCartaz,
    ocoId: data.ultimaOcorrencia?.ocoId,
    informacaoBreve: data.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao,
    localDesaparecimento: data.ultimaOcorrencia?.localDesaparecimentoConcat,
    dataLocalizacao: data.ultimaOcorrencia?.dataLocalizacao,
    encontradoVivo: data.ultimaOcorrencia?.encontradoVivo ?? undefined,
    vestimentas: data.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido
  } as const

  return { pessoa }
}

/** ESTATÍSTICAS */
export async function getEstatisticas(): Promise<{
  quantPessoasDesaparecidas: number
  quantPessoasEncontradas: number
}> {
  const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_ESTATISTICO)
  return data
}

/** PESSOAS DINÂMICAS (com fotos, randômicas) */
export async function getPessoasDinamicas(registros = 4): Promise<APIPersonResponse[]> {
  const { data } = await api.get(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
    params: { registros }
  })
  return data
}