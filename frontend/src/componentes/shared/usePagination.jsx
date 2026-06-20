import { useEffect, useMemo, useState } from "react";

export function usePagination(items, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / selectedPageSize));

  useEffect(() => {
    setCurrentPage((prev) => {
      if (totalItems === 0) return 1;
      return Math.min(prev, totalPages);
    });
  }, [totalItems, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize]);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * selectedPageSize;
    return items.slice(start, start + selectedPageSize);
  }, [items, selectedPageSize, safeCurrentPage]);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * selectedPageSize + 1;
  const endItem = Math.min(safeCurrentPage * selectedPageSize, totalItems);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    totalItems,
    startItem,
    endItem,
    paginatedItems,
    setCurrentPage,
    pageSize: selectedPageSize,
    setPageSize: setSelectedPageSize,
    hasPrevious: safeCurrentPage > 1,
    hasNext: safeCurrentPage < totalPages,
  };
}