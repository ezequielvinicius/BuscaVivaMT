import type { PersonStatus } from '@/types/person'

interface StatusPillProps {
  status: PersonStatus
  size?: 'sm' | 'md' | 'lg'
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const statusConfig = {
    DESAPARECIDO: {
      classes: 'bg-red-100 text-red-800 border border-red-200',
      label: 'Desaparecido',
      icon: '🔍'
    },
    LOCALIZADO: {
      classes: 'bg-green-100 text-green-800 border border-green-200',
      label: 'Localizado',
      icon: '✅'
    }
  } as const

  const config = statusConfig[status] || statusConfig.DESAPARECIDO

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${config.classes}`}>
      <span className="mr-1" aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  )
}
