import { FileText } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <FileText size={40} strokeWidth={1.2} className="text-gray-300" />
      <p className="text-sm text-gray-400">لا توجد تقارير</p>
    </div>
  );
}