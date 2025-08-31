export type Sexo = 'MASCULINO' | 'FEMININO';
export type StatusPessoa = 'DESAPARECIDO' | 'LOCALIZADO';

export interface PersonListItem {
  id: number;
  nome: string;
  status: StatusPessoa;
  fotoPrincipal?: string;
  idade?: number;
  cidade?: string;
  dataDesaparecimento?: string; // ISO
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  last: boolean;
  first: boolean;
  empty: boolean;
}
