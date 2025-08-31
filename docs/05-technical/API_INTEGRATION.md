# Integração com a API — BuscaVivaMT

Este documento descreve **como o frontend (React + TS)** se integra à API oficial `https://abitus-api.geia.vip`, incluindo cliente Axios, endpoints, serviços (pessoas e ocorrências), hooks do React Query, tratamento de erros e exemplos de uso.

> **Resumo crítico**
> - Upload de fotos do reporte: **`multipart/form-data`** com campo `files[]` (body)  
> - Quatro campos obrigatórios do reporte (**query**): `informacao`, `descricao`, `data (yyyy-MM-dd)`, `ocoId`  
> - Endpoints públicos (sem token): `/v1/pessoas/aberto/*`  
> - Endpoints protegidos (com token): `/v1/ocorrencias/*`

---

## 1) Variáveis de ambiente (`.env`)

```env
VITE_API_BASE_URL=https://abitus-api.geia.vip
VITE_API_TIMEOUT=30000
```

- **VITE_API_BASE_URL**: base da API  
- **VITE_API_TIMEOUT**: timeout em ms (ex.: 30s)

---

## 2) Cliente Axios com interceptors
`src/services/api/client.ts`

```ts
import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://abitus-api.geia.vip';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

function getAccessToken(): string | null {
  // implemente conforme sua estratégia (ex.: Zustand/Context/Storage seguro)
  return null;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authorization condicional
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratamento centralizado de erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Aqui você pode inspecionar status e disparar refresh-token se necessário
    // if (error.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);
```

---

## 3) Mapa de endpoints
`src/services/api/endpoints.ts`

```ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/v1/login',
    REFRESH: '/v1/refresh-token'
  },
  OCORRENCIAS: {
    INFO_LIST: '/v1/ocorrencias/informacoes-desaparecido',       // GET ?ocorrenciaId=
    INFO_CREATE: '/v1/ocorrencias/informacoes-desaparecido',     // POST (query + multipart)
    MOTIVOS: '/v1/ocorrencias/motivos',
    DD_VERIFICAR: '/v1/ocorrencias/delegacia-digital/verificar-duplicidade',
    DD_CRIAR: '/v1/ocorrencias/delegacia-digital'
  },
  PESSOAS: {
    DETALHE: (id: number | string) => `/v1/pessoas/${id}`,
    ABERTO_FILTRO: '/v1/pessoas/aberto/filtro',
    ABERTO_ESTATISTICO: '/v1/pessoas/aberto/estatistico',
    ABERTO_DINAMICO: '/v1/pessoas/aberto/dinamico'
  }
} as const;
```

---

## 4) Serviços de Pessoas
`src/services/personService.ts`

```ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export type Sexo = 'MASCULINO' | 'FEMININO';
export type StatusPessoa = 'DESAPARECIDO' | 'LOCALIZADO';

export interface FiltroParams {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: Sexo;
  pagina?: number;     // 0-based
  porPagina?: number;  // ex.: 10
  status?: StatusPessoa;
}

export async function getPessoaById(id: number | string) {
  const { data } = await apiClient.get(API_ENDPOINTS.PESSOAS.DETALHE(id));
  return data; // tipar conforme seu modelo Person
}

export async function listPessoas(params: FiltroParams) {
  const { data } = await apiClient.get(API_ENDPOINTS.PESSOAS.ABERTO_FILTRO, { params });
  return data; // retorno paginado da API
}

export async function getPessoasEstatistico() {
  const { data } = await apiClient.get(API_ENDPOINTS.PESSOAS.ABERTO_ESTATISTICO);
  return data;
}

export async function getPessoasDinamico(registros = 4) {
  const { data } = await apiClient.get(API_ENDPOINTS.PESSOAS.ABERTO_DINAMICO, {
    params: { registros }
  });
  return data;
}
```

---

## 5) Serviços de Ocorrências

### 5.1 Listar informações/anexos da ocorrência
`src/services/occurrenceService.ts`
```ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export async function listInfoOcorrencia(ocorrenciaId: number) {
  const { data } = await apiClient.get(API_ENDPOINTS.OCORRENCIAS.INFO_LIST, {
    params: { ocorrenciaId }
  });
  return data;
}
```

### 5.2 Enviar informação + fotos (multipart + query)
```ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';

export interface CreateInfoParams {
  informacao: string;     // query
  descricao: string;      // query
  data: string;           // query -> yyyy-MM-dd
  ocoId: number;          // query
  files: File[];          // body -> multipart: files[]
}

export async function createInfoOcorrencia(p: CreateInfoParams) {
  const fd = new FormData();
  (p.files ?? []).forEach((f) => fd.append('files', f)); // nome do campo: "files"

  const { data } = await apiClient.post(
    API_ENDPOINTS.OCORRENCIAS.INFO_CREATE,
    fd,
    {
      params: {
        informacao: p.informacao,
        descricao: p.descricao,
        data: p.data,
        ocoId: p.ocoId
      },
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return data;
}
```

