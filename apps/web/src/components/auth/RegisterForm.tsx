"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, api, getApiMessage } from "@/lib/api";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // 后端 POST /auth/register 成功后返回创建出来的用户
      await api.post("/auth/register", { name, email, password });
      // 按规划：注册成功先跳回登录页，不做自动登录
      router.replace("/login");
    } catch (err) {
      // 邮箱唯一约束（Prisma P2002）目前没有被过滤成 4xx，
      // 会以 500 返回，所以这里对 5xx 给一个更贴近真实原因的提示
      if (err instanceof ApiError && err.status >= 500) {
        setError("注册失败：该邮箱可能已被注册，或后端服务异常");
      } else {
        setError(getApiMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          注册
        </h1>
        <p className="mt-2 text-sm text-gray-500">创建一个新账号</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              姓名
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="张三"
              className={inputClass}
            />
          </div>

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
              className={inputClass}
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
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className={inputClass}
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
            {loading ? "注册中…" : "注册"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          已有账号？{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
