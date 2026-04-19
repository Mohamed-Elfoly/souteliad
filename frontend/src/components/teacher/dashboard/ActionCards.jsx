import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import add  from "../../../assets/images/Frame 1984077838.png";
import add2 from "../../../assets/images/Frame 1984077847.png";

const ALL_CARDS = [
  { label: "إضافة درس جديد",         img: add,  route: "/AddLessonPage", permission: "canManageLessons" },
  { label: "إضافة أسئلة الامتحانات", img: add2, route: "/AddQuizPage",   permission: "canManageQuizzes" },
];

export default function ActionCards() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const perms = user?.permissions || {};

  const cards = ALL_CARDS.filter((c) => perms[c.permission]);

  if (cards.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-5 mb-8" dir="rtl">
      {cards.map(({ label, img, route }) => (
        <button
          key={route}
          onClick={() => navigate(route)}
          className="flex flex-1 min-w-[220px] items-center gap-3 bg-[#fef2f2] border border-[#F9D0C1] rounded-3xl px-4 py-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
        >
          <div className="shrink-0 flex items-center justify-center w-[88px] h-12">
            <img src={img} alt="" className="w-[88px] h-12 object-contain" />
          </div>
          <span className="text-xl font-black text-[#373D41]">{label}</span>
        </button>
      ))}
    </div>
  );
}