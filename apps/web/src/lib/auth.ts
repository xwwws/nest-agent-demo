import type { User } from "@/types/user";

// token 存 localStorage。
// 简单直接，但注意：localStorage 只能在浏览器里访问，
// 所以读取它的组件必须是 Client Component（'use client'），并且要在 useEffect 里读，
// 否则服务端渲染阶段拿不到值，会导致 hydration 不一致
const TOKEN_KEY = "access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return getToken() !== null;
}

/**
 * 解析 JWT 的 payload —— 仅用于界面展示（例如右上角显示用户名）。
 * 注意：这只是 base64 解码，没有验签，任何人都能伪造内容。
 * 真正的验签发生在后端 JwtStrategy + JwtGuard，前端只负责把 token 带在请求头里
 */
export function decodeToken(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    // JWT 用的是 base64url，要还原成 base64 再用 atob 解
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // 中文姓名是多字节字符，需要按 UTF-8 还原
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json) as User;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
