import { useState, useEffect } from "react";

function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Google Drive
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch) return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;

  return null;
}

export function VideoPreview({ url }) {
  if (!url) return null;
  const embedUrl = getEmbedUrl(url);
  if (embedUrl) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          title="معاينة الفيديو"
        />
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-2xl overflow-hidden aspect-video bg-black">
      <video className="w-full h-full" controls playsInline src={url} />
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