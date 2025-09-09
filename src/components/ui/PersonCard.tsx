import { MapPin, Calendar, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusPill } from './StatusPill'
import type { PersonListItem } from '@/types/person' 

interface PersonCardProps {
  pessoa: PersonListItem
}

export function PersonCard({ pessoa }: PersonCardProps) {
  
  // Funções de formatação que não precisam de alteração
  const formatarIdade = (idade?: number | null): string => {
    if (!idade || idade <= 0) return 'Idade não informada'
    return `${idade} anos`
  }
  
  const formatarSexoIdade = (sexo: string, idade?: number | null): string => {
    const idadeFormatada = formatarIdade(idade)
    if (idadeFormatada === 'Idade não informada') return sexo
    return `${idadeFormatada} • ${sexo}`
  }
  
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Data não informada'
    try {
      // Usando toLocaleDateString para formatar a data para o padrão brasileiro
      return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    } catch {
      return 'Data inválida'
    }
  }

  return (
    <Link 
      to={`/pessoa/${pessoa.id}`} 
      className="block group hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group-hover:shadow-lg transition-shadow duration-200">
        <div className="relative aspect-square">
          {pessoa.fotoPrincipal ? (
            <img 
              src={pessoa.fotoPrincipal}
              alt={`Foto de ${pessoa.nome}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            {/*Usa o status que já vem no objeto 'pessoa' */}
            <StatusPill status={pessoa.status} size="sm" />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {pessoa.nome}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {formatarSexoIdade(pessoa.sexo, pessoa.idade)}
            </p>
          </div>
          
          {/*Usa 'cidade' diretamente */}
          {pessoa.cidade && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600 line-clamp-2">
                {pessoa.cidade}
              </span>
            </div>
          )}
          
          {/*Usa 'dataDesaparecimento' diretamente */}
          {pessoa.dataDesaparecimento && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {formatDate(pessoa.dataDesaparecimento)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}