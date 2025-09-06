import { Link } from 'react-router-dom'

export function MobileHeader() {
  return (
    <header className="md:hidden bg-gradient-to-r from-police-900 to-police-800 shadow-lg">
      <div className="px-4 py-4">
        <Link 
          to="/" 
          className="flex items-center space-x-3 group"
          aria-label="Página inicial do BuscaVivaMT"
        >
          {/* Logo Compacta */}
          <div className="bg-white/10 rounded-full p-2 group-hover:bg-white/15 transition-colors">
            <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 21 4 21 12C21 16 17 20 12 22C7 20 3 16 3 12C3 4 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Nome Compacto */}
          <div>
            <h1 className="text-lg font-bold text-white">
              BuscaViva<span className="text-institutional-gold">MT</span>
            </h1>
            <p className="text-xs text-police-100 -mt-1">Pessoas Desaparecidas</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
