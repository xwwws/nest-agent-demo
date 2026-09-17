import { clearToken, getCurrentUser, getToken } from "./auth";

// 所有请求统一走这个前缀，由 next.config.ts 的 rewrites 代理到 NestJS。
// 好处：浏览器认为请求同源 → 没有 CORS 问题，也不用在前端写死 http://localhost:9500
const API_BASE = "/api/backend";

// 把 HTTP 状态码包装成异常，页面里可以据此做不同处理（例如 401 就跳登录页）
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * 从错误响应里取出可读信息。
 * NestJS 的异常响应体形如：
 *   { statusCode: 401, message: '邮箱或密码错误', error: 'Unauthorized' }
 * 校验失败时 message 会是数组（class-validator 的多条错误）
 */
async function readErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] } | null;
    const message = data?.message;
    if (Array.isArray(message)) return message.join("；");
    if (typeof message === "string") return message;
  } catch {
    // 响应体不是 JSON，忽略
  }
  return `请求失败（HTTP ${res.status}）`;
}

/**
 * 统一的请求入口：自动带 Base URL、Content-Type 和 Authorization 头。
 * 页面里只写路径，例如 api.get('/conversation')
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    throw new ApiError(res.status, await readErrorMessage(res));
  }
  // DELETE 等接口可能返回 204 空响应
  if (res.status === 204) {
    return undefined as T;
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};

/**
 * 直接把后端的 message 透传给用户。
 * 登录/注册这类表单用它最好，因为后端返回的 "邮箱或密码错误" 本身就是给用户看的
 */
export function getApiMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "未知错误";
}

/**
 * 受保护页面用的友好提示：把状态码翻译成用户能看懂的话
 */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "登录状态已失效，请重新登录";
    if (error.status === 403) return "没有权限访问该资源";
    if (error.status === 404) return "资源不存在或无权访问";
    if (error.status >= 500) return "后端服务异常，请稍后重试";
    return error.message;
  }
  // fetch 抛 TypeError 通常意味着请求根本没发出去
  if (error instanceof TypeError) {
    return "无法连接后端服务，请确认 NestJS 已启动（http://localhost:9500）";
  }
  return error instanceof Error ? error.message : "未知错误";
}

/** 受保护页面通用处理：401 说明 token 过期或无效，清掉并回登录页 */
export function handleUnauthorized(error: unknown): boolean {
  if (error instanceof ApiError && error.status === 401) {
    clearToken();
    return true;
  }
  return false;
}
