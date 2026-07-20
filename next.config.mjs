/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Портируемая сборка: самодостаточный сервер в .next/standalone.
  // Один и тот же образ разворачивается и на демо-площадке, и в Яндекс Облаке (РФ, прод).
  output: "standalone",

  // Картинки из Object Storage (Яндекс Облако). Домены — на будущее (next/image).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "storage.yandexcloud.net" },
      { protocol: "https", hostname: "*.storage.yandexcloud.net" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // HSTS действует только по HTTPS (в проде за TLS-терминатором).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
