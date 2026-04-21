import { X } from "lucide-react";
import { useEffect } from "react";

const inputClass =
  "w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e8673a]/30 focus:border-[#e8673a] transition-all";

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  form,
  setForm,
  isPending,
  isEdit = false,
  userType = "teacher", // "teacher" | "student"
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">الاسم الأول</label>
              <input
                type="text"
                placeholder="الاسم الأول"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">اسم العائلة</label>
              <input
                type="text"
                placeholder="اسم العائلة"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={inputClass}
              required
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">كلمة المرور</label>
              <input
                type="password"
                placeholder="كلمة المرور"
                value={form.password || ""}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={inputClass}
                required={!isEdit}
              />
            </div>
          )}

          {/* <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">رقم الهاتف</label>
            <input
              type="tel"
              placeholder="+20..."
              value={form.phoneNum || ""}
              onChange={(e) => setForm((f) => ({ ...f, phoneNum: e.target.value }))}
              className={inputClass}
              dir="ltr"
            />
          </div> */}

          {/* {userType === "teacher" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">التخصص</label>
              <input
                type="text"
                placeholder="التخصص (اختياري)"
                value={form.specialty || ""}
                onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                className={inputClass}
              />
            </div>
          )} */}

          {/* {userType === "student" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">المستوى</label>
              <select
                value={form.level || ""}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                className={inputClass}
              >
                <option value="">اختر المستوى</option>
                <option value="مستوى 1">مستوى 1</option>
                <option value="مستوى 2">مستوى 2</option>
                <option value="مستوى 3">مستوى 3</option>
              </select>
            </div>
          )} */}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-[#e8673a] text-white rounded-xl text-sm font-semibold hover:bg-[#d45a2f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}