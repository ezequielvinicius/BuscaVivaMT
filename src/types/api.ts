export interface FiltroParams {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: Sexo;
  pagina?: number;
  porPagina?: number;
  status?: StatusPessoa;
}