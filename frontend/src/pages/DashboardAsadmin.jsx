// import {
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import "../styles/login.css";
// import { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { getAllPosts } from "../api/postApi";

// export default function DashboardAsadmin() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { data: postsData, isLoading } = useQuery({
//     queryKey: ['posts-evaluations', currentPage],
//     queryFn: () => getAllPosts({ page: currentPage, limit: 8 }),
//   });

//   const evaluations = postsData?.data?.data?.data || [];
//   const totalResults = postsData?.data?.results || 0;

//   const getStatusText = (status) => {
//     switch (status) {
//       case "new": return "جديد";
//       case "reviewed": return "تمت المراجعة";
//       case "pending": case "under-review": return "قيد المراجعة";
//       default: return status || "جديد";
//     }
//   };

//   return (
//     <>
//       <div className="tabs-container">
//         <button className={`tab ${location.pathname === '/DashboardAsadmin' ? 'active' : ''}`} onClick={() => navigate("/DashboardAsadmin")}>
//           آراء / تقييمات المستخدمين
//         </button>
//         <button className={`tab ${location.pathname === '/Comments' ? 'active' : ''}`} onClick={() => navigate('/Comments')}>
//           التعليقات
//         </button>
//         <button className={`tab ${location.pathname === '/Groups' ? 'active' : ''}`} onClick={() => navigate('/Groups')}>
//           المنشورات
//         </button>
//       </div>

//       <h1 className="page-title">آراء/ تقييمات المستخدمين</h1>

//       <div className="admin-table-wrap">
//         {isLoading ? (
//           <div className="admin-state">جاري التحميل...</div>
//         ) : evaluations.length === 0 ? (
//           <div className="admin-state admin-state--muted">لا توجد تقييمات</div>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>الإسم</th>
//                 <th>نوع التقيم</th>
//                 <th>الرسالة</th>
//                 <th>الحالة</th>
//               </tr>
//             </thead>
//             <tbody>
//               {evaluations.map((evaluation, index) => (
//                 <tr key={evaluation._id || evaluation.id || index}>
//                   <td className="td-center">
//                     <div className='num'>
//                       <input type="checkbox" className="checkbox" />
//                       <span>{(currentPage - 1) * 8 + index + 1}</span>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="user-cell">
//                       <img
//                         src={`https://ui-avatars.com/api/?name=${evaluation.user?.firstName || 'U'}&background=f97316&color=fff&size=40`}
//                         alt={evaluation.user?.firstName}
//                         className="user-avatar"
//                       />
//                       <span>{evaluation.user?.firstName} {evaluation.user?.lastName}</span>
//                     </div>
//                   </td>
//                   <td>{evaluation.type || 'تقييم'}</td>
//                   <td>{evaluation.content || evaluation.text || ''}</td>
//                   <td>
//                     <span className={`status-badge ${evaluation.status || 'new'}`}>
//                       {getStatusText(evaluation.status)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}

//         <div className="pagination">
//           <div className="side">
//             <button className="pagination-button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}><ChevronRight /></button>
//             <button className={`pagination-button ${currentPage === 1 ? "active" : ""}`} onClick={() => setCurrentPage(1)}>١</button>
//             <button className="pagination-button" onClick={() => setCurrentPage(2)}>٢</button>
//             <button className="pagination-button" onClick={() => setCurrentPage(p => p + 1)}><ChevronLeft /></button>
//           </div>
//           <span className="pagination-info">أظهار {evaluations.length} من {totalResults || '٠'}</span>
//         </div>
//       </div>
//     </>
//   );
// }
