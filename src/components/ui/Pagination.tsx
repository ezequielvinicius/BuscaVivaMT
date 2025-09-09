import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  
  // Handler interno com logs para debug
  const handlePageClick = (page: number) => {
    console.log('🔄 Clique na página:', page, 'Página atual:', currentPage)
    
    if (page !== currentPage && page >= 0 && page < totalPages) {
      onPageChange(page)
    }
  }

  // Gerar array de páginas para mostrar
  const generatePageNumbers = () => {
    const delta = 2 // Quantas páginas mostrar de cada lado
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(0, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (range[0] > 1) {
      rangeWithDots.push(0, '...')
    } else if (range[0] === 1) {
      rangeWithDots.push(0)
    }

    rangeWithDots.push(...range)

    if (range[range.length - 1] < totalPages - 2) {
      rangeWithDots.push('...', totalPages - 1)
    } else if (range[range.length - 1] === totalPages - 2) {
      rangeWithDots.push(totalPages - 1)
    }

    return rangeWithDots
  }

  const pageNumbers = generatePageNumbers()

  return (
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      
      {/* Botão Anterior */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 0}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="ml-1 hidden sm:inline">Anterior</span>
      </button>

      {/* Números das páginas */}
      <div className="flex space-x-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
              >
                ...
              </span>
            )
          }

          const page = pageNum as number
          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium border transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900'
              }`}
              aria-label={`Ir para página ${page + 1}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page + 1}
            </button>
          )
        })}
      </div>

      {/* Botão Próximo */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <span className="mr-1 hidden sm:inline">Próximo</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}
