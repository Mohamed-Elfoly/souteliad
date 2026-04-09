import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import testimonialBg from "../../assets/images/testmonial_bg.jpg";
import testimonialFlower from "../../assets/images/testmonial_flower.jpg";

const testimonials = [
  {
    text: "بصراحة المستوى الأول من صوت اليد فرق مع ابني جداً، لأول مرة يحفظ حروف وأرقام بلغة الإشارة بطريقة ممتعة. الاختبارات بالكاميرا خلته يتحمس ويفتح التطبيق لوحده كل يوم.",
    name: "منى السيد",
  },
  {
    text: "المنصة سهلة جداً وبسيطة، حسيت إن التعلم بقى ممتع ومش معقد. أول مرة أحس بثقة وأنا بأستخدم لغة الإشارة في تواصلي اليومي.",
    name: "أحمد علي",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section
      dir="rtl"
      className="relative px-5 md:px-12 xl:px-[100px] py-16 md:py-20 bg-white text-center overflow-hidden"
    >
      <span className="inline-block bg-[rgba(235,104,55,0.09)] text-[#EB6837] px-[18px] py-1.5 rounded-full text-[13px] font-semibold mb-3.5">
        آراء مستخدمينا
      </span>
      <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold text-[#252c32] mb-3.5">
        رحلة صوت اليد بعيون مستخدميه
      </h2>
      <p className="text-[clamp(0.9rem,1.5vw,1rem)] text-[#868687] leading-relaxed max-w-[600px] mx-auto mb-10">
        آلاف المتعلمين يثقون في صوت اليد لتعلم لغة الإشارة بطريقة ممتعة وفعالة.
      </p>

      {/* Card */}
      <div className="relative max-w-[680px] mx-auto mt-20">
        {/* Blob background */}
        <img
          src={testimonialBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain opacity-80 rounded-[32px] scale-150 pointer-events-none select-none"
          style={{ zIndex: 0 }}
        />

        {/* Flower decoration — hidden on very small screens */}
        <img
          src={testimonialFlower}
          alt=""
          aria-hidden="true"
          className="hidden sm:block absolute -top-40 -right-25 w-28 md:w-36 pointer-events-none select-none"
          style={{ zIndex: 2 }}
        />

        {/* Card content */}
        <div
          className="relative   rounded-3xl px-6 md:px-10 pt-10 pb-8 text-right  "
          style={{ zIndex: 1 }}
        >
          {/* Quote mark */}
          {/* <span className="absolute top-2 right-6 text-[70px] text-[#EB6837] opacity-[0.12] leading-none font-serif select-none pointer-events-none">
            "
          </span> */}

          <p
            key={current}
            className="text-[clamp(0.95rem,2vw,1.05rem)] text-[#555] leading-[1.9] mb-6"
            style={{ animation: "lp-fade 0.35s ease" }}
          >
            {testimonials[current].text}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <span className="text-base font-bold text-[#252c32]">
              {testimonials[current].name}
            </span>
            <div className="flex gap-2.5">
              <NavBtn onClick={prev} aria-label="السابق">
                <ChevronRight size={18} />
              </NavBtn>
              <NavBtn onClick={next} aria-label="التالي">
                <ChevronLeft size={18} />
              </NavBtn>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`testimonial ${i + 1}`}
            className={`w-2 h-2 rounded-full border-none p-0 cursor-pointer transition-all duration-200
              ${i === current
                ? "bg-[#EB6837] scale-[1.4]"
                : "bg-[#e0e4e8]"
              }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes lp-fade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function NavBtn({ onClick, children, ...props }) {
  return (
    <button
      onClick={onClick}
      {...props}
      className="w-10 h-10 rounded-full border-[1.5px] border-[#e0e4e8] bg-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#EB6837] hover:border-[#EB6837] hover:text-white"
    >
      {children}
    </button>
  );
}