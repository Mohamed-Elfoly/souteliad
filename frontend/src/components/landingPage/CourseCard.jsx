import { Star, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://localhost') || url.startsWith('https://localhost')) {
    return url.replace(/^https?:\/\/localhost:\d+/, '');
  }
  return url;
};

export default function CourseCard({ lesson, isCompleted, fallbackThumb }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div
      className={`rounded-lg border-[1.5px] overflow-hidden flex flex-col p-4 transition-all duration-200 cursor-pointer
        ${isCompleted
          ? "border-green-200 hover:border-green-300"
          : "bg-[rgba(255,246,234,1)] border-[#e8ecef] hover:border-[#fddfd0]"
        }
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1`}
    >
      {/* Thumbnail */}
      <div className="w-full overflow-hidden rounded-[20px] bg-gray-100 relative">
        <img
          src={normalizeUrl(lesson.thumbnailUrl) || fallbackThumb}
          alt={lesson.title}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[16/10] object-cover block transition-transform duration-300 group-hover:scale-105"
        />
        {isCompleted && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full font-[Rubik,sans-serif]">
            <CheckCircle size={16} color="#fff" />
            <span>مكتمل</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-[18px] px-[18px] pb-5 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-[#252c32] mb-2 leading-snug">{lesson.title}</h3>
        <p className="text-[13px] text-[#868687] leading-relaxed flex-1 mb-3.5 line-clamp-2">
          {lesson.description}
        </p>

        <div className="flex items-center justify-between text-[13px] text-[#868687] mb-3.5">
          <span className="flex items-center gap-1">
            <Star size={13} color="#FFC107" fill={isCompleted ? "#FFC107" : "none"} />
            {lesson.avgRating > 0 ? lesson.avgRating.toFixed(1) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} color="#EB6837" />
            {lesson.duration || "—"}
          </span>
        </div>

        <button
          className={`w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors duration-200 font-[Rubik,sans-serif]
            ${isCompleted
              ? "bg-transparent text-green-500 border-[1.5px] border-green-500 hover:bg-green-50"
              : "bg-[#EB6837] text-white border-none hover:bg-[#c14c21]"
            }`}
          onClick={() => navigate(isAuthenticated ? `/Learnnow/${lesson._id}` : "/login")}
        >
          {isCompleted ? "راجع الدرس" : "تعلم الآن"}
        </button>
      </div>
    </div>
  );
}



// import { Star, Clock, CheckCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

// export default function CourseCard({ lesson, isCompleted, fallbackThumb }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   return (
//     <div
//       className={`rounded-lg border-[1.5px] overflow-hidden flex flex-col transition-all duration-200 cursor-pointer
//         ${isCompleted
//           ? "border-green-200 hover:border-green-300 bg-white"
//           : "bg-[rgba(255,246,234,1)] border-[#e8ecef] hover:border-[#fddfd0]"
//         }
//         hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1`}
//     >
//       {/* Thumbnail */}
//       <div className="w-full overflow-hidden bg-gray-100 relative">
//         <img
//           src={normalizeUrl(lesson.thumbnailUrl) || fallbackThumb}
//           alt={lesson.title}
//           loading="lazy"
//           decoding="async"
//           className="w-full aspect-[16/10] object-cover block transition-transform duration-300 group-hover:scale-105"
//         />
//         {isCompleted && (
//           <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full font-[Rubik,sans-serif]">
//             <CheckCircle size={14} color="#fff" />
//             <span>مكتمل</span>
//           </div>
//         )}
//       </div>

//       {/* Body */}
//       <div className="p-4 flex-1 flex flex-col">
//         <h3 className="text-[15px] font-bold text-[#252c32] mb-2 leading-snug">{lesson.title}</h3>
//         <p className="text-[13px] text-[#868687] leading-relaxed flex-1 mb-3.5 line-clamp-2">
//           {lesson.description}
//         </p>

//         <div className="flex items-center justify-between text-[13px] text-[#868687] mb-3.5">
//           <span className="flex items-center gap-1">
//             <Star size={13} color="#FFC107" fill={isCompleted ? "#FFC107" : "none"} />
//             {lesson.avgRating > 0 ? lesson.avgRating.toFixed(1) : "—"}
//           </span>
//           <span className="flex items-center gap-1">
//             <Clock size={13} color="#EB6837" />
//             {lesson.duration || "—"}
//           </span>
//         </div>

//         <button
//           className={`w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors duration-200 font-[Rubik,sans-serif]
//             ${isCompleted
//               ? "bg-transparent text-green-500 border-[1.5px] border-green-500 hover:bg-green-50"
//               : "bg-[#EB6837] text-white border-none hover:bg-[#c14c21]"
//             }`}
//           onClick={() => navigate(isAuthenticated ? `/Learnnow/${lesson._id}` : "/login")}
//         >
//           {isCompleted ? "راجع الدرس" : "تعلم الآن"}
//         </button>
//       </div>
//     </div>
//   );
// }