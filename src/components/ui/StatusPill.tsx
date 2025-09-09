import { Search, CheckCircle, HelpCircle } from 'lucide-react' 

type StatusType = 'DESAPARECIDO' | 'LOCALIZADO'
type SizeType = 'sm' | 'md' | 'lg'

interface StatusPillProps {
  status: StatusType
  size?: SizeType
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'DESAPARECIDO':
        return {
          label: 'Desaparecido',
          Icon: Search, // Componente ícone
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      case 'LOCALIZADO':
        return {
          label: 'Localizado',
          Icon: CheckCircle, // Componente ícone
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      default:
        return {
          label: 'Desconhecido',
          Icon: HelpCircle, // Componente ícone
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  }

  const config = getStatusConfig(status)
  const IconComponent = config.Icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}>
      <IconComponent size={iconSizes[size]} />
      {config.label}
    </span>
  )
}
