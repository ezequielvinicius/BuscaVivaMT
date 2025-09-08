interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showInfo?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, showInfo = true }) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []

    // ✅ LÓGICA CORRETA para evitar duplicação
    const start = Math.max(0, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    // Sempre incluir primeira página
    if (start > 0) {
      rangeWithDots.push(0)
      if (start > 1) rangeWithDots.push('...')
    }

    // Páginas do meio
    for (let i = start; i <= end; i++) {
      rangeWithDots.push(i)
    }

    // Sempre incluir última página
    if (end < totalPages - 1) {
      if (end < totalPages - 2) rangeWithDots.push('...')
      rangeWithDots.push(totalPages - 1)
    }

    // ✅ REMOVER DUPLICATAS
    return [...new Set(rangeWithDots)]
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
      {showInfo && (
        <div>
          <p className="text-sm text-gray-700">
            Página <span className="font-medium">{currentPage + 1}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
      )}

      <div>
        <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
          {/* Botão Anterior */}
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Números das páginas */}
          {visiblePages.map((page, index) => (
            <button
              key={`page-${page}-${index}`} // ✅ Key única
              onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
              disabled={page === '...'}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${
                typeof page === 'number' && page === currentPage
                  ? 'z-10 bg-police-50 border-police-500 text-police-600'
                  : page === '...'
                  ? 'bg-white border-gray-300 text-gray-700 cursor-default'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {typeof page === 'number' ? page + 1 : page}
            </button>
          ))}

          {/* Botão Próximo */}
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className="relative inline-flex items-center px-2 py-2 text-gray-400 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  )
}