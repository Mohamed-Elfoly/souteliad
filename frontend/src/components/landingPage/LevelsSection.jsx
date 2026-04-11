// import CourseCard from "./CourseCard";

// const LEVEL_IMAGES = ["one", "two", "three", "four"]; // pass as prop or import

// export default function LevelsSection({
//   sortedLevels,
//   effectiveLevelId,
//   setActiveLevelId,
//   lessons,
//   lessonsLoading,
//   completedIds,
//   levelImages,
//   fallbackThumbs,
// }) {
//   return (
//     <section dir="rtl" className="px-5 md:px-10 xl:px-[150px] py-20 bg-[#fefefe] text-center">
//       <span className="inline-block bg-[rgba(235,104,55,0.09)] text-[#EB6837] px-[18px] py-1.5 rounded-full text-[13px] font-semibold mb-3.5">
//         مساراتنا التعليمية
//       </span>
//       <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-[#252c32] mb-3.5">
//         ابدأ رحلتك من أي نقطة
//       </h2>
//       <p className="text-base text-[#868687] leading-relaxed max-w-[600px] mx-auto mb-12">
//         تعلّم لغة الإشارة بسهولة، من الأساسيات إلى الإتقان. مسارات تعليمية
//         تناسب جميع المستويات والأعمار.
//       </p>

//       {/* Tabs */}
//       <div className="flex justify-center gap-3 mb-10 flex-wrap">
//         {sortedLevels.map((level, index) => (
//           <button
//             key={level._id}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-[5px] border-[1.5px] text-sm font-semibold cursor-pointer transition-all duration-200 font-[Rubik,sans-serif]
//               ${effectiveLevelId === level._id
//                 ? "bg-[#EB6837] border-[#EB6837] text-white shadow-[0_4px_14px_rgba(235,104,55,0.35)]"
//                 : "bg-white border-[#e0e4e8] text-[#373d41] hover:border-[#EB6837] hover:text-[#EB6837]"
//               }`}
//             onClick={() => setActiveLevelId(level._id)}
//           >
//             <img src={levelImages[index % levelImages.length]} alt="" className="w-5 h-5 object-contain" loading="lazy" />
//             <span>{level.title}</span>
//           </button>
//         ))}
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
//         {lessonsLoading ? (
//           <div className="col-span-full text-center py-12 text-gray-400 text-[15px]">جاري التحميل...</div>
//         ) : lessons.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-gray-400 text-[15px]">لا توجد دروس لهذا المستوى</div>
//         ) : (
//           lessons.map((lesson, index) => (
//             <CourseCard
//               key={lesson._id}
//               lesson={lesson}
//               isCompleted={completedIds.has(lesson._id)}
//               fallbackThumb={fallbackThumbs[index % fallbackThumbs.length]}
//             />
//           ))
//         )}
//       </div>
//     </section>
//   );
// }


import CourseCard from "./CourseCard";

export default function LevelsSection({
  sortedLevels,
  effectiveLevelId,
  setActiveLevelId,
  lessons,
  lessonsLoading,
  completedIds,
  levelImages,
  fallbackThumbs,
}) {
  return (
    <section dir="rtl" className="px-5 md:px-10 xl:px-[100px] py-16 md:py-20 bg-[#fefefe] text-center">
      <span className="inline-block bg-[rgba(235,104,55,0.09)] text-[#EB6837] px-[18px] py-1.5 rounded-full text-[13px] font-semibold mb-3.5">
        مساراتنا التعليمية
      </span>
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold text-[#252c32] mb-3.5">
        ابدأ رحلتك من أي نقطة
      </h2>
      <p className="text-[clamp(0.9rem,1.5vw,1rem)] text-[#868687] leading-relaxed max-w-[600px] mx-auto mb-10">
        تعلّم لغة الإشارة بسهولة، من الأساسيات إلى الإتقان. مسارات تعليمية
        تناسب جميع المستويات والأعمار.
      </p>

      {/* Tabs — scrollable on mobile */}
      <div className="flex justify-start md:justify-center gap-2.5 mb-10 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap">
        {sortedLevels.map((level, index) => (
          <button
            key={level._id}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[5px] border-[1.5px] text-sm font-semibold cursor-pointer transition-all duration-200 font-[Rubik,sans-serif] whitespace-nowrap flex-shrink-0
              ${effectiveLevelId === level._id
                ? "bg-[#EB6837] border-[#EB6837] text-white shadow-[0_4px_14px_rgba(235,104,55,0.35)]"
                : "bg-white border-[#e0e4e8] text-[#373d41] hover:border-[#EB6837] hover:text-[#EB6837]"
              }`}
            onClick={() => setActiveLevelId(level._id)}
          >
            <img src={levelImages[index % levelImages.length]} alt="" className="w-5 h-5 object-contain" loading="lazy" />
            <span>{level.title}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-right">
        {lessonsLoading ? (
          <div className="col-span-full text-center py-12 text-gray-400 text-[15px]">جاري التحميل...</div>
        ) : lessons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400 text-[15px]">لا توجد دروس لهذا المستوى</div>
        ) : (
          lessons.map((lesson, index) => (
            <CourseCard
              key={lesson._id}
              lesson={lesson}
              isCompleted={completedIds.has(lesson._id)}
              fallbackThumb={fallbackThumbs[index % fallbackThumbs.length]}
            />
          ))
        )}
      </div>
    </section>
  );
}