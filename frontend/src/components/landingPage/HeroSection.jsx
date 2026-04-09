// import { useNavigate } from "react-router-dom";
// import useAuth from "../../hooks/useAuth";

// export default function HeroSection({ sortedLevels, publicStats, logoImage }) {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   return (
//     <section
//       dir="rtl"
//       className="flex items-center justify-center gap-16 xl:gap-32 px-5 md:px-12 xl:px-20 py-12 md:py-16 bg-[#fefefe] min-h-[82vh] flex-wrap"
//     >
//       {/* Content */}
//       <div className="flex-1 min-w-0 max-w-[580px]">
//         {/* Badge */}
//         <span className="inline-flex items-center gap-1.5 bg-[rgba(235,104,55,0.09)] border border-[rgba(235,104,55,0.28)] text-[#EB6837] px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
//           🤟 منصة تعلم لغة الإشارة العربية
//         </span>

//         <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-snug text-[#252c32] mb-4">
//           تواصل أوضح{" "}
//           <span className="text-[#EB6837]">بلغة الإشارة</span>
//         </h1>

//         <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-[#666] leading-relaxed mb-8">
//           ادخل إلى عالمٍ ممتع تتعلّم فيه لغة الإشارة بأسلوب بسيط وواضح.
//           صوت اليد يأخذك في رحلة لطيفة خطوة بخطوة مع تجربة تفاعلية ممتعة
//           تناسب جميع الأعمار.
//         </p>

//         {/* CTA Row */}
//         <div className="flex items-center gap-5 flex-wrap mb-10">
//           <button
//             className="bg-[#EB6837] text-white border-none px-10 py-4 text-base font-bold rounded-full cursor-pointer transition-all hover:bg-[#c14c21] hover:-translate-y-0.5 font-[Rubik,sans-serif] whitespace-nowrap"
//             onClick={() => navigate(isAuthenticated ? "/Lessons" : "/login")}
//           >
//             ابدأ التعلم الآن
//           </button>
//           <span
//             className="text-[15px] text-[#868687] cursor-pointer font-medium transition-colors hover:text-[#EB6837] underline decoration-transparent hover:decoration-[#EB6837]"
//             onClick={() => navigate(isAuthenticated ? "/Community" : "/login")}
//           >
//             تصفح المجتمع
//           </span>
//         </div>

//         {/* Stats */}
//         <div className="flex items-center gap-7 flex-wrap">
//           <StatItem
//             value={publicStats?.totalUsers != null ? `${publicStats.totalUsers}+` : "..."}
//             label="متعلم"
//           />
//           <div className="w-px h-10 bg-[#e0e4e8]" />
//           <StatItem
//             value={publicStats?.totalLessons != null ? `${publicStats.totalLessons}+` : "..."}
//             label="درس"
//           />
//           <div className="w-px h-10 bg-[#e0e4e8]" />
//           <StatItem
//             value={publicStats?.totalLevels ?? sortedLevels.length ?? "..."}
//             label="مستويات"
//           />
//         </div>
//       </div>

//       {/* Image */}
//       <div className="flex-shrink-0 w-full max-w-[480px] md:max-w-[380px] xl:max-w-[480px]">
//         <img src={logoImage} alt="صوت اليد" className="w-full h-auto object-contain" />
//       </div>
//     </section>
//   );
// }

// function StatItem({ value, label }) {
//   return (
//     <div className="flex flex-col items-center">
//       <span className="text-[26px] font-extrabold text-[#252c32] leading-none">{value}</span>
//       <span className="text-[13px] text-[#868687] mt-1">{label}</span>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function HeroSection({ sortedLevels, publicStats, logoImage }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section
      dir="rtl"
      className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-12 xl:gap-20 px-5 md:px-12 xl:px-20 py-10 md:py-16 bg-[#fefefe] min-h-[80vh]"
    >
      {/* Content */}
      <div className="w-full md:flex-1 md:min-w-0 md:max-w-[580px] text-center md:text-right">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-[rgba(235,104,55,0.09)] border border-[rgba(235,104,55,0.28)] text-[#EB6837] px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
          🤟 منصة تعلم لغة الإشارة العربية
        </span>

        <h1 className="text-[clamp(1.6rem,5vw,2.5rem)] font-extrabold leading-snug text-[#252c32] mb-4">
          تواصل أوضح{" "}
          <span className="text-[#EB6837]">بلغة الإشارة</span>
        </h1>

        <p className="text-[clamp(0.95rem,2vw,1.2rem)] text-[#666] leading-relaxed mb-8">
          ادخل إلى عالمٍ ممتع تتعلّم فيه لغة الإشارة بأسلوب بسيط وواضح.
          صوت اليد يأخذك في رحلة لطيفة خطوة بخطوة مع تجربة تفاعلية ممتعة
          تناسب جميع الأعمار.
        </p>

        {/* CTA Row */}
        <div className="flex items-center justify-center md:justify-start gap-5 flex-wrap mb-10">
          <button
            className="bg-[#EB6837] text-white border-none px-8 py-3.5 text-base font-bold rounded-full cursor-pointer transition-all hover:bg-[#c14c21] hover:-translate-y-0.5 font-[Rubik,sans-serif] whitespace-nowrap"
            onClick={() => navigate(isAuthenticated ? "/Lessons" : "/login")}
          >
            ابدأ التعلم الآن
          </button>
          <span
            className="text-[15px] text-[#868687] cursor-pointer font-medium transition-colors hover:text-[#EB6837] underline decoration-transparent hover:decoration-[#EB6837]"
            onClick={() => navigate(isAuthenticated ? "/Community" : "/login")}
          >
            تصفح المجتمع
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
          <StatItem
            value={publicStats?.totalUsers != null ? `${publicStats.totalUsers}+` : "..."}
            label="متعلم"
          />
          <div className="w-px h-10 bg-[#e0e4e8]" />
          <StatItem
            value={publicStats?.totalLessons != null ? `${publicStats.totalLessons}+` : "..."}
            label="درس"
          />
          <div className="w-px h-10 bg-[#e0e4e8]" />
          <StatItem
            value={publicStats?.totalLevels ?? sortedLevels.length ?? "..."}
            label="مستويات"
          />
        </div>
      </div>

      {/* Image */}
      <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[360px] xl:max-w-[460px] mx-auto md:mx-0 flex-shrink-0">
        <img src={logoImage} alt="صوت اليد" className="w-full h-auto object-contain" />
      </div>
    </section>
  );
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[26px] font-extrabold text-[#252c32] leading-none">{value}</span>
      <span className="text-[13px] text-[#868687] mt-1">{label}</span>
    </div>
  );
}