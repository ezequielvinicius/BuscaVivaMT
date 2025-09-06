export function DelegaciaDigitalWizard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-8 text-center">
            {/* Ícone */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-police-100 mb-6">
              <svg 
                className="h-8 w-8 text-police-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Delegacia Digital</h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Acesse os serviços digitais da Polícia Civil de Mato Grosso. 
              Faça registros de ocorrência, consulte processos e utilize outros serviços online.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="ml-3 text-left">
                  <h3 className="text-sm font-medium text-blue-800">Redirecionamento para site oficial</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Você será redirecionado para o site oficial da Delegacia Digital da Polícia Civil de MT.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <a
                href="https://www.pjc.mt.gov.br/delegacia-virtual"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-police-600 hover:bg-police-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-police-500 transition-colors"
              >
                Acessar Delegacia Digital
                <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              <div className="text-sm text-gray-500">
                Serviço oficial da Polícia Civil de Mato Grosso
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
