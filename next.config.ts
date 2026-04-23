import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Uzak görsel kaynakları buraya eklenebilir
    // remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },

  // Güvenlik ve performans HTTP başlıkları
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Clickjacking koruması
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // MIME sniffing koruması
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer politikası
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // XSS koruması (modern tarayıcılarda CSP ile desteklenir)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Permissions Policy — gereksiz tarayıcı API'lerini kapat
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
        ],
      },
      {
        // Statik varlıklar için uzun cache süresi
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Admin ve API route'larını cache'leme
        source: "/api/(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
    ];
  },

  // Gereksiz X-Powered-By başlığını kaldır
  poweredByHeader: false,

  // Strict mode — React double-render ile hataları erken yakala
  reactStrictMode: true,
};

export default nextConfig;
