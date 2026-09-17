"use client";

import Link from "next/link";
import type { Conversation } from "@/types/conversation";

interface Props {
  conversation: Conversation;
  onDelete: (id: string) => void;
}

export default function ConversationItem({ conversation, onDelete }: Props) {
  return (
    <li className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-blue-300 hover:shadow-sm">
      {/* 点击整块区域进入聊天页，用 Link 而不是 a 标签，才能走客户端导航不刷新整页 */}
      <Link
        href={`/conversations/${conversation.id}`}
        className="min-w-0 flex-1 outline-none"
      >
        <p className="truncate font-medium text-gray-900">
          {conversation.title}
        </p>
        {conversation.content && (
          <p className="mt-0.5 truncate text-sm text-gray-500">
            {conversation.content}
          </p>
        )}
      </Link>

      <button
        type="button"
        onClick={() => onDelete(conversation.id)}
        className="shrink-0 rounded-md px-2 py-1 text-sm text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
      >
        删除
      </button>
    </li>
  );
}
