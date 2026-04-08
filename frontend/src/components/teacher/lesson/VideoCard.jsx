import { Video } from "lucide-react";
import { VideoPreview } from "./MediaPreview";

/**
 * VideoCard
 * Handles: video URL input + live YouTube/MP4 preview
 *
 * Props:
 *   register, errors  – from react-hook-form
 *   videoUrl          – watched value for live preview
 */
export default function VideoCard({ register, errors, videoUrl }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
        <Video size={15} className="text-orange-500" />
        فيديو الدرس
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">رابط الفيديو</label>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=... أو رابط MP4 مباشر"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50"
          {...register("videoUrl")}
        />
        {errors.videoUrl && (
          <p className="text-red-500 text-xs mt-1">{errors.videoUrl.message}</p>
        )}
        <VideoPreview url={videoUrl} />
      </div>
    </div>
  );
}
