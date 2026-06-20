export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageSizeChange,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm font-medium text-gray-600">
          {totalItems === 0 ? "Sin registros para mostrar." : `Mostrando ${startItem}-${endItem} de ${totalItems}`}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
          Mostrar
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          por página
        </label>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <span className="min-w-[120px] text-center text-sm font-semibold text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}