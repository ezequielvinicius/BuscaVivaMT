import type { StatusPessoa } from '@/types/person';

export function StatusPill({ status }: { status: StatusPessoa }) {
  const isMissing = status === 'DESAPARECIDO';
  const cls = isMissing
    ? 'bg-red-100 text-red-700 border border-red-200'
    : 'bg-green-100 text-green-700 border border-green-200';
  const label = isMissing ? 'Desaparecida' : 'Localizada';
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
