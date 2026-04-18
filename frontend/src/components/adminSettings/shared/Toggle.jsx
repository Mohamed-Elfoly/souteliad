export default function Toggle({ checked, onChange, disabled = false, size = "md" }) {
  const sizes = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
  };
  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#e8673a] focus:ring-offset-2 ${s.track} ${
        checked ? "bg-[#e8673a]" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block ${s.thumb} rounded-full bg-white shadow transform transition-transform duration-200 ${
          checked ? s.translate : "translate-x-0.5"
        }`}
      />
    </button>
  );
}