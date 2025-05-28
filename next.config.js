/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true, // 允许加载外部 ESM 模块
    appDir: true,
    serverComponentsExternalPackages: ['next-auth'],
  },
  transpilePackages: [  "@ant-design", "antd", "rc-util", "rc-pagination", "rc-picker", "rc-input" ]
}

module.exports = nextConfig
