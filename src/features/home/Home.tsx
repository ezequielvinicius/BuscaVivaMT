import { useState, useCallback } from 'react'
import { X, Info } from 'lucide-react'
import { useFilteredPessoas } from '@/hooks/useFilteredPessoas'
import { PersonCard } from '@/components/ui/PersonCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { LoadingStates } from '@/components/ui/LoadingStates'
import { Pagination } from '@/components/ui/Pagination'
import type { FiltroParams } from '@/types/api'
import type { PersonListItem } from '@/types/person'

export function Home() {
  const [filtros, setFiltros] = useState<Partial<FiltroParams>>({})

  const {
    data: pessoas,
    totalPages,
    currentPage,
    isLoading,
    isError,
    hasActiveFilters,
    filterStats,
    goToPage
  } = useFilteredPessoas(filtros)

  const handleSearch = useCallback((novosFiltros: Partial<FiltroParams>) => {
    setFiltros(prev => ({ ...prev, ...novosFiltros }))
  }, [])

  const handleRemoveFilter = useCallback((key: keyof FiltroParams) => {
    setFiltros(prev => {
      const newFiltros = { ...prev };
      if (key === 'faixaIdadeInicial') {
        delete newFiltros.faixaIdadeInicial;
        delete newFiltros.faixaIdadeFinal;
      } else {
        delete newFiltros[key];
      }
      return newFiltros;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFiltros({})
  }, [])

  const handlePageChange = useCallback((novaPagina: number) => {
    goToPage(novaPagina)
  }, [goToPage])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="text-center mb-8">
          <h1 onClick={handleClearAllFilters} className="text-4xl font-bold text-gray-900 mb-4 cursor-pointer hover:text-blue-700 transition-colors duration-200" title="Voltar à tela inicial e limpar filtros">
            Sistema de Pessoas Desaparecidas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use os filtros inteligentes para encontrar informações sobre pessoas desaparecidas em Mato Grosso
          </p>
        </div>
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} initialValues={filtros} />
        </div>
        {hasActiveFilters && <FilterChips filtros={filtros} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} totalResults={filterStats.filtered} totalElements={filterStats.total} />}

        {/* --- ESTADOS DA APLICAÇÃO --- */}

        {isLoading && <LoadingStates.PersonCardSkeleton count={8} />}

        {isError && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-4">Erro na conexão</h3>
              <p className="text-red-600 mb-6">
                Não foi possível carregar os dados. Verifique sua conexão com a internet.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {pessoas.length > 0 ? (
              <>
                {!hasActiveFilters && filterStats.total > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Total de <strong>{filterStats.total}</strong> registros encontrados.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {pessoas.map((pessoa: PersonListItem) => (
                    <PersonCard key={pessoa.id} pessoa={pessoa} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                {/* ... (código para "Nenhum resultado") ... */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}