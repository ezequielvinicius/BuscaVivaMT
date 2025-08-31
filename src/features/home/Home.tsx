import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePessoas } from '@/hooks/usePersons'
import { PersonCard } from '@/components/ui/PersonCard'
import { Pagination } from '@/components/ui/Pagination'

export default function Home() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const perPage = 10

  const { data, isLoading, isError, error } = usePessoas({
    pagina: page,
    porPagina: perPage
    // status: 'DESAPARECIDO' // deixe comentado por enquanto
  })

  const totalPages = data?.totalPages ?? 0
  const list = data?.content ?? []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pessoas Desaparecidas</h1>
        <p className="text-sm text-gray-600">Exibindo {perPage} por página</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 space-y-2">
          <p className="font-semibold">Falha ao carregar.</p>
          {/* @ts-expect-error para simplificar o print */}
          <pre className="text-xs text-red-700/80 whitespace-pre-wrap">
{JSON.stringify((error as any)?.response?.data ?? (error as any)?.message ?? error, null, 2)}
          </pre>
          <a href="/login" className="inline-block text-blue-700 underline">Fazer login</a>
        </div>
      )}

      {!isLoading && !isError && list.length === 0 && (
        <div className="p-6 bg-gray-50 text-gray-700 rounded-lg border">
          Nenhuma pessoa encontrada.
        </div>
      )}

      {!isLoading && !isError && list.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => (
              <PersonCard key={p.id} p={p} onClick={() => navigate(`/pessoa/${p.id}`)} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
