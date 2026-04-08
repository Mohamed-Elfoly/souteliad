import { FileText } from 'lucide-react';

export default function EmptyState({ message = 'لا توجد بيانات', icon: Icon = FileText }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 select-none">
      <Icon size={52} strokeWidth={1} className="mb-3 text-gray-300" />
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}