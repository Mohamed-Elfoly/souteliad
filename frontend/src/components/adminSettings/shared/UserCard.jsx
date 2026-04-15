import { Pencil, X, Lock, Unlock, Mail, Phone } from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Toggle from "./Toggle";

export default function UserCard({ user, onEdit, onDelete, onToggleActive, isLoading }) {
  const uid = user._id || user.id;
  const isActive = user.active !== false;
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Card Top */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={fullName}  size="lg" />
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-sm truncate">{fullName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.role === "teacher" ? "معلم" : user.role === "admin" ? "مشرف" : "طالب"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <Badge variant={isActive ? "active" : "inactive"} />
            {/* Active Toggle */}
            <Toggle
              checked={isActive}
              onChange={() => onToggleActive(uid, !isActive)}
              disabled={isLoading}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Mail size={13} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phoneNum && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone size={13} className="text-gray-400 flex-shrink-0" />
            <span dir="ltr">{user.phoneNum}</span>
          </div>
        )}
        {user.specialty && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 mt-1">
            {user.specialty}
          </div>
        )}
        {user.level && (
          <div className="text-xs text-[#e8673a] bg-orange-50 rounded-lg px-2.5 py-1.5">
            المستوى: {user.level}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-[#e8673a] hover:text-[#e8673a] hover:bg-orange-50 transition-all"
        >
          <Pencil size={13} />
          تعديل
        </button>
        <button
          onClick={() => onToggleActive(uid, !isActive)}
          disabled={isLoading}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
            isActive
              ? "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
              : "border-green-200 text-green-600 hover:bg-green-50"
          }`}
          title={isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
        >
          {isActive ? <Lock size={13} /> : <Unlock size={13} />}
        </button>
        <button
          onClick={() => onDelete(uid)}
          disabled={isLoading}
          className="flex items-center justify-center py-2 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
          title="حذف"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}