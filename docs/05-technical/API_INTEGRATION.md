# Integração com API - BuscaVivaMT

Este documento detalha a integração do frontend BuscaVivaMT com a API de pessoas desaparecidas.

## 1. Configuração Base

### 1.1 Cliente Axios

```typescript
// src/services/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://abitus-api.geia.vip';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error('Dados inválidos. Verifique as informações.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 500:
          toast.error('Erro no servidor. Tente novamente mais tarde.');
          break;
        default:
          toast.error('Ocorreu um erro. Tente novamente.');
      }
    } else if (error.request) {
      toast.error('Sem conexão com o servidor.');
    } else {
      toast.error('Erro ao processar requisição.');
    }
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient().getInstance();
```

### 1.2 Endpoints

```typescript
// src/services/api/endpoints.ts

export const API_ENDPOINTS = {
  PERSONS: {
    LIST: '/pessoas',
    DETAIL: (id: string) => `/pessoas/${id}`,
    SEARCH: '/pessoas/search',
    FILTER: '/pessoas/filter',
  },
  REPORTS: {
    CREATE: '/avistamentos',
    STATUS: (id: string) => `/avistamentos/${id}`,
    LIST_BY_PERSON: (personId: string) => `/avistamentos/pessoa/${personId}`,
  },
  STATISTICS: {
    GENERAL: '/estatisticas',
    BY_CITY: (city: string) => `/estatisticas/cidade/${city}`,
    BY_STATE: (state: string) => `/estatisticas/estado/${state}`,
  },
  UTILS: {
    CITIES: '/cidades',
    STATES: '/estados',
    UPLOAD: '/upload/foto',
  },
} as const;
```

---

## 2. Serviços

### 2.1 Serviço de Pessoas

```typescript
// src/services/personService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { Person, PaginatedResponse, SearchParams } from '@/types';
import { apiToPerson } from '@/utils/transformers';

export const personService = {
  async list(params: SearchParams): Promise<PaginatedResponse<Person>> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.LIST, { params });
    return {
      ...response.data,
      content: response.data.content.map(apiToPerson),
    };
  },
  async getById(id: string): Promise<Person> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.DETAIL(id));
    return apiToPerson(response.data);
  },
  async search(query: string, params?: SearchParams): Promise<PaginatedResponse<Person>> {
    const response = await apiClient.get(API_ENDPOINTS.PERSONS.SEARCH, {
      params: { q: query, ...params },
    });
    return {
      ...response.data,
      content: response.data.content.map(apiToPerson),
    };
  },
  async filter(filters: SearchParams): Promise<PaginatedResponse<Person>> {
    const response = await apiClient.post(API_ENDPOINTS.PERSONS.FILTER, filters);
    return {
      ...response.data,
      content: response.data.content.map(apiToPerson),
    };
  },
};
```

### 2.2 Serviço de Reports/Avistamentos

```typescript
// src/services/reportService.ts
import { apiClient } from '@/services/api/client';
import { API_ENDPOINTS } from '@/services/api/endpoints';
import type { ReportInput, ReportResponse } from '@/types';

export const reportService = {
  async create(data: ReportInput): Promise<ReportResponse> {
    let photoUrls: string[] = [];
    if (data.fotos && data.fotos.length > 0) {
      photoUrls = await this.uploadPhotos(data.fotos);
    }
    const payload = { ...data, fotos: photoUrls };
    const response = await apiClient.post(API_ENDPOINTS.REPORTS.CREATE, payload);
    return response.data;
  },
  async uploadPhotos(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post(API_ENDPOINTS.UTILS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    });
    return Promise.all(uploadPromises);
  },
  async getStatus(id: string): Promise<ReportResponse> {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.STATUS(id));
    return response.data;
  },
  async listByPerson(personId: string) {
    const response = await apiClient.get(API_ENDPOINTS.REPORTS.LIST_BY_PERSON(personId));
    return response.data;
  },
};
```

---

## 3. React Query Hooks

### 3.1 Hook para Pessoas

```typescript
// src/hooks/usePersons.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { personService } from '@/services/personService';
import type { SearchParams } from '@/types';

export const usePersons = (params: SearchParams) => useQuery({
  queryKey: ['persons', params],
  queryFn: () => personService.list(params),
  staleTime: 5 * 60 * 1000,
});

export const usePersonById = (id: string) => useQuery({
  queryKey: ['person', id],
  queryFn: () => personService.getById(id),
  enabled: !!id,
  staleTime: 10 * 60 * 1000,
});

export const useInfinitePersons = (params: SearchParams) => useInfiniteQuery({
  queryKey: ['persons-infinite', params],
  queryFn: ({ pageParam = 0 }) => personService.list({ ...params, page: pageParam }),
  getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.number + 1,
  staleTime: 5 * 60 * 1000,
});
```

### 3.2 Hook para Reports

```typescript
// src/hooks/useReports.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { reportService } from '@/services/reportService';
import type { ReportInput } from '@/types';

export const useCreateReport = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: ReportInput) => reportService.create(data),
    onSuccess: (response) => {
      toast.success('Avistamento reportado com sucesso!');
      navigate(`/protocolo/${response.protocolo}`);
    },
    onError: () => {
      toast.error('Erro ao enviar avistamento. Tente novamente.');
    },
  });
};

export const useReportStatus = (id: string) => useQuery({
  queryKey: ['report-status', id],
  queryFn: () => reportService.getStatus(id),
  enabled: !!id,
  refetchInterval: 30000,
});
```

---

## 4. Tratamento de Erros

### 4.1 Error Boundary Global

```typescript
// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
            <p className="text-gray-600 mb-4">Erro inesperado. Recarregue a página.</p>
            <button onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

## 5. Otimizações

### 5.1 Debounce para Busca

```typescript
// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Uso
const SearchBar = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data } = usePersons({ nome: debouncedSearch });
};
```

### 5.2 Cache e Prefetch

```typescript
// src/hooks/usePrefetch.ts
import { useQueryClient } from '@tanstack/react-query';
import { personService } from '@/services/personService';

export const usePrefetchPerson = () => {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['person', id],
      queryFn: () => personService.getById(id),
      staleTime: 10 * 60 * 1000,
    });
  };
};
```
