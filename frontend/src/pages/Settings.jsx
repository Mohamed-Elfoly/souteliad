// import { Lock, Pencil, X, UserPlus } from 'lucide-react';
// import "../styles/login.css";
// import Avatar from '../components/ui/Avatar';
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { getTeachersManage, createUser, deleteUser, updateUser } from "../api/userApi";
// import toast from "react-hot-toast";

// const emptyForm = { firstName: '', lastName: '', email: '', password: '' };
// const emptyEdit = { firstName: '', lastName: '', email: '' };

// export default function Setting() {
//   const queryClient = useQueryClient();
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [permsState, setPermsState] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState(emptyEdit);

//   const { data: usersData, isLoading } = useQuery({
//     queryKey: ['users-settings'],
//     queryFn: () => getTeachersManage(),
//   });

//   const users = usersData?.data?.data?.data || [];

//   // Initialise permissions state from server data whenever users load
//   useEffect(() => {
//     if (users.length === 0) return;
//     const initial = {};
//     users.forEach((u) => {
//       const id = u._id || u.id;
//       initial[id] = {
//         canViewReports: u.permissions?.canViewReports || false,
//         canDeleteContent: u.permissions?.canDeleteContent || false,
//       };
//     });
//     setPermsState(initial);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [usersData]);

//   const setUserPerm = (id, key, value) =>
//     setPermsState((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], [key]: value },
//     }));

//   const deleteMutation = useMutation({
//     mutationFn: (id) => deleteUser(id),
//     onSuccess: () => {
//       toast.success("تم حذف المستخدم بنجاح");
//       queryClient.invalidateQueries({ queryKey: ['users-settings'] });
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "حدث خطأ في حذف المستخدم");
//     },
//   });

//   const toggleMutation = useMutation({
//     mutationFn: ({ id, active }) => updateUser(id, { active }),
//     onSuccess: () => {
//       toast.success("تم تحديث حالة الحساب");
//       queryClient.invalidateQueries({ queryKey: ['users-settings'] });
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "حدث خطأ");
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: (data) => createUser(data),
//     onSuccess: () => {
//       toast.success("تم إضافة المعلم بنجاح");
//       queryClient.invalidateQueries({ queryKey: ['users-settings'] });
//       setForm(emptyForm);
//       setShowForm(false);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "حدث خطأ في إضافة المعلم");
//     },
//   });

//   const editMutation = useMutation({
//     mutationFn: ({ id, data }) => updateUser(id, data),
//     onSuccess: () => {
//       toast.success("تم تحديث بيانات المعلم بنجاح");
//       queryClient.invalidateQueries({ queryKey: ['users-settings'] });
//       setEditingId(null);
//       setEditForm(emptyEdit);
//     },
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "حدث خطأ في تحديث البيانات");
//     },
//   });

//   const savePermsMutation = useMutation({
//     mutationFn: ({ id, permissions }) => updateUser(id, { permissions }),
//   });

//   const openEdit = (user) => {
//     setEditingId(user._id || user.id);
//     setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
//   };

//   const handleEditSubmit = (e, id) => {
//     e.preventDefault();
//     if (!editForm.firstName || !editForm.lastName || !editForm.email) {
//       toast.error("يرجى ملء جميع الحقول");
//       return;
//     }
//     editMutation.mutate({ id, data: editForm });
//   };

//   const handleCreate = (e) => {
//     e.preventDefault();
//     if (!form.firstName || !form.lastName || !form.email || !form.password) {
//       toast.error("يرجى ملء جميع الحقول");
//       return;
//     }
//     createMutation.mutate({ ...form, role: 'teacher' });
//   };

//   const handleSavePerms = async () => {
//     try {
//       await Promise.all(
//         users.map((u) => {
//           const id = u._id || u.id;
//           const permissions = permsState[id];
//           if (!permissions) return Promise.resolve();
//           return savePermsMutation.mutateAsync({ id, permissions });
//         })
//       );
//       toast.success("تم حفظ الصلاحيات بنجاح");
//       queryClient.invalidateQueries({ queryKey: ['users-settings'] });
//     } catch {
//       toast.error("حدث خطأ في حفظ الصلاحيات");
//     }
//   };

//   return (
//     <div className="main-content2">
//       <h1 className="page-title">إعدادات النظام</h1>

//       <div className="page_text_row">
//         <p className='page_text'>إدارة المستخدمين</p>
//         <button className="setting_btn_add" onClick={() => setShowForm((v) => !v)}>
//           <UserPlus size={16} />
//           إضافة معلم جديد
//         </button>
//       </div>

//       {showForm && (
//         <form className="add-teacher-form" onSubmit={handleCreate} dir="rtl">
//           <div className="add-teacher-fields">
//             <input
//               type="text"
//               placeholder="الاسم الأول"
//               value={form.firstName}
//               onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
//             />
//             <input
//               type="text"
//               placeholder="اسم العائلة"
//               value={form.lastName}
//               onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
//             />
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               value={form.email}
//               onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//             />
//             <input
//               type="password"
//               placeholder="كلمة المرور"
//               value={form.password}
//               onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//             />
//           </div>
//           <div className="add-teacher-actions">
//             <button type="submit" className="setting_btn" disabled={createMutation.isPending}>
//               {createMutation.isPending ? 'جاري الإضافة...' : 'إضافة'}
//             </button>
//             <button type="button" className="setting_btn_cancel" onClick={() => { setShowForm(false); setForm(emptyForm); }}>
//               إلغاء
//             </button>
//           </div>
//         </form>
//       )}

