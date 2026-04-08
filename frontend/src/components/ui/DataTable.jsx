import { memo, useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';
import LoadingSpinner from './LoadingSpinner';

function DataTable({
  columns,
  data,
  isLoading,
  searchable = true,
  searchKeys,
  selectable = true,
  filterLabel,
  onFilter,
  renderActions,
  itemsPerPage = 8,
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter data by search — use searchKeys if provided, otherwise search all columns
  const filtered = data?.filter((row) => {
    if (!search) return true;
    const keys = searchKeys ?? columns.map((col) => col.key);
    return keys.some((key) => {
      const val = row[key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    });
  }) ?? [];

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((row) => row.id || row._id));
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="table-container">
      <div className="table-header">
        {searchable && (
          <div className="table-header-search">
            <input
              type="text"
              placeholder="البحث"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Search className="search-icon" size={18} />
          </div>
        )}
        {filterLabel && (
          <button className="table-header-left" onClick={onFilter}>
            <span>{filterLabel}</span>
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="لا توجد بيانات" />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                {selectable && (
                  <th style={{ width: '50px' }}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedIds.length === paginated.length && paginated.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                <th>#</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                {renderActions && <th>خيارات</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, index) => (
                <tr key={row.id || row._id || index}>
                  {selectable && (
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedIds.includes(row.id || row._id)}
                        onChange={() => toggleSelect(row.id || row._id)}
                      />
                    </td>
                  )}
                  <td style={{ textAlign: 'center' }}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {renderActions && <td>{renderActions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </div>
  );
}

export default memo(DataTable);
