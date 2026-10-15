"use client";

import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalRecords: number;

  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: PaginationProps) {
  // Calculate total pages automatically
  const totalPages = Math.ceil(totalRecords / pageSize);

  // No records
  if (totalRecords === 0) {
    return null;
  }

  // Prevent invalid page values
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startRecord = (safeCurrentPage - 1) * pageSize + 1;

  const endRecord = Math.min(safeCurrentPage * pageSize, totalRecords);

  function getPages(): (number | string)[] {
    const pages: (number | string)[] = [];

    // Show all pages when there are 7 or fewer
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // First page
    pages.push(1);

    // Left ellipsis
    if (safeCurrentPage > 4) {
      pages.push("...");
    }

    // Pages around current page
    const start = Math.max(2, safeCurrentPage - 1);

    const end = Math.min(totalPages - 1, safeCurrentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (safeCurrentPage < totalPages - 3) {
      pages.push("...");
    }

    // Last page
    pages.push(totalPages);

    return pages;
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    if (page === safeCurrentPage) {
      return;
    }

    onPageChange(page);
  }

  function handlePageSizeChange(newPageSize: number) {
    if (!onPageSizeChange) {
      return;
    }

    onPageSizeChange(newPageSize);
  }

  return (
    <div className={styles.paginationWrapper}>
      {/* LEFT SECTION */}
      <div className={styles.leftSection}>
        {onPageSizeChange && (
          <>
            <span className={styles.showText}>Show</span>

            <select
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span className={styles.showText}>per page</span>
          </>
        )}

        <span className={styles.recordInfo}>
          Showing <strong>{startRecord}</strong>-<strong>{endRecord}</strong> of{" "}
          <strong>{totalRecords}</strong>
        </span>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.paginationControls}>
        {/* PREVIOUS */}
        <button
          type="button"
          className={styles.navigationButton}
          disabled={safeCurrentPage === 1}
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          aria-label="Previous page"
          title="Previous page"
        >
          ‹
        </button>

        {/* PAGE NUMBERS */}
        {getPages().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          const pageNumber = page as number;

          return (
            <button
              type="button"
              key={pageNumber}
              className={`${styles.pageButton} ${
                safeCurrentPage === pageNumber ? styles.active : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={safeCurrentPage === pageNumber ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* NEXT */}
        <button
          type="button"
          className={styles.navigationButton}
          disabled={safeCurrentPage === totalPages}
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          aria-label="Next page"
          title="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
