import { X, Lock, Unlock, Trash2 } from "lucide-react";

export default function BulkActionsBar({ selectedCount, onClear, onBulkActivate, onBulkDeactivate, onBulkDelete }) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#e8673a] text-white rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3 shadow-lg shadow-orange-200">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm">تم تحديد {selectedCount} مستخدم</span>
        <button onClick={onClear} className="text-orange-200 hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onBulkActivate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <Unlock size={13} />
          تفعيل
        </button>
        <button
          onClick={onBulkDeactivate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors"
        >
          <Lock size={13} />
          تعطيل
        </button>
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-xs font-semibold transition-colors"
        >
          <Trash2 size={13} />
          حذف
        </button>
      </div>
    </div>
  );
}