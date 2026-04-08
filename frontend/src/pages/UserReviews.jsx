import { memo, useState } from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import '../styles/community.css';
// const reviewsData = [
//   {
//     id: 1,
//     name: "ريم محمود",
//     avatar: "https://i.pravatar.cc/40?u=1",
//     type: "اقتراح",
//     message: "أنصح إضافة قسم خاص للأطفال بالأطفال لتعليمهم لغة الإشارة بطريقة ممتعة ومرسومة",
//     status: "جديد",
//     statusClass: "status-new",
//     date: "منذ يومين"
//   },
//   {
//     id: 2,
//     name: "خالد سامي",
//     avatar: "https://i.pravatar.cc/40?u=2",
//     type: "مشكلة",
//     message: "بعض الفيديوهات لا تعمل عندي على الإنترنت الضعيف. ياريت يكون في جودة أقل.",
//     status: "تمت المراجعة",
//     statusClass: "status-reviewed",
//     date: "منذ 3 أيام"
//   },
//   {
//     id: 3,
//     name: "هبة عادل",
//     avatar: "https://i.pravatar.cc/40?u=3",
//     type: "شكر",
//     message: "التطبيق جميل جداً وساعدني مع أختي الصماء بشكل أفضل. شكراً لكم ❤️",
//     status: "تم الرد",
//     statusClass: "status-replied",
//     date: "منذ أسبوع"
//   },
//   {
//     id: 4,
//     name: "أيه حسن",
//     avatar: "https://i.pravatar.cc/40?u=4",
//     type: "اقتراح",
//     message: "ياريت تكون في خاصية حفظ الدروس المفضلة.",
//     status: "جديد",
//     statusClass: "status-new",
//     date: "منذ 5 أيام"
//   },
//   {
//     id: 5,
//     name: "محمود فؤاد",
//     avatar: "https://i.pravatar.cc/40?u=5",
//     type: "مشكلة",
//     message: "التطبيق يعلق أحياناً أثناء تحميل الفيديوهات.",
//     status: "قيد المراجعة",
//     statusClass: "status-pending",
//     date: "منذ يوم"
//   },
// ];

// export default function UserReviews() {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredReviews = reviewsData.filter(review =>
//     review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     review.message.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="reviews-page">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Tabs */}
//         <div className="reviews-tabs">
//           <div className="reviews-tab active">آراء / تقييمات المستخدمين</div>   
//           <div className="reviews-tab">التعليقات</div>
//           <div className="reviews-tab">المنشورات</div>
//         </div>

//         {/* Page Title */}
//         <h1 className="reviews-title">آراء / تقييمات المستخدمين</h1>

//         {/* Table */}
//         <div className="reviews-table-container">
//          {/* Search Bar */}
//         <div className="reviews-search">
//           <input
//             type="text"
//             placeholder="ابحث عن اسم أو محتوى التقييم..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Search className="search-icon" size={20} />
//         </div>
//           <table className="reviews-table w-full">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>الاسم</th>
//                 <th>نوع التقييم</th>
//                 <th>الرسالة</th>
//                 <th>الحالة</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReviews.map((review, index) => (
//                 <tr key={review.id}>
//                   <td>{index + 1}</td>

//                   <td>
//                     <div className="user-cell">
//                       <img 
//                         src={review.avatar} 
//                         alt={review.name}
//                         className="w-10 h-10 rounded-full"
//                       />
//                       <span>{review.name}</span>
//                     </div>
//                   </td>

//                   <td>
//                     <span className="font-medium text-gray-700">{review.type}</span>
//                   </td>

//                   <td className="message-cell">
//                     {review.message}
//                   </td>

//                   <td>
//                     <span className={`status-badge ${review.statusClass}`}>
//                       {review.status}
//                     </span>
//                   </td>

//                   <td>
//                     <input type="checkbox" className="accent-orange-500" />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="reviews-pagination">
//           <div className="pagination-info">١ - ٨ من ٢٤</div>
          
//           <div className="pagination-buttons">
//             <button className="pagination-btn">←</button>
//             {[1, 2, 3, 4].map(page => (
//               <button
//                 key={page}
//                 className={`pagination-btn ${page === 1 ? 'active' : ''}`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button className="pagination-btn">→</button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

function UserReviews({
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
         {/* Header Tabs */}
         <div className="reviews-tabs">
          <div className="reviews-tab active">آراء / تقييمات المستخدمين</div>   
           <div className="reviews-tab">التعليقات</div>
           <div className="reviews-tab">المنشورات</div>
         </div>
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

export default memo(UserReviews);
