import { useState, useCallback, useEffect } from 'react'
import type { FiltroParams } from '@/types/api'

interface SearchBarProps {
  onSearch: (filtros: Partial<FiltroParams>) => void
  initialValues?: Partial<FiltroParams>
}

export function SearchBar({ onSearch, initialValues = {} }: SearchBarProps) {
  // ✅ CORREÇÃO: Estado local para cada campo individualmente
  const [nome, setNome] = useState(initialValues.nome || '')
  const [sexo, setSexo] = useState(initialValues.sexo || '')
  const [status, setStatus] = useState(initialValues.status || '')

  // ✅ CORREÇÃO: useCallback para evitar re-criações da função
  const handleNomeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setNome(valor)
    
    // Aplica filtro imediatamente
    onSearch({
      nome: valor,
      sexo: sexo || undefined,
      status: status || undefined
    })
  }, [onSearch, sexo, status])

  const handleSexoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value === '' ? undefined : e.target.value
    setSexo(valor || '')
    
    onSearch({
      nome: nome || undefined,
      sexo: valor,
      status: status || undefined
    })
  }, [onSearch, nome, status])

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = e.target.value === '' ? undefined : e.target.value
    setStatus(valor || '')
    
    onSearch({
      nome: nome || undefined,
      sexo: sexo || undefined,
      status: valor
    })
  }, [onSearch, nome, sexo])

  // ✅ CORREÇÃO: Sincroniza com initialValues quando mudam externamente
  useEffect(() => {
    if (initialValues.nome !== undefined) setNome(initialValues.nome || '')
    if (initialValues.sexo !== undefined) setSexo(initialValues.sexo || '')
    if (initialValues.status !== undefined) setStatus(initialValues.status || '')
  }, [initialValues])

  const handleReset = useCallback(() => {
    setNome('')
    setSexo('')
    setStatus('')
    
    onSearch({
      nome: undefined,
      sexo: undefined,
      status: undefined
    })
  }, [onSearch])

  const campoClasses = "w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-police-500 focus:border-police-500 transition-colors"

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        
        {/* ✅ CORREÇÃO: Input controlado com estado estável */}
        <div>
          <label htmlFor="filtro-nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da pessoa
          </label>
          <input
            type="text"
            id="filtro-nome"
            placeholder="Digite o nome..."
            value={nome}
            onChange={handleNomeChange}
            className={`${campoClasses} placeholder-gray-400`}
            autoComplete="off"
          />
        </div>

        {/* Campo Sexo */}
        <div>
          <label htmlFor="filtro-sexo" className="block text-sm font-medium text-gray-700 mb-1">
            Sexo
          </label>
          <select
            id="filtro-sexo"
            value={sexo}
            onChange={handleSexoChange}
            className={campoClasses}
          >
            <option value="">Todos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>

        {/* Campo Status */}
        <div>
          <label htmlFor="filtro-status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="filtro-status"
            value={status}
            onChange={handleStatusChange}
            className={campoClasses}
          >
            <option value="">Todos</option>
            <option value="DESAPARECIDO">Desaparecidos</option>
            <option value="LOCALIZADO">Localizados</option>
          </select>
        </div>

        {/* Botão Limpar */}
        <div>
          <button
            type="button"
            onClick={handleReset}
            className={`${campoClasses} text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200`}
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Informações de ajuda */}
      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Digite pelo menos 3 caracteres para buscar por nome</p>
      </div>
    </div>
  )
}
