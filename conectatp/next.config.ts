/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignora los errores de TypeScript en la compilación de Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora las advertencias de código durante el build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;