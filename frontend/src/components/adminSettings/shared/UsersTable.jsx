import { Pencil, X, Lock, Unlock, ChevronUp, ChevronDown } from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./Badge";
import Toggle from "./Toggle";

export default function UsersTable({
  users,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
  sortKey,
  sortDir,
  onSort,
  selectedIds,
  onSelectOne,
  onSelectAll,
}) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u._id || u.id));

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span className="text-gray-300 text-xs ml-1">↕</span>;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="text-[#e8673a] ml-1" />
      : <ChevronDown size={13} className="text-[#e8673a] ml-1" />;
  };

  const thClass = "px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 whitespace-nowrap";
  const tdClass = "px-4 py-3 text-sm text-gray-700";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className={`${thClass} w-10`}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#e8673a] focus:ring-[#e8673a]"
                />
              </th>
              <th
                className={`${thClass} cursor-pointer hover:text-gray-700`}
                onClick={() => onSort("firstName")}
              >
                <span className="flex items-center gap-1">الاسم <SortIcon col="firstName" /></span>
              </th>
              <th className={thClass}>البريد الإلكتروني</th>
              {/* <th className={thClass}>رقم الهاتف</th> */}
              <th
                className={`${thClass} cursor-pointer hover:text-gray-700`}
                onClick={() => onSort("role")}
              >
                <span className="flex items-center gap-1">الدور <SortIcon col="role" /></span>
              </th>
              <th
                className={`${thClass} cursor-pointer hover:text-gray-700`}
                onClick={() => onSort("active")}
              >
                <span className="flex items-center gap-1">الحالة <SortIcon col="active" /></span>
              </th>
              <th className={thClass}>الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                  لا توجد نتائج
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const uid = user._id || user.id;
                const isActive = user.active !== false;
                const fullName = `${user.firstName} ${user.lastName}`;
                return (
                  <tr
                    key={uid}
                    className={`hover:bg-orange-50/30 transition-colors ${
                      selectedIds.includes(uid) ? "bg-orange-50/50" : ""
                    }`}
                  >
                    <td className={tdClass}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(uid)}
                        onChange={(e) => onSelectOne(uid, e.target.checked)}
                        className="rounded border-gray-300 text-[#e8673a] focus:ring-[#e8673a]"
                      />
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-3">
                        <Avatar name={fullName}  size="sm" />
                        <div>
                          <div className="font-semibold text-gray-900">{fullName}</div>
                          {user.specialty && (
                            <div className="text-xs text-gray-400 truncate max-w-[150px]">{user.specialty}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={`${tdClass} max-w-[180px]`}>
                      <span className="truncate block" title={user.email}>{user.email}</span>
                    </td>
                    {/* <td className={tdClass}>
                      <span dir="ltr">{user.phoneNum || "—"}</span>
                    </td> */}
                    <td className={tdClass}>
                      <Badge variant={user.role === "teacher" ? "teacher" : user.role === "admin" ? "admin" : "student"} />
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-2">
                        <Toggle
                          checked={isActive}
                          onChange={() => onToggleActive(uid, !isActive)}
                          disabled={isLoading}
                          size="sm"
                        />
                        <span className={`text-xs font-medium ${isActive ? "text-green-600" : "text-red-500"}`}>
                          {isActive ? "نشط" : "معطل"}
                        </span>
                      </div>
                    </td>
                    <td className={tdClass}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(user)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#e8673a] hover:bg-orange-50 transition-all"
                          title="تعديل"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onToggleActive(uid, !isActive)}
                          disabled={isLoading}
                          className={`p-1.5 rounded-lg transition-all ${
                            isActive
                              ? "text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                              : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={isActive ? "تعطيل" : "تفعيل"}
                        >
                          {isActive ? <Lock size={15} /> : <Unlock size={15} />}
                        </button>
                        <button
                          onClick={() => onDelete(uid)}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="حذف"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {users.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 text-xs text-gray-500 flex items-center justify-between">
          <span>إجمالي: {users.length} مستخدم</span>
          {selectedIds.length > 0 && (
            <span className="text-[#e8673a] font-medium">تم تحديد {selectedIds.length}</span>
          )}
        </div>
      )}
    </div>
  );
}