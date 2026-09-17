"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, getApiMessage } from "@/lib/api";
import { setToken } from "@/lib/auth";
import type { LoginResponse } from "@/types/user";

export default function LoginForm() {
  const router = useRouter();

  // 三个受控状态：表单值 / 错误信息 / 请求中标记
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      // 登录成功：把 JWT 存起来，后续请求由 lib/api.ts 自动带上
      setToken(data.access_token);
      // replace 而不是 push，避免用户点返回又回到登录页
      router.replace("/conversations");
    } catch (err) {
      // 后端对"邮箱不存在"和"密码错误"返回的是同一句话，避免暴露账号是否存在
      setError(getApiMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          登录
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          登录后进入你的会话列表
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              邮箱
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          还没有账号？{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
