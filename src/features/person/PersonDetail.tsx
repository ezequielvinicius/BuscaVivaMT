import { useParams } from 'react-router-dom'
import { usePessoa } from '@/hooks/usePessoa'
import { LoadingStates } from '@/components/ui/LoadingStates'
import { StatusPill } from '@/components/ui/StatusPill'

export function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: pessoa, isLoading, isError } = usePessoa(id || '')

  // ✅ CORREÇÃO: Handler para botão funcionando
  const handleReportInfo = () => {
    // Aqui você pode implementar modal ou integração real
    alert('Funcionalidade de relato será implementada em breve. Obrigado pelo interesse em ajudar!')
  }

  if (isLoading) {
    return <LoadingStates.PersonDetail />
  }

  if (isError || !pessoa) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pessoa não encontrada</h2>
          <p className="text-gray-600 mb-6">Não foi possível encontrar informações sobre esta pessoa.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-police-600 hover:bg-police-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const showField = (label: string, value?: string | number) =>
    value ? (
      <div>
        <span className="text-gray-500">{label}</span>
        <span className="ml-2 font-medium">{value}</span>
      </div>
    ) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          
          {/* Header da pessoa */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Foto */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                  {pessoa.fotoPrincipal ? (
                    <img 
                      src={pessoa.fotoPrincipal} 
                      alt={`Foto de ${pessoa.nome}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações principais */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{pessoa.nome}</h1>
                  <StatusPill status={pessoa.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {showField('Idade:', pessoa.idade ? `${pessoa.idade} anos` : undefined)}
                  {showField('Sexo:', pessoa.sexo)}
                  {showField('Local:', pessoa.cidade)}
                  {showField('Desaparecimento:', pessoa.dataDesaparecimento
                    ? new Date(pessoa.dataDesaparecimento).toLocaleDateString('pt-BR')
                    : undefined)}
                  
                  {/* ✅ CORREÇÃO: Campos extras da API */}
                  {showField('Encontrado Vivo:', pessoa.encontradoVivo !== undefined 
                    ? (pessoa.encontradoVivo ? 'Sim' : 'Não') 
                    : undefined)}
                  {showField('Data de Localização:', pessoa.dataLocalizacao
                    ? new Date(pessoa.dataLocalizacao).toLocaleDateString('pt-BR')
                    : undefined)}
                  {showField('Vestimentas:', pessoa.vestimentas)}
                  {showField('Informação Breve:', pessoa.informacaoBreve)}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ CORREÇÃO: Seção Cartazes */}
          {Array.isArray(pessoa.cartazes) && pessoa.cartazes.length > 0 && (
            <div className="px-6 py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cartazes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pessoa.cartazes.map((cartaz, index) => (
                  <div key={index} className="group cursor-pointer">
                    <img
                      src={cartaz.urlCartaz}
                      alt={cartaz.tipoCartaz || 'Cartaz'}
                      className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                      onClick={() => window.open(cartaz.urlCartaz, '_blank')}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {cartaz.tipoCartaz || 'Cartaz'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ CORREÇÃO: Informações Adicionais Recebidas */}
          {pessoa.informacoesAdicionais && Array.isArray(pessoa.informacoesAdicionais) && pessoa.informacoesAdicionais.length > 0 && (
            <div className="px-6 py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Recebidas do Público</h2>
              <div className="space-y-3">
                {pessoa.informacoesAdicionais.map((info: any, idx: number) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 font-medium">
                      {info.texto || info.informacao || 'Informação sem detalhes'}
                    </p>
                    {info.data && (
                      <p className="text-xs text-blue-700 mt-2">
                        📅 {new Date(info.data).toLocaleString('pt-BR')}
                      </p>
                    )}
                    {info.autor && (
                      <p className="text-xs text-blue-600 mt-1">
                        👤 Enviado por: {info.autor}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ CORREÇÃO: Botão com função + melhor UX */}
          <div className="px-6 py-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Possui informações sobre esta pessoa?
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Qualquer informação pode ser crucial para localizar esta pessoa. 
                Sua colaboração pode fazer a diferença!
              </p>
              <button
                onClick={handleReportInfo}
                className="bg-police-600 hover:bg-police-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                💡 Tenho Informações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
