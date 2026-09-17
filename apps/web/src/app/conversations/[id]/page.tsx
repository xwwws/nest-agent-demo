import type { Metadata } from "next";
import ChatView from "@/components/messages/ChatView";

export const metadata: Metadata = {
  title: "对话 | AI Agent Workspace",
};

// 动态路由：文件夹名 [id] 对应 URL /conversations/<id>。
// Next 16 里 params 是 Promise，Server Component 用 await 取；
// 取出来之后再交给客户端组件，这样 ChatView 里直接用普通字符串就行
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatView conversationId={id} />;
}
