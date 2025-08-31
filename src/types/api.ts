import { Sexo, StatusPessoa } from './person';

export interface FiltroParams {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: Sexo;
  pagina?: number;     // 0-based
  porPagina?: number;  // ex.: 10
  status?: StatusPessoa;
}