### 5.3 Motivos, verificação e criação (Delegacia Digital) — (opcional/fora do escopo do desafio)
```ts
export async function getMotivos() {
  const { data } = await apiClient.get(API_ENDPOINTS.OCORRENCIAS.MOTIVOS);
  return data;
}

export async function verificarDuplicidade(payload: Record<string, unknown>) {
  const { data } = await apiClient.post(API_ENDPOINTS.OCORRENCIAS.DD_VERIFICAR, payload);
  return data;
}

export async function criarOcorrenciaDigital(payload: Record<string, unknown>) {
  const { data } = await apiClient.post(API_ENDPOINTS.OCORRENCIAS.DD_CRIAR, payload);
  return data;
}
```

---

## 6) Hooks do React Query

### `src/hooks/usePersons.ts`
```ts
import { useQuery } from '@tanstack/react-query';
import { getPessoaById, listPessoas, FiltroParams, getPessoasEstatistico, getPessoasDinamico } from '@/services/personService';

export function usePessoa(id: number | string) {
  return useQuery({
    queryKey: ['pessoa', id],
    queryFn: () => getPessoaById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000
  });
}

export function usePessoas(params: FiltroParams) {
  return useQuery({
    queryKey: ['pessoas', params],
    queryFn: () => listPessoas(params),
    staleTime: 5 * 60 * 1000
  });
}

export function usePessoasEstatistico() {
  return useQuery({
    queryKey: ['pessoas-estatistico'],
    queryFn: getPessoasEstatistico,
    staleTime: 5 * 60 * 1000
  });
}

export function usePessoasDinamico(registros = 4) {
  return useQuery({
    queryKey: ['pessoas-dinamico', registros],
    queryFn: () => getPessoasDinamico(registros),
    staleTime: 5 * 60 * 1000
  });
}
```

### `src/hooks/useOccurrence.ts`
```ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { createInfoOcorrencia, listInfoOcorrencia, CreateInfoParams } from '@/services/occurrenceService';
import toast from 'react-hot-toast';

export function useListInfoOcorrencia(ocorrenciaId: number) {
  return useQuery({
    queryKey: ['occurrence-info', ocorrenciaId],
    queryFn: () => listInfoOcorrencia(ocorrenciaId),
    enabled: !!ocorrenciaId
  });
}

export function useCreateInfoOcorrencia() {
  return useMutation({
    mutationFn: (payload: CreateInfoParams) => createInfoOcorrencia(payload),
    onSuccess: () => toast.success('Informação enviada com sucesso!'),
    onError: () => toast.error('Não foi possível enviar. Tente novamente.')
  });
}
```

---

## 7) Validações de upload (front)
- Tipos permitidos: image/jpeg, image/png, image/webp  
- Tamanho máximo: 5MB por arquivo  
- Quantidade: até 3 fotos  

Exemplo com **Zod**:

```ts
import { z } from 'zod';

export const reportSchema = z.object({
  informacao: z.string().min(10, 'Descreva o avistamento com mais detalhes'),
  descricao: z.string().min(3, 'Informe um título/descrição do anexo'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato yyyy-MM-dd'),
  ocoId: z.coerce.number().int().positive(),
  files: z.array(z.custom<File>()).max(3)
    .refine(arr => arr.every(f => ['image/jpeg','image/png','image/webp'].includes(f.type)),
      'Apenas JPG, PNG ou WebP')
    .refine(arr => arr.every(f => f.size <= 5 * 1024 * 1024),
      'Cada foto deve ter no máximo 5MB')
});
export type ReportFormData = z.infer<typeof reportSchema>;
```

---

## 8) Exemplos de uso na UI

### 8.1 Enviar reporte com fotos
```ts
import { useCreateInfoOcorrencia } from '@/hooks/useOccurrence';

function ReportForm() {
  const { mutate: send, isLoading } = useCreateInfoOcorrencia();
  // capture valores via RHF
  const onSubmit = (values: { informacao: string; descricao: string; data: string; ocoId: number; files: File[] }) => {
    send(values);
  };
  // ...
}
```

### 8.2 Listar pessoas paginado (10 por página)
```ts
import { usePessoas } from '@/hooks/usePersons';

function Home() {
  const { data, isLoading } = usePessoas({ pagina: 0, porPagina: 10, status: 'DESAPARECIDO' });
  // renderize grid + paginação com base em data.content / data.totalPages
}
```

---

## 9) Tratamento de erros (UX)
- **Falha de rede/timeouts**: mensagem “Sem conexão com o servidor”  
- **4xx (validação)**: mostrar feedback por campo (telefone/data/arquivos)  
- **5xx**: mensagem genérica e opção “Tentar novamente”  
- **Persistência do formulário**: manter os dados preenchidos ao falhar
