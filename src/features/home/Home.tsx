import { useState } from 'react'
import { useFilteredPessoas } from '@/hooks/useFilteredPessoas'
import { PersonCard } from '@/components/ui/PersonCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { LoadingStates } from '@/components/ui/LoadingStates'
import { Pagination } from '@/components/ui/Pagination'
import type { FiltroParams } from '@/types/api'

export function Home() {
  const [filtros, setFiltros] = useState<Partial<FiltroParams>>({
    pagina: 0,
    porPagina: 10
  })

  const [painelFiltroAberto, setPainelFiltroAberto] = useState(true)

  const {
    data: pessoas,
    totalPages,
    isLoading,
    isDebouncing,
    isError,
    hasActiveFilters,
    filterStats
  } = useFilteredPessoas(filtros)

  if (isLoading || isDebouncing) {
    return <LoadingStates.PersonCardSkeleton count={8} />
  }

  const handleSearch = (novosFiltros: Partial<FiltroParams>) => {
    setFiltros(prev => ({
      ...prev,
      ...novosFiltros,
      pagina: 0
    }))
  }

  const handlePageChange = (novaPagina: number) => {
    setFiltros(prev => ({ ...prev, pagina: novaPagina }))
  }

  if (isLoading) {
    return <LoadingStates.PersonCardSkeleton count={8} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Pessoas Desaparecidas</h2>
          <button
            onClick={() => setPainelFiltroAberto(!painelFiltroAberto)}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {painelFiltroAberto ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>


        {painelFiltroAberto && (
          <div className="mb-8">
            <SearchBar
              key="search-bar-stable"
              onSearch={handleSearch}
              initialValues={filtros}
            />
          </div>
        )}

        {hasActiveFilters && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Mostrando <strong>{filterStats.filtered}</strong> de <strong>{filterStats.total}</strong> pessoas
              {filterStats.percentageFiltered < 100 && (
                <span className="ml-2 text-blue-600">
                  ({filterStats.percentageFiltered}% dos registros)
                </span>
              )}
            </p>
          </div>
        )}

        {pessoas.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {pessoas.map(pessoa => (
                <PersonCard key={pessoa.id} pessoa={pessoa} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={filtros.pagina || 0}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.2-5.2m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? 'Nenhuma pessoa encontrada' : 'Carregando pessoas...'}
              </h3>
              <p className="text-gray-500">
                {hasActiveFilters
                  ? 'Tente ajustar os filtros de busca'
                  : 'Os dados estão sendo carregados'
                }
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar dados</h3>
                <p className="text-red-600 text-sm">
                  Não foi possível conectar com o servidor.
                  <br />
                  Verifique sua conexão e tente novamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
