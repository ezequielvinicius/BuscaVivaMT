import { StatusPill } from './StatusPill';
import type { PersonListItem } from '@/types/person';

export function PersonCard({ p, onClick }: { p: PersonListItem; onClick?: () => void }) {
  return (
    <div
      className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={onClick}
      role="button"
      aria-label={`Abrir detalhes de ${p.nome}`}
    >
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {p.fotoPrincipal ? (
          <img
            src={p.fotoPrincipal}
            alt={`Foto de ${p.nome}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg'; }}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">Sem foto</div>
        )}
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{p.nome}</h3>
          <StatusPill status={p.status} />
        </div>
        {p.cidade && <p className="text-sm text-gray-600">📍 {p.cidade}</p>}
        {p.dataDesaparecimento && (
          <p className="text-xs text-gray-500">Desde: {new Date(p.dataDesaparecimento).toLocaleDateString('pt-BR')}</p>
        )}
      </div>
    </div>
  );
}
