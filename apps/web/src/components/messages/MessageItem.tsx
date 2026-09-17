"use client";

import type { Message, MessageRole } from "@/types/message";

// 按 role 决定气泡样式与显示名。
// 用 role 而不是 isUser: boolean，接 Agent 后新增 assistant/system/tool 不用改结构
const ROLE_STYLES: Record<
  MessageRole,
  { label: string; bubble: string; align: string }
> = {
  user: {
    label: "用户",
    align: "items-end",
    bubble: "bg-blue-600 text-white rounded-2xl rounded-br-sm",
  },
  assistant: {
    label: "AI",
    align: "items-start",
    bubble: "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-sm",
  },
  system: {
    label: "系统",
    align: "items-center",
    bubble: "bg-gray-100 text-gray-500 rounded-full text-xs",
  },
  tool: {
    label: "工具",
    align: "items-start",
    bubble: "bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl",
  },
};

// role 是字符串，可能遇到前端没预设的值，这里兜底成 system 的样式
function styleOf(role: string) {
  return ROLE_STYLES[role as MessageRole] ?? ROLE_STYLES.system;
}

export default function MessageItem({ message }: { message: Message }) {
  const style = styleOf(message.role);

  return (
    <div className={`flex flex-col gap-1 ${style.align}`}>
      <span className="px-1 text-xs text-gray-400">{style.label}</span>
      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words px-4 py-2.5 text-sm leading-relaxed ${style.bubble}`}
      >
        {message.content}
      </div>
    </div>
  );
}
