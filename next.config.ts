/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Para produção, é recomendável configurar corretamente o ESLint
    // e remover essa opção, mas manter por agora para facilitar o desenvolvimento
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Para produção, é recomendável corrigir erros de TypeScript
    // e remover essa opção, mas manter por agora para facilitar o desenvolvimento
    ignoreBuildErrors: true,
  },
  images: {
    // Habilitar a otimização automática de imagens para melhor desempenho
    unoptimized: false,
    // Configuração para imagens otimizadas
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Melhorar o desempenho de produção
  // Configurações de produção
  productionBrowserSourceMaps: false,
}

export default nextConfig
