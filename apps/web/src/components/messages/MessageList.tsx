"use client";

import type { Message } from "@/types/message";
import MessageItem from "./MessageItem";

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">
          还没有消息，在下面输入框发送第一条消息
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => (
        // 后端 Message.id 是自增整数，天然适合当 key
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
