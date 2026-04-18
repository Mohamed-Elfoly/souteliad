export default function Avatar({ src, name = "", size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const colors = [
    "bg-orange-100 text-orange-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-purple-100 text-purple-700",
    "bg-rose-100 text-rose-700",
  ];
  const colorIdx = name.charCodeAt(0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${colors[colorIdx]} rounded-full flex items-center justify-center font-bold flex-shrink-0 ${className}`}
    >
      {initials || "؟"}
    </div>
  );
}