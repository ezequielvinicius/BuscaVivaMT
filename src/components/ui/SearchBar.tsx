import { useState, useCallback, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebouncedValue';
import type { FiltroParams } from '@/types/api';

interface SearchBarProps {
  onSearch: (filtros: Partial<FiltroParams>) => void;
  initialValues?: Partial<FiltroParams>;
}

export function SearchBar({ onSearch, initialValues = {} }: SearchBarProps) {
  // Estados locais
  const [nome, setNome] = useState(initialValues.nome || '');
  const [sexo, setSexo] = useState<FiltroParams['sexo']>(initialValues.sexo);
  const [status, setStatus] = useState<FiltroParams['status']>(initialValues.status);
  const [idadeMin, setIdadeMin] = useState(initialValues.faixaIdadeInicial?.toString() || '');
  const [idadeMax, setIdadeMax] = useState(initialValues.faixaIdadeFinal?.toString() || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedNome = useDebounce(nome, 500);

  const buildCurrentFilters = useCallback((): Partial<FiltroParams> => ({
    nome: debouncedNome.trim() || undefined,
    sexo: sexo || undefined,
    status: status || undefined,
    faixaIdadeInicial: idadeMin ? Number(idadeMin) : undefined,
    faixaIdadeFinal: idadeMax ? Number(idadeMax) : undefined,
  }), [debouncedNome, sexo, status, idadeMin, idadeMax]);

  useEffect(() => {
    if (debouncedNome !== (initialValues.nome || '')) {
      onSearch(buildCurrentFilters());
    }
  }, [debouncedNome, initialValues.nome, buildCurrentFilters, onSearch]);

  const handleSexoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value as FiltroParams['sexo'];
    setSexo(valor);
    onSearch({ ...buildCurrentFilters(), sexo: valor });
  }, [buildCurrentFilters, onSearch]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value as FiltroParams['status'];
    setStatus(valor);
    onSearch({ ...buildCurrentFilters(), status: valor });
  }, [buildCurrentFilters, onSearch]);
  
  const handleIdadeChange = useCallback((type: 'min' | 'max', valor: string) => {
    const currentFilters = buildCurrentFilters();
    if (type === 'min') {
      setIdadeMin(valor);
      currentFilters.faixaIdadeInicial = valor ? Number(valor) : undefined;
    } else {
      setIdadeMax(valor);
      currentFilters.faixaIdadeFinal = valor ? Number(valor) : undefined;
    }
    onSearch(currentFilters);
  }, [buildCurrentFilters, onSearch]);

  const handleReset = useCallback(() => {
    setNome('');
    setSexo(undefined);
    setStatus(undefined);
    setIdadeMin('');
    setIdadeMax('');
    onSearch({});
  }, [onSearch]);

  const hasActiveFilters = nome || sexo || status || idadeMin || idadeMax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Buscar Pessoas</h2>
              <p className="text-blue-100 text-sm">Use os filtros para encontrar pessoas específicas</p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label htmlFor="search-nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Pessoa
            </label>
            <div className="relative">
              <input
                id="search-nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome para buscar..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="search-sexo" className="block text-sm font-medium text-gray-700 mb-2">
              Sexo
            </label>
            <select
              id="search-sexo"
              value={sexo || ''}
              onChange={handleSexoChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Todos</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="search-status"
              value={status || ''}
              onChange={handleStatusChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Todos</option>
              <option value="DESAPARECIDO">Desaparecidos</option>
              <option value="LOCALIZADO">Localizados</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            {showAdvanced ? 'Ocultar' : 'Mostrar'} filtros avançados
          </button>
        </div>

        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="idade-min" className="block text-sm font-medium text-gray-700 mb-2">
                  Idade Mínima
                </label>
                <input
                  id="idade-min"
                  type="number"
                  min="0"
                  max="150"
                  value={idadeMin}
                  onChange={(e) => handleIdadeChange('min', e.target.value)}
                  placeholder="Ex: 18"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="idade-max" className="block text-sm font-medium text-gray-700 mb-2">
                  Idade Máxima
                </label>
                <input
                  id="idade-max"
                  type="number"
                  min="0"
                  max="150"
                  value={idadeMax}
                  onChange={(e) => handleIdadeChange('max', e.target.value)}
                  placeholder="Ex: 65"
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* ✅ RESTAURADO: Dicas de uso */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-gray-400 mt-0.5">💡</div>
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Dicas de uso:</p>
              <ul className="space-y-1 text-xs">
                <li>• A busca por nome é automática após parar de digitar</li>
                <li>• Os filtros de sexo e status são aplicados imediatamente</li>
                <li>• Use filtros avançados para busca mais específica</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}