"use client";

import { useState } from "react";

interface Props {
  // 返回 true 表示发送成功，这时才清空输入框；
  // 失败时保留内容，用户不用重新打一遍
  onSend: (content: string) => Promise<boolean>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState("");

  async function submit() {
    const content = value.trim();
    if (!content || disabled) return;
    const ok = await onSend(content);
    if (ok) setValue("");
  }

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            // Enter 发送，Shift+Enter 换行
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={2}
          placeholder="输入消息…（Enter 发送，Shift + Enter 换行）"
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={disabled || value.trim() === ""}
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "发送中…" : "发送"}
        </button>
      </div>
    </div>
  );
}
