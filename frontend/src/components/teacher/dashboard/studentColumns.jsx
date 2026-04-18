// import Avatar from "../../ui/Avatar";
// import { getStudentName } from "../../../hooks/useDashboard";

// export const nameColumn = {
//   key: "name",
//   label: "اسم الطالب",
//   render: (row) => (
//     <div className="flex items-center gap-3">
//       <Avatar
//         src={row.profilePicture}
//         name={getStudentName(row)}
//         iconSize={13}
//         className="w-9 h-9 rounded-full shrink-0 text-sm"
//       />
//       <span className="text-sm font-medium text-gray-800">{getStudentName(row)}</span>
//     </div>
//   ),
// };

// export const lessonsColumn = {
//   key: "completedLessons",
//   label: "الدروس المكتملة",
//   render: (row) => (
//     <span className="text-[#84919A] text-[18px]">{row.completedLessons ?? 0}</span>
//   ),
// };

// export const progressColumn = {
//   key: "progress",
//   label: "نسبة التقدم",
//   render: (row) => (
//     <div className="flex items-center gap-2">
//       <span className="text-[#84919A] text-sm whitespace-nowrap">% {row.progress || 0}</span>
//       <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px] overflow-hidden">
//         <div
//           className="h-full bg-orange-500 rounded-full transition-[width] duration-300"
//           style={{ width: `${row.progress || 0}%` }}
//         />
//       </div>
//       <span className="text-[#84919A] text-sm whitespace-nowrap">% 100</span>
//     </div>
//   ),
// };