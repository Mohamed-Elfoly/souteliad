import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { ImagePreview } from "./MediaPreview";

export default function ThumbnailCard({ register, errors, setValue, thumbnailUrl }) {
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result);
      setValue("thumbnailUrl", reader.result, { shouldValidate: false });
      // امسح الـ URL input
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setFilePreview(null);
    setValue("thumbnailUrl", "", { shouldValidate: false });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
        <ImageIcon size={15} className="text-[#EB6837]" />
        صورة الدرس{" "}
        <span className="text-gray-400 font-normal text-xs">(اختياري)</span>
      </h2>

      {/* لما في صورة (من جهاز أو URL) تظهر كـ preview مع زرار مسح */}
      {(filePreview || thumbnailUrl) ? (
        <div className="relative">
          <img
            src={filePreview || thumbnailUrl}
            alt="معاينة"
            className="w-full rounded-xl object-cover max-h-48"
            onError={(e) => e.target.style.display = "none"}
          />
          <button
            type="button"
            onClick={() => {
              handleClearFile();
              setValue("thumbnailUrl", "", { shouldValidate: false });
            }}
            className="absolute top-2 left-2 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <>
          {/* URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الصورة</label>
            <input
              type="text"
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50"
              {...register("thumbnailUrl")}
            />
            {errors.thumbnailUrl && (
              <p className="text-red-500 text-xs mt-1">{errors.thumbnailUrl.message}</p>
            )}
          </div>

          {/* File upload */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1.5">أو ارفع صورة من جهازك</p>
            <input
              type="file"
              accept="image/*"
              id="thumbnail-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="thumbnail-upload"
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 transition-colors cursor-pointer block"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <ImageIcon size={20} className="text-[#EB6837]" />
              </div>
              <p className="text-sm text-gray-500">اضغط لاختيار صورة</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP</p>
            </label>
          </div>
        </>
      )}
    </div>
  );
}