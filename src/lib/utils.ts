import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Metni URL dostu bir slug'a dönüştürür.
 * Türkçe karakter desteği ile birlikte.
 */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I",
    ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
  };

  let slug = text;
  Object.keys(trMap).forEach((key) => {
    slug = slug.replace(new RegExp(key, "g"), trMap[key]);
  });

  return slug
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Google Drive video URL'sini embed URL'ine dönüştürür.
 * Input: https://drive.google.com/file/d/ABC123/view
 * Output: https://drive.google.com/file/d/ABC123/preview
 */
export function toGoogleDriveEmbedUrl(url: string): string {
  if (!url) return "";

  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  if (url.includes("drive.google.com/file/d/") && url.includes("/preview")) {
    return url;
  }

  return "";
}

/**
 * YouTube video URL'sini embed URL'ine dönüştürür.
 * Input: https://www.youtube.com/watch?v=ABC123
 * Output: https://www.youtube.com/embed/ABC123
 * Also supports youtu.be short URLs
 */
export function toYouTubeEmbedUrl(url: string): string {
  if (!url) return "";

  let videoId = "";

  if (url.includes("youtube.com/shorts/")) {
    const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match) videoId = match[1];
  } else if (url.includes("youtube.com/watch")) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) videoId = match[1];
  } else if (url.includes("youtu.be/")) {
    const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) videoId = match[1];
  } else if (url.includes("youtube.com/embed/")) {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (match) videoId = match[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  return "";
}

/**
 * Video URL'inin türünü belirler.
 * Returns: 'youtube' | 'google-drive' | 'unknown' | ''
 */
export function getVideoType(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("drive.google.com")) return "google-drive";
  return "unknown";
}

/**
 * Video URL'inin geçerli bir URL olup olmadığını kontrol eder.
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return url.includes("drive.google.com");
  } catch {
    return false;
  }
}
