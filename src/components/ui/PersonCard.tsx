import { Link } from 'react-router-dom'
import { StatusPill } from './StatusPill'
import type { PersonListItem } from '@/types/person'

interface PersonCardProps {
  pessoa: PersonListItem
}

export function PersonCard({ pessoa }: PersonCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  return (
    <Link 
      to={`/pessoa/${pessoa.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              {pessoa.fotoPrincipal ? (
                <img 
                  src={pessoa.fotoPrincipal} 
                  alt={`Foto de ${pessoa.nome}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              {/* Nome */}
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-police-600 transition-colors truncate">
                {pessoa.nome}
              </h3>

              {/* Idade e Sexo */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {pessoa.idade && (
                  <span>{pessoa.idade} anos</span>
                )}
                {pessoa.idade && pessoa.sexo && (
                  <span>•</span>
                )}
                <span>{pessoa.sexo}</span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <StatusPill status={pessoa.status} size="sm" />
              </div>

              {/* Local e Data */}
              <div className="space-y-1 text-sm text-gray-600">
                {pessoa.cidade && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{pessoa.cidade}</span>
                  </div>
                )}
                
                {pessoa.dataDesaparecimento && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(pessoa.dataDesaparecimento)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
