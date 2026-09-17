// 消息角色。
// 现在后端只写 'user'，但 schema 里 role 是普通 String，
// 后续接入 Agent 会出现 assistant / system / tool，所以这里提前把四种角色都留好，
// 组件按 role 渲染，而不是用 isUser: boolean
export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface Message {
  // Prisma 里 Message.id 是 Int @default(autoincrement())，所以是 number
  id: number;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

// POST /conversation/:conversationId/messages 的请求体
export interface CreateMessagePayload {
  content: string;
}
