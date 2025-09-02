import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useFilteredPessoas } from '@/hooks/useFilteredPessoas'
import { PersonCard } from '@/components/ui/PersonCard'
import { Pagination } from '@/components/ui/Pagination'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterPanel } from './FilterPanel'
import { readFiltersFromSearch, writeFiltersToSearch } from './urlFilters'
import type { StatusPessoa, Sexo } from '@/types/person'

export default function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo(() => readFiltersFromSearch(searchParams), [searchParams])

  // Estados locais para inputs controlados
  const [nome, setNome] = useState(filters.nome ?? '')
  const [status, setStatus] = useState(filters.status)
  const [sexo, setSexo] = useState(filters.sexo)
  const [faixaIdadeInicial, setFaixaIdadeInicial] = useState<number | undefined>(filters.faixaIdadeInicial)
  const [faixaIdadeFinal, setFaixaIdadeFinal] = useState<number | undefined>(filters.faixaIdadeFinal)

  // Sincroniza estados com URL
  useEffect(() => {
    setNome(filters.nome ?? '')
    setStatus(filters.status)
    setSexo(filters.sexo)
    setFaixaIdadeInicial(filters.faixaIdadeInicial)
    setFaixaIdadeFinal(filters.faixaIdadeFinal)
  }, [filters])

  // ===== HOOK PERSONALIZADO COM FILTROS INTELIGENTES =====
  const { 
    data: pessoas, 
    totalFiltered, 
    totalPages, 
    isLoading, 
    isError, 
    error,
    hasActiveFilters,
    filterStats,
    originalTotalElements
  } = useFilteredPessoas(filters)

  // ===== HANDLERS =====
  const updateUrl = useCallback((next: Partial<{
    nome: string | undefined
    status: StatusPessoa | undefined
    sexo: Sexo | undefined
    faixaIdadeInicial: number | undefined
    faixaIdadeFinal: number | undefined
    pagina: number | undefined
    porPagina: number | undefined
  }>, resetPage = true) => {
    const merged = {
      nome: filters.nome,
      status: filters.status,
      sexo: filters.sexo,
      faixaIdadeInicial: filters.faixaIdadeInicial,
      faixaIdadeFinal: filters.faixaIdadeFinal,
      pagina: filters.pagina ?? 0,
      porPagina: filters.porPagina ?? 10,
      ...next,
    }

    if (resetPage && !('pagina' in next)) {
      merged.pagina = 0
    }

    setSearchParams(writeFiltersToSearch(merged))
  }, [filters, setSearchParams])

  const onSearchChange = useCallback((value: string) => {
    setNome(value)
    updateUrl({ nome: value.trim() || undefined })
  }, [updateUrl])

  const onFilterChange = useCallback((next: {
    status?: StatusPessoa
    sexo?: Sexo
    faixaIdadeInicial?: number
    faixaIdadeFinal?: number
  }) => {
    if ('status' in next) setStatus(next.status)
    if ('sexo' in next) setSexo(next.sexo)
    if ('faixaIdadeInicial' in next) setFaixaIdadeInicial(next.faixaIdadeInicial)
    if ('faixaIdadeFinal' in next) setFaixaIdadeFinal(next.faixaIdadeFinal)
    
    updateUrl(next)
  }, [updateUrl])

  const onPageChange = useCallback((p: number) => {
    updateUrl({ pagina: p }, false)
  }, [updateUrl])

  const clearFilters = useCallback(() => {
    setNome('')
    setStatus(undefined)
    setSexo(undefined)
    setFaixaIdadeInicial(undefined)
    setFaixaIdadeFinal(undefined)
    setSearchParams(writeFiltersToSearch({ pagina: 0, porPagina: 10 }))
  }, [setSearchParams])

  // ===== RENDER =====
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold">Pessoas Desaparecidas</h1>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <SearchBar initialValue={nome} onChange={onSearchChange} />
          <FilterPanel
            status={status}
            sexo={sexo}
            faixaIdadeInicial={faixaIdadeInicial}
            faixaIdadeFinal={faixaIdadeFinal}
            onChange={onFilterChange}
          />
          <button
            type="button"
            onClick={clearFilters}
            className="h-10 px-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={!hasActiveFilters}
            aria-label="Limpar todos os filtros"
          >
            Limpar filtros
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <p>
              {totalFiltered} de {originalTotalElements} resultados
              {hasActiveFilters && (
                <span className="text-xs text-blue-600 ml-1">
                  ({filterStats.percentageFiltered}% filtrados)
                </span>
              )}
            </p>
            
            {/* Badges dos Filtros Ativos */}
            <div className="flex gap-2">
              {status && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {status === 'DESAPARECIDO' ? 'Desaparecidas' : 'Localizadas'}
                </span>
              )}
              {sexo && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
                </span>
              )}
              {(faixaIdadeInicial !== undefined || faixaIdadeFinal !== undefined) && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Idade: {faixaIdadeInicial ?? '0'}-{faixaIdadeFinal ?? '∞'}
                </span>
              )}
            </div>
          </div>
          
          <p>Exibindo {filters.porPagina ?? 10} por página</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 space-y-2">
          <p className="font-semibold">⚠️ Falha ao carregar dados</p>
          <p className="text-sm">Não foi possível conectar com o servidor. Tente novamente em alguns instantes.</p>
          <details className="text-xs text-red-700/80">
            <summary className="cursor-pointer">Ver detalhes técnicos</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">
              {JSON.stringify((error as any)?.response?.data ?? (error as any)?.message ?? error, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && pessoas.length === 0 && (
        <div className="p-8 bg-gray-50 text-gray-700 rounded-lg border text-center">
          {hasActiveFilters ? (
            <>
              <p className="text-lg font-medium">🔍 Nenhum resultado encontrado</p>
              <p className="text-sm mt-2 text-gray-600">
                Nenhuma pessoa corresponde aos filtros aplicados. 
                Tente ajustar os critérios de busca.
              </p>
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Limpar todos os filtros
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">📋 Nenhuma pessoa cadastrada</p>
              <p className="text-sm mt-2 text-gray-600">
                Não há registros de pessoas desaparecidas no momento.
              </p>
            </>
          )}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && !isError && pessoas.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pessoas.map((pessoa) => (
              <div 
                key={pessoa.id} 
                onClick={() => navigate(`/pessoa/${pessoa.id}`)}
                className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
              >
                <PersonCard p={pessoa} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Pagination
                page={filters.pagina ?? 0}
                totalPages={totalPages}
                onChange={onPageChange}
              />
              <p className="text-sm text-gray-500">
                {((filters.pagina ?? 0) * (filters.porPagina ?? 10)) + 1}-{Math.min(((filters.pagina ?? 0) + 1) * (filters.porPagina ?? 10), totalFiltered)} 
                de {totalFiltered}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}