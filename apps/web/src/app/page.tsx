"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ApiStatus from "@/components/ApiStatus";
import { getToken } from "@/lib/auth";

// 首页现在是 Client Component，因为它需要读取 localStorage 来判断登录态。
//
// 为什么不用 Next 的中间件（Next 16 里叫 proxy.ts）做这个跳转？
// 因为中间件跑在服务端，读不到浏览器的 localStorage；
// proxy.ts 能读到的是 Cookie。所以「localStorage 存 token + 中间件重定向」
// 这两个方案是互斥的 —— 要么在这一层做客户端判断，要么把 token 改存 Cookie。
export default function Home() {
  const router = useRouter();

  // false = 还没检查完；true = 确认未登录，可以渲染首页
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // 已登录：直接进会话列表。
    // 用 replace 而不是 push，避免用户点浏览器返回又回到首页、又被弹回去
    if (getToken()) {
      router.replace("/conversations");
      return;
    }
    setChecked(true);
  }, [router]);

  // 检查期间先渲染占位，避免「首页闪一下又跳走」
  if (!checked) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-gray-400">正在检查登录状态…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-6 py-16">
      <div className="mb-4">
        <ApiStatus />
      </div>

      <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
        AI Agent Workspace
      </h1>
      <p className="mt-4 max-w-xl text-lg text-gray-600">
        一个从零搭建的 AI Agent 学习项目。当前已经打通「登录 → 会话 → 消息」的完整链路，
        后续会在这条数据通道上接入 LLM 与 Agent 能力。
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          注册
        </Link>
      </div>

      <dl className="mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { k: "前端", v: "Next.js 16 App Router" },
          { k: "后端", v: "NestJS + JWT" },
          { k: "数据", v: "PostgreSQL (Supabase)" },
        ].map((item) => (
          <div
            key={item.k}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {item.k}
            </dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{item.v}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
