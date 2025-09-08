import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-police-900 via-police-800 to-police-900 shadow-lg relative overflow-hidden">
      {/* Padrão sutil de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-police-900/20 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo + Nome da Aplicação */}
          <Link 
            to="/" 
            className="flex items-center space-x-4 hover:opacity-90 transition-opacity duration-200 group"
            aria-label="Página inicial do BuscaVivaMT"
          >
            {/* Logo da Polícia Civil */}
            <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/15 transition-all duration-200">
              <svg 
                className="h-10 w-10 text-white" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                role="img"
                aria-label="Logo da Polícia Civil de Mato Grosso"
              >
                <path d="M12 2C12 2 21 4 21 12C21 16 17 20 12 22C7 20 3 16 3 12C3 4 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            
            {/* Nome da Aplicação */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                BuscaViva<span className="text-institutional-gold">MT</span>
              </h1>
              <p className="text-sm text-police-100 font-medium -mt-1">
                Sistema de Pessoas Desaparecidas
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Linha de separação sutil */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </header>
  )
}
