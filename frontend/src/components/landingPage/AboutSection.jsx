// export default function AboutSection({ logo }) {
//   return (
//     <section
//       dir="rtl"
//       className="flex items-center justify-center gap-16 xl:gap-32 px-5 md:px-12 xl:px-20 py-12 md:py-16 bg-[#fefefe] flex-wrap -mt-5"
//     >
//       {/* Content */}
//       <div className="flex-1 min-w-0 max-w-[580px]">
//         <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-extrabold leading-snug text-[#252c32] mb-4 relative">
//           <span className="relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#EB6837] after:rounded-sm after:mt-2.5">
//             من نحن
//           </span>
//         </h1>

//         <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-[#666] leading-relaxed">
//           صوت اليد منصة رقمية لتعلّم لغة الإشارة العربية، تقرّب المسافة بين الصم وضعاف السمع وأسرهم والمجتمع.
//           <br />
//           نقدّم دروسًا بصرية تفاعلية، عبر فيديوهات قصيرة وتمارين خطوة بخطوة، تناسب جميع الأعمار والمستويات.
//           <br />
//           نهدف إلى تمكين المستخدم من استخدام لغة الإشارة بثقة في الحياة اليومية، وجعل التقنية والذكاء الاصطناعي جسرًا حقيقيًا نحو مجتمع أكثر شمولًا وفهمًا للإشارة.
//         </p>
//       </div>

//       {/* Image */}
//       <div className="flex-shrink-0 w-full max-w-[520px] md:max-w-[480px] xl:max-w-[600px]">
//         <img src={logo} alt="صوت اليد" className="w-full h-auto object-contain" />
//       </div>
//     </section>
//   );
// }


export default function AboutSection({ logo }) {
  return (
    <section
      dir="rtl"
      className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 xl:gap-20 px-5 md:px-12 xl:px-20 py-12 md:py-16 bg-[#fefefe]"
    >
      {/* Content */}
      <div className="w-full md:flex-1 md:min-w-0 md:max-w-[580px] text-center md:text-right order-2 md:order-1">
        <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] font-extrabold leading-snug text-[#252c32] mb-4 relative">
          <span className="relative after:content-[''] after:block after:w-16 after:h-1 after:bg-[#EB6837] after:rounded-sm after:mt-2.5 after:mx-auto md:after:mx-0">
            من نحن
          </span>
        </h1>

        <p className="text-[clamp(0.95rem,1.8vw,1.15rem)] text-[#666] leading-relaxed">
          صوت اليد منصة رقمية لتعلّم لغة الإشارة العربية، تقرّب المسافة بين الصم وضعاف السمع وأسرهم والمجتمع.
          <br />
          نقدّم دروسًا بصرية تفاعلية، عبر فيديوهات قصيرة وتمارين خطوة بخطوة، تناسب جميع الأعمار والمستويات.
          <br />
          نهدف إلى تمكين المستخدم من استخدام لغة الإشارة بثقة في الحياة اليومية، وجعل التقنية والذكاء الاصطناعي جسرًا حقيقيًا نحو مجتمع أكثر شمولًا وفهمًا للإشارة.
        </p>
      </div>

      {/* Image */}
      <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] xl:max-w-[500px] mx-auto md:mx-0 flex-shrink-0 order-1 md:order-2">
        <img src={logo} alt="صوت اليد" className="w-full h-auto object-contain" />
      </div>
    </section>
  );
}