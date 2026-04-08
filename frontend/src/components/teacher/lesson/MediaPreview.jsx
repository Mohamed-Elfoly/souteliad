import { useState, useEffect } from "react";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

export function VideoPreview({ url }) {
  if (!url) return null;
  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="معاينة الفيديو"
        />
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-2xl overflow-hidden aspect-video bg-black">
      <video className="w-full h-full" controls src={url} />
    </div>
  );
}

export function ImagePreview({ url }) {
  const [error, setError] = useState(false);
  useEffect(() => setError(false), [url]);
  if (!url) return null;
  if (error) return (
    <div className="mt-2 p-3 rounded-xl bg-red-50 text-red-500 text-sm text-center">
      تعذّر تحميل الصورة — تحقق من الرابط
    </div>
  );
  return (
    <div className="mt-3 rounded-2xl overflow-hidden max-h-48">
      <img
        className="w-full h-full object-cover"
        src={url}
        alt="معاينة الصورة"
        onError={() => setError(true)}
        onLoad={() => setError(false)}
      />
    </div>
  );
}