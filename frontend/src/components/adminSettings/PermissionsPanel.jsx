import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeachersManage, updateUser } from "../../api/userApi";
import toast from "react-hot-toast";
import { Save, Search } from "lucide-react";
import Avatar from "./shared/Avatar";
import Toggle from "./shared/Toggle";
import Badge from "./shared/Badge";

const PERMISSIONS = [
  { key: "canViewReports",  label: "الوصول للتقارير",  description: "يمكنه عرض تقارير الطلاب والإحصائيات" },
  { key: "canDeleteContent", label: "حذف المحتوى",    description: "يمكنه حذف المنشورات والتعليقات" },
  { key: "canManageLessons", label: "إدارة الدروس",   description: "يمكنه إضافة وتعديل وحذف الدروس" },
  { key: "canManageQuizzes", label: "إدارة الاختبارات", description: "يمكنه إنشاء وتعديل الاختبارات" },
  { key: "canDeleteLevel",  label: "حذف المستويات",   description: "يمكنه حذف المستويات وجميع دروسها" },
];

export default function PermissionsPanel() {
  const queryClient = useQueryClient();
  const [permsState, setPermsState] = useState({});
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["teachers-manage"],
    queryFn: getTeachersManage,
  });
  const users = data?.data?.data?.data || [];

  useEffect(() => {
    if (!users.length) return;
    const init = {};
    users.forEach((u) => {
      const id = u._id || u.id;
      init[id] = {
        canViewReports: u.permissions?.canViewReports || false,
        canDeleteContent: u.permissions?.canDeleteContent || false,
        canManageLessons: u.permissions?.canManageLessons || false,
        canManageQuizzes: u.permissions?.canManageQuizzes || false,
        canDeleteLevel: u.permissions?.canDeleteLevel || false,
      };
    });
    setPermsState(init);
    setDirty(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const setUserPerm = (id, key, value) => {
    setPermsState((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));
    setDirty(true);
  };

  const setAllPerm = (key, value) => {
    setPermsState((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => { next[id] = { ...next[id], [key]: value }; });
      return next;
    });
    setDirty(true);
  };

  const saveMutation = useMutation({
    mutationFn: ({ id, permissions }) => updateUser(id, { permissions }),
  });

  const handleSave = async () => {
    try {
      await Promise.all(
        users.map((u) => {
          const id = u._id || u.id;
          return saveMutation.mutateAsync({ id, permissions: permsState[id] });
        })
      );
      toast.success("تم حفظ الصلاحيات بنجاح");
      queryClient.invalidateQueries(["teachers-manage"]);
      setDirty(false);
    } catch {
      toast.error("خطأ في حفظ الصلاحيات");
    }
  };

  const filtered = useMemo(() =>
    users.filter((u) => {
      const q = search.toLowerCase();
      return !q || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }),
    [users, search]
  );

  const getPermCount = (id) =>
    Object.values(permsState[id] || {}).filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">إدارة الصلاحيات</h2>
            <p className="text-sm text-gray-500 mt-0.5">تحكم في صلاحيات كل معلم بشكل منفصل</p>
          </div>
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                ● تغييرات غير محفوظة
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || !dirty}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#e8673a] text-white rounded-xl text-sm font-semibold hover:bg-[#d45a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-orange-200"
            >
              <Save size={15} />
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ الصلاحيات"}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk permission toggles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-700 mb-4">تطبيق على الجميع</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PERMISSIONS.map((perm) => {
            const allOn = users.length > 0 && users.every((u) => permsState[u._id || u.id]?.[perm.key]);
            return (
              <div key={perm.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-700">{perm.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{perm.description}</p>
                </div>
                <Toggle
                  checked={allOn}
                  onChange={(v) => setAllPerm(perm.key, v)}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="البحث عن معلم..."
          className="w-full max-w-sm pr-9 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e8673a]/30 focus:border-[#e8673a]"
        />
      </div>

      {/* Per-user permissions */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-[#e8673a] border-t-transparent rounded-full mx-auto mb-3" />
          جاري التحميل...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">المعلم</th>
                  {PERMISSIONS.map((p) => (
                    <th key={p.key} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                      {p.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">الصلاحيات الممنوحة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => {
                  const id = user._id || user.id;
                  const perms = permsState[id] || {};
                  return (
                    <tr key={id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${user.firstName} ${user.lastName}`} src={user.profilePicture} size="sm" />
                          <div>
                            <div className="font-semibold text-sm text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      {PERMISSIONS.map((perm) => (
                        <td key={perm.key} className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            <Toggle
                              checked={perms[perm.key] || false}
                              onChange={(v) => setUserPerm(id, perm.key, v)}
                              size="sm"
                            />
                          </div>
                        </td>
                      ))}
                      <td className="px-4 py-4 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          getPermCount(id) === PERMISSIONS.length
                            ? "bg-green-50 text-green-700"
                            : getPermCount(id) > 0
                            ? "bg-orange-50 text-orange-700"
                            : "bg-gray-50 text-gray-500"
                        }`}>
                          {getPermCount(id)} / {PERMISSIONS.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-50">
            {filtered.map((user) => {
              const id = user._id || user.id;
              const perms = permsState[id] || {};
              return (
                <div key={id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={`${user.firstName} ${user.lastName}`} src={user.profilePicture} size="md" />
                    <div>
                      <div className="font-semibold text-sm text-gray-900">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                    <span className={`mr-auto text-xs font-bold px-2 py-1 rounded-full ${
                      getPermCount(id) > 0 ? "bg-orange-50 text-orange-700" : "bg-gray-50 text-gray-500"
                    }`}>
                      {getPermCount(id)}/{PERMISSIONS.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {PERMISSIONS.map((perm) => (
                      <div key={perm.key} className="flex items-center justify-between py-1.5 px-3 bg-gray-50 rounded-lg">
                        <span className="text-xs font-medium text-gray-700">{perm.label}</span>
                        <Toggle
                          checked={perms[perm.key] || false}
                          onChange={(v) => setUserPerm(id, perm.key, v)}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}