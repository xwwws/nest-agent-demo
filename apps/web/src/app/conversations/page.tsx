import type { Metadata } from "next";
import ConversationList from "@/components/conversations/ConversationList";

export const metadata: Metadata = {
  title: "会话列表 | AI Agent Workspace",
};

export default function ConversationsPage() {
  return <ConversationList />;
}