//       {isLoading ? (
//         <div className="admin-state">جاري التحميل...</div>
//       ) : (
//         <div className='setting_cards'>
//           {users.map((user) => {
//             const uid = user._id || user.id;
//             const isEditing = editingId === uid;
//             return (
//               <div className='setting_card' key={uid}>
//                 <div className='setting_card_up'>
//                   <div className='setting_card_right'>
//                     <Avatar
//                         src={user.profilePicture}
//                         name={`${user.firstName} ${user.lastName}`}
//                         iconSize={20}
//                         className="setting-card-avatar"
//                       />
//                     <div className='setting_card_right_up'>
//                       <h2>{user.firstName} {user.lastName}</h2>
//                       <p>{user.role}</p>
//                     </div>
//                   </div>
//                   <button
//                     className={`setting_card_left${user.active === false ? ' setting_card_left--inactive' : ''}`}
//                   >
//                     {user.active === false ? 'معطل' : 'نشط'}
//                   </button>
//                 </div>

//                 {isEditing ? (
//                   <form className="add-teacher-form" onSubmit={(e) => handleEditSubmit(e, uid)} dir="rtl" style={{ marginTop: 12 }}>
//                     <div className="add-teacher-fields">
//                       <input
//                         type="text"
//                         placeholder="الاسم الأول"
//                         value={editForm.firstName}
//                         onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
//                       />
//                       <input
//                         type="text"
//                         placeholder="اسم العائلة"
//                         value={editForm.lastName}
//                         onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
//                       />
//                       <input
//                         type="email"
//                         placeholder="البريد الإلكتروني"
//                         value={editForm.email}
//                         onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
//                       />
//                     </div>
//                     <div className="add-teacher-actions">
//                       <button type="submit" className="setting_btn" disabled={editMutation.isPending}>
//                         {editMutation.isPending ? 'جاري الحفظ...' : 'حفظ التعديل'}
//                       </button>
//                       <button type="button" className="setting_btn_cancel" onClick={() => setEditingId(null)}>
//                         إلغاء
//                       </button>
//                     </div>
//                   </form>
//                 ) : (
//                   <div className='setting_card_down'>
//                     <p>{user.email}<br />{user.phoneNum || ''}</p>
//                     <div className='setting_card_down_buttons'>
//                       <button onClick={() => openEdit(user)}>
//                         <Pencil size={20} className='setting_card_down_icon' />تعديل
//                       </button>
//                       <button onClick={() => deleteMutation.mutate(uid)} disabled={deleteMutation.isPending}>
//                         <X size={20} className='setting_card_down_icon' />حذف
//                       </button>
//                       <button onClick={() => toggleMutation.mutate({ id: uid, active: user.active !== false ? false : true })} disabled={toggleMutation.isPending}>
//                         <Lock size={20} className='setting_card_down_icon' />{user.active === false ? 'تفعيل الحساب' : 'تعطيل الحساب'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <p className="page_text">إدارة الصلاحيات</p>
//       <div className="admin-table-wrap">
//         {isLoading ? null : (
//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>اسم المستخدم</th>
//                 <th>الدور الحالي</th>
//                 <th className='permissions-header'>صلاحيات إضافية</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => {
//                 const id = user._id || user.id;
//                 const perms = permsState[id] || {};
//                 return (
//                   <tr key={id}>
//                     <td className="td-center">
//                       <div className='num'>
//                         <input type="checkbox" className="checkbox" />
//                         <span>{index + 1}</span>
//                       </div>
//                     </td>
//                     <td>
//                       <div className="user-cell">
//                         <Avatar
//                             src={user.profilePicture}
//                             name={`${user.firstName} ${user.lastName}`}
//                             iconSize={14}
//                             className="user-avatar"
//                           />
//                         <span>{user.firstName} {user.lastName}</span>
//                       </div>
//                     </td>
//                     <td>{user.role}</td>
//                     <td>
//                       <div className="permissions-cell">
//                         <div className="permission-item">
//                           <span>الوصول للتقارير</span>
//                           <label className="switch">
//                             <input
//                               type="checkbox"
//                               checked={perms.canViewReports || false}
//                               onChange={(e) => setUserPerm(id, 'canViewReports', e.target.checked)}
//                             />
//                             <span className="slider"></span>
//                           </label>
//                         </div>
//                         <div className="permission-item">
//                           <span>القدرة على حذف منشور أو تعليق</span>
//                           <label className="switch">
//                             <input
//                               type="checkbox"
//                               checked={perms.canDeleteContent || false}
//                               onChange={(e) => setUserPerm(id, 'canDeleteContent', e.target.checked)}
//                             />
//                             <span className="slider"></span>
//                           </label>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}
//         <p className="page_text">
//           <button
//             className="setting_btn"
//             onClick={handleSavePerms}
//             disabled={savePermsMutation.isPending}
//           >
//             {savePermsMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import TeachersPanel from "../components/adminSettings/TeachersPanel";
import StudentsPanel from "../components/adminSettings/StudentsPanel";
import PermissionsPanel from "../components/adminSettings/PermissionsPanel";

const tabs = [
  { id: "teachers", label: "المعلمون", icon: "👨‍🏫" },
  { id: "students", label: "الطلاب", icon: "👨‍🎓" },
  { id: "permissions", label: "الصلاحيات", icon: "🔐" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("teachers");

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[Cairo,sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900">إعدادات النظام</h1>
              <p className="text-xs text-gray-500 mt-0.5">إدارة المستخدمين والصلاحيات</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              متصل
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#e8673a] text-[#e8673a]"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "teachers" && <TeachersPanel />}
        {activeTab === "students" && <StudentsPanel />}
        {activeTab === "permissions" && <PermissionsPanel />}
      </div>
    </div>
  );
}