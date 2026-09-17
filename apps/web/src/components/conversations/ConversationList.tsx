"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, handleUnauthorized, toErrorMessage } from "@/lib/api";
import { clearToken, getCurrentUser, getToken } from "@/lib/auth";
import type { Conversation } from "@/types/conversation";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  // 新建会话表单
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await api.get<Conversation[]>("/conversation");
      // 后端没有 orderBy，这里前端按创建时间倒序，最新的排最前
      setConversations(
        [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    } catch (err) {
      if (handleUnauthorized(err)) {
        router.replace("/login");
        return;
      }
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // localStorage 只能在浏览器读，所以守卫写在 useEffect 里
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUserName(getCurrentUser()?.name ?? "");
    void load();
  }, [router, load]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setFormError("标题和描述都要填写");
      return;
    }

    setCreating(true);
    setFormError(null);
    try {
      // 注意后端 CreateConversationDto 要求 title 和 content 都非空
      const created = await api.post<Conversation>("/conversation", {
        title: trimmedTitle,
        content: trimmedContent,
      });
      setConversations((prev) => [created, ...prev]);
      setTitle("");
      setContent("");
      setShowForm(false);
      // 建完直接进聊天页
      router.push(`/conversations/${created.id}`);
    } catch (err) {
      if (handleUnauthorized(err)) {
        router.replace("/login");
        return;
      }
      setFormError(toErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !window.confirm("确定删除这个会话吗？该会话下的消息也会一起删除。")
    ) {
      return;
    }
    try {
      await api.delete(`/conversation/${id}`);
      setConversations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      if (handleUnauthorized(err)) {
        router.replace("/login");
        return;
      }
      setError(toErrorMessage(err));
    }
  }

  function handleLogout() {
    // 前端删掉 token 就算登出；后端是无状态 JWT，没有会话需要销毁
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">AI Agent</h1>
            {userName && (
              <p className="text-xs text-gray-500">你好，{userName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            退出登录
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900">会话列表</h2>
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setFormError(null);
            }}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {showForm ? "取消" : "+ 新建会话"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 space-y-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                标题
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="AI Agent 学习"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                描述
              </label>
              <input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="想在这个会话里聊什么"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            {formError && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {formError}
              </p>
            )}
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "创建中…" : "创建并进入"}
            </button>
          </form>
        )}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="shrink-0 text-sm font-medium text-red-700 underline"
            >
              重试
            </button>
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">加载中…</p>
        ) : conversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <p className="text-sm text-gray-500">
              还没有会话，点击「+ 新建会话」开始吧
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
