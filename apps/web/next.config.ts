import type { NextConfig } from "next";

// NestJS 地址，默认与 apps/api/.env 里的 PORT=9500 保持一致
const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:9500";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 前端统一请求 /api/backend/xxx，由 Next 服务器代理到 NestJS。
        // 浏览器视角是"同源请求"，因此不会触发 CORS 预检
        // （后端 enableCors 只放行了 Content-Type，没放行 Authorization）
        source: "/api/backend/:path*",
        destination: `${API_ORIGIN}/:path*`,
      },
    ];
  },
};

export default nextConfig;
