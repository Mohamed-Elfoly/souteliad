import { Star } from "lucide-react";

export default function Stars({ count }) {
  return (
    <span className="inline-flex gap-0.5 items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < (count || 0)
              ? "fill-[#EB6837] text-[#EB6837]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
    </span>
  );
}