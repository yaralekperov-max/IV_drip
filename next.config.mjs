/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Медданные (152-ФЗ) и вся инфраструктура — только в российском контуре (Яндекс Облако).
  // Здесь позже настроим домены Object Storage для next/image и заголовки безопасности.
};

export default nextConfig;
