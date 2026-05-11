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
  
  // file/d/VIDEO_ID/view veya file/d/VIDEO_ID/edit formatını kontrol et
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    // Preview formatını kullan
    return `https://drive.google.com/file/d/${match[1]}/preview?usp=embed_header`;
  }
  
  // Zaten preview formatında ise olduğu gibi döndür
  if (url.includes("drive.google.com/file/d/") && url.includes("/preview")) {
    return url;
  }
  
  return "";
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
