const variants = {
  active:   "bg-green-50 text-green-700 border border-green-200",
  inactive: "bg-red-50 text-red-600 border border-red-200",
  pending:  "bg-yellow-50 text-yellow-700 border border-yellow-200",
  teacher:  "bg-blue-50 text-blue-700 border border-blue-200",
  student:  "bg-purple-50 text-purple-700 border border-purple-200",
  admin:    "bg-orange-50 text-orange-700 border border-orange-200",
};

const labels = {
  active:   "نشط",
  inactive: "معطل",
  pending:  "معلق",
  teacher:  "معلم",
  student:  "طالب",
  admin:    "مشرف",
};

export default function Badge({ variant = "active", label, className = "" }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.active} ${className}`}>
      {label || labels[variant]}
    </span>
  );
}