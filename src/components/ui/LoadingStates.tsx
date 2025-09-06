// Skeleton para cards de pessoas
export function PersonCardSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="flex items-start space-x-4">
            {/* Skeleton da foto */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            </div>
            
            {/* Skeleton do conteúdo */}
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton para página de detalhes
export function PersonDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
          {/* Header skeleton */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto skeleton */}
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
              
              {/* Info skeleton */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 bg-gray-200 rounded w-48"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="px-6 py-8">
            <div className="text-center space-y-4">
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
              <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading spinner simples
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <svg 
      className={`animate-spin text-police-600 ${sizeClasses[size]}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

// Estados de loading agrupados
const LoadingStates = {
  PersonCardSkeleton,
  PersonDetail,
  Spinner
}

export { LoadingStates }
export default LoadingStates
