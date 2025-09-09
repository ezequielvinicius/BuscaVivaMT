import type { PersonStatus, Sexo } from '@/types/person';

type Props = {
  status?: PersonStatus;
  sexo?: Sexo;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  onChange: (next: {
    status?: PersonStatus;
    sexo?: Sexo;
    faixaIdadeInicial?: number;
    faixaIdadeFinal?: number;
  }) => void;
}

export function FilterPanel({ status, sexo, faixaIdadeInicial, faixaIdadeFinal, onChange }: Props) {
  const handleStatusChange = (value: string) => {
    onChange({ status: value === '' ? undefined : value as PersonStatus });
  };

  const handleSexoChange = (value: string) => {
    onChange({ sexo: value === '' ? undefined : value as Sexo });
  };

  const handleIdadeInicialChange = (value: string) => {
    const num = value === '' ? undefined : Number(value);
    onChange({ faixaIdadeInicial: isNaN(num!) ? undefined : num });
  };

  const handleIdadeFinalChange = (value: string) => {
    const num = value === '' ? undefined : Number(value);
    onChange({ faixaIdadeFinal: isNaN(num!) ? undefined : num });
  };

  return (
    <div className="flex flex-wrap items-end gap-3 bg-white border rounded-xl p-3">
      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={status ?? ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">Todos</option>
          <option value="DESAPARECIDO">Desaparecidas</option>
          <option value="LOCALIZADO">Localizadas</option>
        </select>
      </div>

      {/* Sexo */}
      <div>
        <label className="block text-sm font-medium mb-1">Sexo</label>
        <select
          className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={sexo ?? ''}
          onChange={(e) => handleSexoChange(e.target.value)}
          aria-label="Filtrar por sexo"
        >
          <option value="">Todos</option>
          <option value="FEMININO">Feminino</option>
          <option value="MASCULINO">Masculino</option>
        </select>
      </div>

      {/* Idade mínima */}
      <div>
        <label className="block text-sm font-medium mb-1">Idade (mín.)</label>
        <input
          type="number"
          min={0}
          className="w-24 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={faixaIdadeInicial ?? ''}
          onChange={(e) => handleIdadeInicialChange(e.target.value)}
          aria-label="Idade mínima"
        />
      </div>

      {/* Idade máxima */}
      <div>
        <label className="block text-sm font-medium mb-1">Idade (máx.)</label>
        <input
          type="number"
          min={0}
          className="w-24 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          value={faixaIdadeFinal ?? ''}
          onChange={(e) => handleIdadeFinalChange(e.target.value)}
          aria-label="Idade máxima"
        />
      </div>
    </div>
  )
}