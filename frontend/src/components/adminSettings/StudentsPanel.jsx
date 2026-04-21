import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, createUser, deleteUser, updateUser } from "../../api/userApi";
import toast from "react-hot-toast";
import { UserPlus, LayoutGrid, List } from "lucide-react";

import FilterBar from "./shared/FilterBar";
import UserCard from "./shared/UserCard";
import UsersTable from "./shared/UsersTable";
import UserFormModal from "./shared/UserFormModal";
import BulkActionsBar from "./shared/BulkActionsBar";
import StatsRow from "./shared/StatsRow";

const emptyForm = { firstName: "", lastName: "", email: "", password: "", phoneNum: "", level: "" };

export default function StudentsPanel() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortKey, setSortKey] = useState("firstName");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["all-students"],
    queryFn: () => getAllUsers({ role: "user" }),
  });
  const users = data?.data?.data?.data || [];

  // Unique levels
  const levels = useMemo(() => {
    const set = new Set(users.map((u) => u.level).filter(Boolean));
    return Array.from(set);
  }, [users]);

  // Stats
  const stats = useMemo(() => {
    const active = users.filter((u) => u.active !== false).length;
    const inactive = users.length - active;
    return [
      { label: "إجمالي الطلاب", value: users.length, icon: "👨‍🎓", bgColor: "bg-purple-50" },
      { label: "نشط", value: active, icon: "✅", bgColor: "bg-green-50" },
      { label: "معطل", value: inactive, icon: "🔒", bgColor: "bg-red-50" },
      { label: "محدد", value: selectedIds.length, icon: "☑️", bgColor: "bg-orange-50" },
    ];
  }, [users, selectedIds]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phoneNum || "").includes(q);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && u.active !== false) ||
        (statusFilter === "inactive" && u.active === false);
      const matchLevel =
        levelFilter === "all" || u.level === levelFilter;
      return matchSearch && matchStatus && matchLevel;
    });

    list = [...list].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === "boolean") { aVal = aVal ? 1 : 0; bVal = bVal ? 1 : 0; }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, search, statusFilter, levelFilter, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { toast.success("تم الحذف"); queryClient.invalidateQueries(["all-students"]); },
    onError: (e) => toast.error(e.response?.data?.message || "خطأ في الحذف"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }) => updateUser(id, { active }),
    onSuccess: () => { toast.success("تم تحديث الحالة"); queryClient.invalidateQueries(["all-students"]); },
    onError: (e) => toast.error(e.response?.data?.message || "خطأ"),
  });

  const createMutation = useMutation({
    mutationFn: (d) => createUser(d),
    onSuccess: () => {
      toast.success("تمت إضافة الطالب");
      queryClient.invalidateQueries(["all-students"]);
      closeModal();
    },
    onError: (e) => toast.error(e.response?.data?.message || "خطأ في الإضافة"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("تم التحديث");
      queryClient.invalidateQueries(["all-students"]);
      closeModal();
    },
    onError: (e) => toast.error(e.response?.data?.message || "خطأ في التحديث"),
  });

  const openAdd = () => { setEditingUser(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email || "", level: user.level || "" });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingUser(null); setForm(emptyForm); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      editMutation.mutate({ id: editingUser._id || editingUser.id, data: form });
    } else {
      createMutation.mutate({ ...form, role: "user" });
    }
  };

  // Selection
  const handleSelectOne = (id, checked) =>
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
  const handleSelectAll = (checked) =>
    setSelectedIds(checked ? filtered.map((u) => u._id || u.id) : []);

  // Bulk actions
  const bulkUpdate = async (active) => {
    await Promise.all(selectedIds.map((id) => toggleMutation.mutateAsync({ id, active })));
    setSelectedIds([]);
  };
  const bulkDelete = async () => {
    if (!window.confirm(`حذف ${selectedIds.length} طالب؟`)) return;
    await Promise.all(selectedIds.map((id) => deleteMutation.mutateAsync(id)));
    setSelectedIds([]);
  };

  const isPending = deleteMutation.isPending || toggleMutation.isPending;

  const extraFilters = levels.length > 0 ? (
    <>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">المستوى</label>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e8673a]/30 focus:border-[#e8673a]"
        >
          <option value="all">جميع المستويات</option>
          {levels.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </>
  ) : null;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <StatsRow stats={stats} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          placeholder="البحث عن طالب..."
          extraFilters={extraFilters}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-white shadow text-[#e8673a]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all ${viewMode === "table" ? "bg-white shadow text-[#e8673a]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List size={15} />
            </button>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e8673a] text-white rounded-xl text-sm font-semibold hover:bg-[#d45a2f] transition-colors shadow-sm shadow-orange-200"
          >
            <UserPlus size={15} />
            <span>إضافة طالب</span>
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <BulkActionsBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onBulkActivate={() => bulkUpdate(true)}
        onBulkDeactivate={() => bulkUpdate(false)}
        onBulkDelete={bulkDelete}
      />

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-[#e8673a] border-t-transparent rounded-full mx-auto mb-3" />
          جاري التحميل...
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">لا توجد نتائج</div>
          ) : (
            filtered.map((user) => (
              <UserCard
                key={user._id || user.id}
                user={user}
                onEdit={openEdit}
                onDelete={(id) => deleteMutation.mutate(id)}
                onToggleActive={(id, active) => toggleMutation.mutate({ id, active })}
                isLoading={isPending}
              />
            ))
          )}
        </div>
      ) : (
        <UsersTable
          users={filtered}
          onEdit={openEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
          onToggleActive={(id, active) => toggleMutation.mutate({ id, active })}
          isLoading={isPending}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectOne={handleSelectOne}
          onSelectAll={handleSelectAll}
        />
      )}

      {/* Modal */}
      <UserFormModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        title={editingUser ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
        form={form}
        setForm={setForm}
        isPending={createMutation.isPending || editMutation.isPending}
        isEdit={!!editingUser}
        userType="student"
      />
    </div>
  );
}