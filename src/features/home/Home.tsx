import { useState, useCallback } from 'react'
import { useFilteredPessoas } from '@/hooks/useFilteredPessoas'
import { PersonCard } from '@/components/ui/PersonCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterChips } from '@/components/ui/FilterChips'
import { LoadingStates } from '@/components/ui/LoadingStates'
import { Pagination } from '@/components/ui/Pagination'
import type { FiltroParams } from '@/types/api'

export function Home() {
  const [filtros, setFiltros] = useState<Partial<FiltroParams>>({
    pagina: 0,
    porPagina: 10
  })

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

  // ✅ Handler para busca otimizado
  const handleSearch = useCallback((novosFiltros: Partial<FiltroParams>) => {
    setFiltros(prev => ({
      ...prev,
      ...novosFiltros,
      pagina: 0
    }))
  }, [])

  // ✅ Handler para remover filtro específico
  const handleRemoveFilter = useCallback((key: keyof FiltroParams) => {
    setFiltros(prev => {
      const newFiltros = { ...prev }
      if (key === 'faixaIdadeInicial') {
        delete newFiltros.faixaIdadeInicial
        delete newFiltros.faixaIdadeFinal
      } else {
        delete newFiltros[key]
      }
      return { ...newFiltros, pagina: 0 }
    })
  }, [])

  // ✅ Handler para limpar todos os filtros
  const handleClearAllFilters = useCallback(() => {
    setFiltros({
      nome: undefined,
      sexo: undefined,
      status: undefined,
      faixaIdadeInicial: undefined,
      faixaIdadeFinal: undefined,
      pagina: 0,
      porPagina: 10
    })
  }, [])

  const handlePageChange = useCallback((novaPagina: number) => {
    setFiltros(prev => ({ ...prev, pagina: novaPagina }))
    goToPage(novaPagina)
  }, [goToPage])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header da aplicação */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Pessoas Desaparecidas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use os filtros inteligentes para encontrar informações sobre pessoas desaparecidas em Mato Grosso
          </p>
        </div>

        {/* Barra de busca otimizada */}
        <div className="mb-8">
          <SearchBar
            onSearch={handleSearch}
            initialValues={filtros}
          />
        </div>

        {/* Chips de filtros ativos */}
        {hasActiveFilters && (
          <FilterChips
            filtros={filtros}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
            totalResults={filterStats.filtered}
            totalElements={filterStats.total}
          />
        )}

        {/* Estados de loading */}
        {isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600">Buscando pessoas...</span>
                </div>
              </div>
            </div>
            <LoadingStates.PersonCardSkeleton count={8} />
          </div>
        )}

        {/* Resultados */}
        {!isLoading && pessoas.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {pessoas.map(pessoa => (
                <PersonCard key={pessoa.id} pessoa={pessoa} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* Estado vazio */}
        {!isLoading && pessoas.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {hasActiveFilters ? 'Nenhuma pessoa encontrada' : 'Comece sua busca'}
              </h3>
              <p className="text-gray-600 mb-8">
                {hasActiveFilters
                  ? 'Tente ajustar os filtros de busca para encontrar mais resultados'
                  : 'Digite um nome ou use os filtros para encontrar pessoas'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAllFilters}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Limpar filtros e ver todos
                </button>
              )}
            </div>
          </div>
        )}

        {/* Estado de erro */}
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
      </div>
    </div>
  )
}
