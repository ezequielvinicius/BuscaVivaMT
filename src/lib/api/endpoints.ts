export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/login',
    REFRESH: '/v1/refresh-token',
  },
  OCORRENCIAS: {
    INFO_LIST: '/v1/ocorrencias/informacoes-desaparecido',   // GET ?ocorrenciaId=
    INFO_CREATE: '/v1/ocorrencias/informacoes-desaparecido', // POST (query + multipart)
    MOTIVOS: '/v1/ocorrencias/motivos',
    DD_VERIFICAR: '/v1/ocorrencias/delegacia-digital/verificar-duplicidade',
    DD_CRIAR: '/v1/ocorrencias/delegacia-digital',
  },
  PESSOAS: {
    DETALHE: (id: string | number) => `/v1/pessoas/${id}`,
    ABERTO_FILTRO: '/v1/pessoas/aberto/filtro',
    ABERTO_ESTATISTICO: '/v1/pessoas/aberto/estatistico',
    ABERTO_DINAMICO: '/v1/pessoas/aberto/dinamico',
  },
} as const;
