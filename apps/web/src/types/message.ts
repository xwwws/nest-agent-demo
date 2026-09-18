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

// POST /conversation/:conversationId/messages 的返回。
// 后端接了 LLM（LlmService）：先存 role='user' 的消息，
// 再调模型生成回复存成 role='assistant'，两条一起返回
export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}
