// 当前登录用户。
// 字段与后端 JwtPayload（apps/api/src/auth/auth.service.ts）保持一致：
// 后端签发 JWT 时用的就是 id / email / name 这三个字段
export interface User {
  id: string;
  email: string;
  name: string;
}

// POST /auth/login
export interface LoginPayload {
  email: string;
  password: string;
}

// POST /auth/login 的返回：后端只返回 access_token
export interface LoginResponse {
  access_token: string;
}

// POST /auth/register
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}
