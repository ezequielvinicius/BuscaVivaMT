import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { ArrowLeft, MapPin, Calendar, Shirt, Info, Lightbulb, Share2 } from 'lucide-react'
import { usePessoa } from '@/hooks/usePessoa'
import { LoadingStates } from '@/components/ui/LoadingStates'
import { StatusPill } from '@/components/ui/StatusPill'
import { Modal } from '@/components/ui/Modal'
import { ReportForm } from '@/features/person/ReportForm'

export function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: pessoa, isLoading, isError } = usePessoa(id || '')
  
  //Estado do modal
  const [showReportModal, setShowReportModal] = useState(false)

  //Handler do botão (trocar alert pelo modal)
  const handleReportInfo = () => {
    setShowReportModal(true)
  }

  //Handler de sucesso
  const handleReportSuccess = () => {
    setShowReportModal(false)
    alert('Informação enviada com sucesso! Obrigado por colaborar.')
  }

  const handleShare = async () => {
    if (navigator.share && pessoa) {
      try {
        await navigator.share({
          title: `Pessoa Desaparecida: ${pessoa.nome}`,
          text: `Ajude a localizar ${pessoa.nome}. Qualquer informação pode fazer a diferença.`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Compartilhamento cancelado')
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Data não informada'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  if (isLoading) {
    return <LoadingStates.PersonDetail />
  }

  if (isError || !pessoa || pessoa.id === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pessoa não encontrada</h1>
          <p className="text-gray-600 mb-8">Não foi possível encontrar informações sobre esta pessoa.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-police-600 hover:bg-police-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Voltar
            </button>
            <a
              href="/"
              className="block text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              Ir para página inicial
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/*Header com navegação */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/*Conteúdo principal */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/*Card principal: Foto + Informações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Foto da pessoa */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-xl overflow-hidden bg-gray-100 ring-4 ring-gray-100">
                  {pessoa.fotoPrincipal ? (
                    <img 
                      src={pessoa.fotoPrincipal} 
                      alt={`Foto de ${pessoa.nome}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <p className="text-sm">Foto não disponível</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações principais */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                      {pessoa.nome}
                    </h1>
                    <StatusPill status={pessoa.status} size="lg" />
                  </div>
                </div>

                {/* Grid de informações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {pessoa.idade && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Idade:</span>
                      <span className="font-semibold">{pessoa.idade} anos</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Sexo:</span>
                    <span className="font-semibold">{pessoa.sexo}</span>
                  </div>

                  {pessoa.cidade && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Local:</span>
                      <span className="font-semibold">{pessoa.cidade}</span>
                    </div>
                  )}

                  {pessoa.dataDesaparecimento && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Desaparecimento:</span>
                      <span className="font-semibold">{formatDate(pessoa.dataDesaparecimento)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Informações detalhadas organizadas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informações Detalhadas</h2>
          
          <div className="space-y-6">
            {/* Local de desaparecimento */}
            {pessoa.localDesaparecimento && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Local do Desaparecimento
                </h3>
                <p className="text-gray-700 pl-7 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  {pessoa.localDesaparecimento}
                </p>
              </div>
            )}

            {/* Vestimentas */}
            {pessoa.vestimentas && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <Shirt className="w-5 h-5 text-purple-500" />
                  Vestimentas no Dia do Desaparecimento
                </h3>
                <p className="text-gray-700 pl-7 bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  {pessoa.vestimentas}
                </p>
              </div>
            )}

            {/* Informações adicionais */}
            {pessoa.informacaoBreve && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <Info className="w-5 h-5 text-green-500" />
                  Informações Adicionais
                </h3>
                <p className="text-gray-700 pl-7 bg-green-50 p-4 rounded-lg border-l-4 border-green-500 whitespace-pre-line">
                  {pessoa.informacaoBreve}
                </p>
              </div>
            )}

            {/* Data de localização */}
            {pessoa.dataLocalizacao && (
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Data de Localização
                </h3>
                <p className="text-gray-700 pl-7 bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <span className="font-semibold">Localizada em:</span> {formatDate(pessoa.dataLocalizacao)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/*Galeria de cartazes */}
        {Array.isArray(pessoa.cartazes) && pessoa.cartazes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cartazes de Divulgação</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pessoa.cartazes.map((cartaz, index) => (
                <div 
                  key={index} 
                  className="group cursor-pointer bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                  onClick={() => window.open(cartaz.urlCartaz, '_blank')}
                >
                  <img
                    src={cartaz.urlCartaz}
                    alt={cartaz.tipoCartaz || 'Cartaz'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700">
                      {cartaz.tipoCartaz || 'Material de Divulgação'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Clique para visualizar em tamanho completo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/*Call-to-action com botão funcional */}
        {pessoa.status === 'DESAPARECIDO' && (
          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Possui informações sobre {pessoa.nome.split(' ')[0]}?
              </h2>
              
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Qualquer informação pode ser crucial para localizar esta pessoa. 
                Sua colaboração pode fazer toda a diferença para a família!
              </p>
              
              <button
                onClick={handleReportInfo} //Agora abre o modal
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-3 group"
              >
                <Lightbulb className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Tenho Informações
              </button>
              
              <p className="text-blue-200 text-sm mt-4 max-w-md mx-auto">
                Suas informações podem ser reportadas de forma anônima
              </p>
            </div>
          </div>
        )}
      </div>

      {/*Modal com formulário */}
      {showReportModal && (
        <Modal 
          isOpen={showReportModal} 
          onClose={() => setShowReportModal(false)}
          title={`Informações sobre ${pessoa?.nome}`}
          size="lg"
        >
          <ReportForm 
            ocoId={pessoa?.ocoId || 0}
            personName={pessoa?.nome || ''}
            onSuccess={handleReportSuccess}
            onCancel={() => setShowReportModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}