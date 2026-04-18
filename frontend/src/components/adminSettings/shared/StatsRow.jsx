export default function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3 shadow-sm"
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${stat.bgColor}`}
          >
            {stat.icon}
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}