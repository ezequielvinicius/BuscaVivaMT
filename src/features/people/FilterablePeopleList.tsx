import { useState } from 'react'
import { SearchBar } from '@/components/ui/SearchBar'
import type { FiltroParams } from '@/types/api'

export function FilterablePeopleList() {
  const [filtros, setFiltros] = useState<Partial<FiltroParams>>({})
  const [filtroAberto, setFiltroAberto] = useState(true)

  const handleBusca = (novosFiltros: Partial<FiltroParams>) => {
    setFiltros(novosFiltros)
    // Não alterar filtroAberto para manter painel aberto
  }

  return (
    <div>
      <button onClick={() => setFiltroAberto(!filtroAberto)}>
        {filtroAberto ? 'Fechar filtros' : 'Abrir filtros'}
      </button>

      {filtroAberto && (
        <SearchBar onSearch={handleBusca} initialValues={filtros} />
      )}

      {/* Renderizar a lista usando os filtros */}
      {/* <PeopleList filtros={filtros} /> */}
    </div>
  )
}
