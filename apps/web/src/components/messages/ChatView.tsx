"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, handleUnauthorized, toErrorMessage } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import type { Conversation } from "@/types/conversation";
import type { Message } from "@/types/message";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatView({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 会话信息 + 历史消息一起拉。两个接口后端都会校验会话归属，不属于当前用户返回 404
      const [detail, history] = await Promise.all([
        api.get<Conversation>(`/conversation/${conversationId}`),
        api.get<Message[]>(`/conversation/${conversationId}/messages`),
      ]);
      setConversation(detail);
      setMessages(history);
    } catch (err) {
      if (handleUnauthorized(err)) {
        router.replace("/login");
        return;
      }
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [conversationId, router]);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [router, load, reloadKey]);

  // 新消息进来后滚到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  async function sendMessage(content: string): Promise<boolean> {
    setSending(true);
    setSendError(null);
    try {
      const created = await api.post<Message>(
        `/conversation/${conversationId}/messages`,
        { content },
      );
      // 后端固定写入 role: 'user'，返回体里就带着 role，
      // 所以直接把它追加进列表即可，后续接 Agent 时 assistant 消息也走同一条路径
      setMessages((prev) => [...prev, created]);
      return true;
    } catch (err) {
      if (handleUnauthorized(err)) {
        router.replace("/login");
        return false;
      }
      setSendError(toErrorMessage(err));
      return false;
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-6 py-3.5">
          <Link
            href="/conversations"
            className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ← 返回
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-medium text-gray-900">
              {conversation?.title ?? (loading ? "加载中…" : "会话")}
            </h1>
            {conversation?.content && (
              <p className="truncate text-xs text-gray-500">
                {conversation.content}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              clearToken();
              router.replace("/login");
            }}
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            退出登录
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-3xl">
          {error ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                重新加载
              </button>
            </div>
          ) : loading ? (
            <p className="py-20 text-center text-sm text-gray-500">加载中…</p>
          ) : (
            <MessageList messages={messages} />
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {sendError && (
        <div className="mx-auto w-full max-w-3xl px-6">
          <p
            role="alert"
            className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {sendError}
          </p>
        </div>
      )}

      <MessageInput onSend={sendMessage} disabled={sending || !!error} />
    </div>
  );
}
