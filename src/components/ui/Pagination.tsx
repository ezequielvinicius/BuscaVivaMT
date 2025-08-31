type Props = {
  page: number;            // 0-based
  totalPages: number;      // total
  onChange(page: number): void;
};
export function Pagination({ page, totalPages, onChange }: Props) {
  const prev = () => onChange(Math.max(page - 1, 0));
  const next = () => onChange(Math.min(page + 1, totalPages - 1));
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={prev}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        disabled={page === 0}
      >
        ← Anterior
      </button>
      <span className="text-sm text-gray-600">
        Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
      </span>
      <button
        onClick={next}
        className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        disabled={page >= totalPages - 1}
      >
        Próxima →
      </button>
    </div>
  );
}
