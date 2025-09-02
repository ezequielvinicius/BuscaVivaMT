import type { FiltroParams } from '@/types/api'

// Lê URL -> filtros (undefined quando não existe)
export function readFiltersFromSearch(sp: URLSearchParams): FiltroParams {
  const getString = (key: string) => {
    const value = sp.get(key);
    return value && value.trim() ? value.trim() : undefined;
  };

  const getNumber = (key: string) => {
    const value = sp.get(key);
    if (!value || value.trim() === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  };

  return {
    nome: getString('nome'),
    status: getString('status') as any,
    sexo: getString('sexo') as any,
    faixaIdadeInicial: getNumber('faixaIdadeInicial'),
    faixaIdadeFinal: getNumber('faixaIdadeFinal'),
    pagina: getNumber('pagina') ?? 0,
    porPagina: getNumber('porPagina') ?? 10,
  }
}

// Escreve apenas chaves definidas
export function writeFiltersToSearch(filters: Partial<FiltroParams>): URLSearchParams {
  const s = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      s.set(key, String(value));
    }
  });

  // Garante que página e porPagina sempre existam
  if (!s.has('pagina')) {
    s.set('pagina', '0');
  }
  if (!s.has('porPagina')) {
    s.set('porPagina', '10');
  }

  return s;
}