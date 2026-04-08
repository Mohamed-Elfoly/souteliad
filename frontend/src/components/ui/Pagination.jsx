import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 8,
}) {
  // Show up to 5 pages centered around current page
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const arabicNum = (n) => n.toLocaleString('ar-EG');

  return (
    <div className="pagination">
      <div className="side">
        <button
          className="pagination-button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {arabicNum(page)}
          </button>
        ))}
        <button
          className="pagination-button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft />
        </button>
      </div>
      {totalItems != null && (
        <span className="pagination-info">
          أظهار {arabicNum(Math.min(itemsPerPage, totalItems))} من {arabicNum(totalItems)}
        </span>
      )}
    </div>
  );
}
