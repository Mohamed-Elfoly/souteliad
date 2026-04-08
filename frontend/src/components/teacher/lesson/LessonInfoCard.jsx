import { ChevronDown } from "lucide-react";

/**
 * LessonInfoCard
 * Handles: title, description, level (existing/new), lesson order, duration
 *
 * Props:
 *   register, errors, setValue  – from react-hook-form
 *   levels                      – array of level objects
 *   levelMode                   – "existing" | "new"
 *   onLevelModeSwitch           – (mode) => void
 *   newLevelTitle, setNewLevelTitle
 *   newLevelOrder, setNewLevelOrder
 */
export default function LessonInfoCard({
  register,
  errors,
  setValue,
  levels,
  levelMode,
  onLevelModeSwitch,
  newLevelTitle,
  setNewLevelTitle,
  newLevelOrder,
  setNewLevelOrder,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h2 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
        معلومات الدرس الأساسية
      </h2>

      {/* ── Title ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">عنوان الدرس</label>
        <input
          type="text"
          placeholder="أدخل عنوان الدرس"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* ── Description ── */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          وصف الدرس <span className="text-gray-400 font-normal">(اختياري)</span>
        </label>
        <textarea
          rows={3}
          placeholder="أدخل وصفاً مختصراً للدرس"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 resize-none"
          {...register("description")}
        />
      </div>

      {/* ── Level ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-gray-700">المستوى</label>
          <div className="flex bg-gray-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => onLevelModeSwitch("existing")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                levelMode === "existing" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"
              }`}
            >
              موجود
            </button>
            <button
              type="button"
              onClick={() => onLevelModeSwitch("new")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                levelMode === "new" ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"
              }`}
            >
              + مستوى جديد
            </button>
          </div>
        </div>

        {/* Hidden field for zod validation */}
        <input type="hidden" {...register("levelId")} />

        {levelMode === "existing" ? (
          <div className="relative">
            <select
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
              onChange={(e) => setValue("levelId", e.target.value, { shouldValidate: true })}
              defaultValue=""
            >
              <option value="">اختر المستوى</option>
              {levels.map((lvl) => (
                <option key={lvl._id} value={lvl._id}>
                  {lvl.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="اسم المستوى الجديد"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
              value={newLevelTitle}
              onChange={(e) => setNewLevelTitle(e.target.value)}
            />
            <input
              type="number"
              min="1"
              placeholder="ترتيب المستوى (مثال: 4)"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
              value={newLevelOrder}
              onChange={(e) => setNewLevelOrder(e.target.value)}
            />
          </div>
        )}

        {errors.levelId && levelMode === "existing" && (
          <p className="text-red-500 text-xs mt-1">{errors.levelId.message}</p>
        )}
      </div>

      {/* ── Order + Duration ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">ترتيب الدرس</label>
          <input
            type="number"
            min="1"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            {...register("lessonOrder")}
          />
          {errors.lessonOrder && (
            <p className="text-red-500 text-xs mt-1">{errors.lessonOrder.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            مدة الفيديو <span className="text-gray-400 font-normal">(اختياري)</span>
          </label>
          <input
            type="text"
            placeholder="مثال: 12:30"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-gray-50"
            {...register("duration")}
          />
        </div>
      </div>
    </div>
  );
}