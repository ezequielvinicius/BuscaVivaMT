import { X } from 'lucide-react'
import type { FiltroParams } from '@/types/api'

interface FilterChipsProps {
  filtros: Partial<FiltroParams>
  onRemoveFilter: (key: keyof FiltroParams) => void
  onClearAll: () => void
  totalResults?: number
  totalElements?: number
}

export function FilterChips({ 
  filtros, 
  onRemoveFilter, 
  onClearAll, 
  totalResults = 0, 
  totalElements = 0 
}: FilterChipsProps) {
  const activeFilters = []

  // Construir lista de filtros ativos
  if (filtros.nome) {
    activeFilters.push({
      key: 'nome' as keyof FiltroParams,
      label: `Nome: "${filtros.nome}"`,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    })
  }

  if (filtros.sexo && filtros.sexo !== 'Todos') {
    activeFilters.push({
      key: 'sexo' as keyof FiltroParams,
      label: `Sexo: ${filtros.sexo}`,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    })
  }

  if (filtros.status && filtros.status !== 'Todos') {
    const statusLabel = filtros.status === 'DESAPARECIDO' ? 'Desaparecidos' : 'Localizados'
    activeFilters.push({
      key: 'status' as keyof FiltroParams,
      label: `Status: ${statusLabel}`,
      color: 'bg-green-100 text-green-800 border-green-300'
    })
  }

  if (filtros.faixaIdadeInicial || filtros.faixaIdadeFinal) {
    const min = filtros.faixaIdadeInicial || 0
    const max = filtros.faixaIdadeFinal || 150
    activeFilters.push({
      key: 'faixaIdadeInicial' as keyof FiltroParams,
      label: `Idade: ${min}-${max} anos`,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    })
  }

  if (activeFilters.length === 0) return null

  const percentageFiltered = totalElements > 0 ? Math.round((totalResults / totalElements) * 100) : 100

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-6">
      {/* Contador de resultados */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-gray-900">
            <span className="text-2xl font-bold text-blue-600">{totalResults.toLocaleString()}</span>
            <span className="text-gray-600 ml-1">de {totalElements.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-2">pessoas encontradas</span>
          </div>
          
          {percentageFiltered < 100 && (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {percentageFiltered}% dos registros
            </div>
          )}
        </div>

        {/* Botão limpar todos */}
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
          Limpar todos
        </button>
      </div>

      {/* Chips de filtros */}
      <div className="flex flex-wrap gap-3">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          Filtros ativos:
        </span>
        {activeFilters.map((filter) => (
          <div
            key={filter.key}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border shadow-sm ${filter.color}`}
          >
            {filter.label}
            <button
              onClick={() => {
                if (filter.key === 'faixaIdadeInicial') {
                  onRemoveFilter('faixaIdadeInicial')
                  onRemoveFilter('faixaIdadeFinal')
                } else {
                  onRemoveFilter(filter.key)
                }
              }}
              className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
              aria-label={`Remover filtro ${filter.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
