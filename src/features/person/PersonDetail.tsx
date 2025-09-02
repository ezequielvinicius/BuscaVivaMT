import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StatusPill } from '@/components/ui/StatusPill'
import { usePessoa } from '@/hooks/usePessoa'
import { useInformacoesOcorrencia } from '@/hooks/useInformacoesOcorrencia'
import { ReportForm } from '@/features/person/ReportForm'

export default function PersonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = usePessoa(id)
  const p = data?.pessoa
  const { list: infos } = useInformacoesOcorrencia(p?.ocoId)
  const [openForm, setOpenForm] = useState(false)

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse" />
          <div className="md:col-span-2 space-y-3">
            <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !p) {
    return (
      <div className="p-6">
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 space-y-2">
          <p className="font-semibold">⚠️ Falha ao carregar detalhes</p>
          <details className="text-xs text-red-700/80">
            <summary className="cursor-pointer">Ver detalhes técnicos</summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs">
              {JSON.stringify((error as any)?.response?.data ?? (error as any)?.message ?? error, null, 2)}
            </pre>
          </details>
          <button onClick={() => navigate(-1)} className="text-sm underline mt-2">Voltar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-700 hover:underline" aria-label="Voltar">
            ← Voltar
          </button>
          <h1 className="text-2xl font-semibold mt-1">{p.nome}</h1>
          <p className="text-sm text-gray-600">
            {p.sexo === 'MASCULINO' ? 'Masculino' : 'Feminino'}
            {p.idade !== undefined && ` • ${p.idade} anos`}
            {p.cidade && ` • ${p.cidade}`}
          </p>
        </div>
        <StatusPill status={p.status} />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foto principal */}
        <div className="md:col-span-1">
          <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
            {p.fotoPrincipal ? (
              <img
                src={p.fotoPrincipal}
                alt={`Foto de ${p.nome}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg' }}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-gray-400">Sem foto</div>
            )}
          </div>
          {p.dataDesaparecimento && (
            <p className="text-xs text-gray-500 mt-2">
              Desaparecida(o) desde {new Date(p.dataDesaparecimento).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Coluna de informações */}
        <div className="md:col-span-2 space-y-4">
          {/* Seção: Desaparecimento */}
          <div className="p-4 bg-white border rounded-xl">
            <h2 className="font-semibold mb-2">Dados do desaparecimento</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              {p.localDesaparecimento && <li>📍 Local: {p.localDesaparecimento}</li>}
              {p.dataDesaparecimento && <li>🗓️ Data: {new Date(p.dataDesaparecimento).toLocaleDateString('pt-BR')}</li>}
            </ul>
          </div>

          {/* Seção: Observações */}
          {(p.informacaoBreve || p.vestimentas) && (
            <div className="p-4 bg-white border rounded-xl">
              <h2 className="font-semibold mb-2">Observações</h2>
              {p.informacaoBreve && <p className="text-sm text-gray-800"><strong>Última informação: </strong>{p.informacaoBreve}</p>}
              {p.vestimentas && <p className="text-sm text-gray-800 mt-1"><strong>Vestimentas: </strong>{p.vestimentas}</p>}
            </div>
          )}

          {/* Seção: Cartazes */}
          {p.cartazes && p.cartazes.length > 0 && (
            <div className="p-4 bg-white border rounded-xl">
              <h2 className="font-semibold mb-2">Cartazes</h2>
              <div className="flex flex-wrap gap-3">
                {p.cartazes.map((c, i) => (
                  <a key={i} href={c.urlCartaz} target="_blank" rel="noreferrer" className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                    {c.tipoCartaz ?? 'Cartaz'} #{i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Seção: Informações compartilhadas */}
          {typeof p.ocoId === 'number' && (
            <div className="p-4 bg-white border rounded-xl">
              <h2 className="font-semibold mb-2">Informações compartilhadas</h2>

              {infos.isLoading && <p className="text-sm text-gray-500">Carregando informações…</p>}
              {!infos.isLoading && (infos.data?.length ?? 0) === 0 && (
                <p className="text-sm text-gray-600">Nenhuma informação enviada ainda.</p>
              )}
              {!infos.isLoading && (infos.data?.length ?? 0) > 0 && (
                <ul className="space-y-3">
                  {infos.data!.map((it) => (
                    <li key={it.id} className="border rounded-lg p-3">
                      <p className="text-sm text-gray-800">
                        <strong>Data:</strong> {new Date(it.data).toLocaleDateString('pt-BR')}
                      </p>
                      {it.informacao && <p className="text-sm mt-1"><strong>Informação:</strong> {it.informacao}</p>}
                      {!!it.anexos?.length && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {it.anexos.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 border rounded hover:bg-gray-50">
                              Anexo {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="pt-2">
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setOpenForm(true)}
              disabled={typeof p.ocoId !== 'number'}
              aria-disabled={typeof p.ocoId !== 'number'}
              title={typeof p.ocoId !== 'number' ? 'Ocorrência não disponível para reporte' : 'Reportar informação'}
            >
              Tenho informações
            </button>
          </div>
        </div>
      </div>

      {/* Modal ReportForm */}
      {openForm && typeof p.ocoId === 'number' && (
        <ReportForm
          ocoId={p.ocoId}
          onClose={() => {
            setOpenForm(false)
            infos.refetch()
          }}
        />
      )}
    </div>
  )
}
