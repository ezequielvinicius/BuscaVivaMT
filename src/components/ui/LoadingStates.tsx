import React from 'react'

/**
 * Skeleton para cards de pessoas
 */
export function PersonCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
              <div className="h-3 bg-gray-300 rounded w-5/8" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded-full w-20" />
            <div className="h-8 bg-gray-300 rounded w-24" />
          </div>
        </div>
      ))}
    </>
  )
}

/**
 * Skeleton para detalhes de pessoa
 */
export function PersonDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gray-300 h-64 md:h-auto" />
        <div className="md:w-2/3 p-6 space-y-4">
          <div className="h-8 bg-gray-300 rounded w-3/4" />
          <div className="h-6 bg-gray-300 rounded-full w-24" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-4/6" />
          </div>
          <div className="flex space-x-4 pt-4">
            <div className="h-10 bg-gray-300 rounded w-32" />
            <div className="h-10 bg-gray-300 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Loading spinner acessível
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '',
  label = 'Carregando...' 
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  )
}

/**
 * Estado vazio com call-to-action
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="mx-auto w-24 h-24 text-gray-400 mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/**
 * Indicador de progresso acessível
 */
export function ProgressBar({ 
  progress, 
  label,
  showPercentage = true,
  className = ''
}: {
  progress: number
  label: string
  showPercentage?: boolean
  className?: string
}) {
  const percentage = Math.min(100, Math.max(0, progress))

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showPercentage && (
          <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
        )}
      </div>
      <div 
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percentage}% completo`}
      >
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
