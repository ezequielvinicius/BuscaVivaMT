// src/components/ui/PersonDetailSkeleton.tsx - Loading específico para detalhes
export function PersonDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Card principal skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto skeleton */}
            <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-200 rounded-xl flex-shrink-0 mx-auto md:mx-0"></div>
            
            {/* Info skeleton */}
            <div className="flex-1 space-y-4">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto md:mx-0"></div>
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto md:mx-0"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded md:col-span-2"></div>
                <div className="h-4 bg-gray-200 rounded md:col-span-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações detalhadas skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-40"></div>
              <div className="h-20 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="bg-gray-300 rounded-xl p-8 animate-pulse">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto"></div>
            <div className="h-8 bg-gray-400 rounded w-80 mx-auto"></div>
            <div className="h-12 bg-gray-400 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
