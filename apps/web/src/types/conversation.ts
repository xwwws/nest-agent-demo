// 与 Prisma 的 Conversation 模型对应（apps/api/prisma/schema.prisma）
export interface Conversation {
  id: string;
  title: string;
  content: string;
  userId: string;
  // 会话级 System Prompt（后端字段可空）。
  // 为空时后端 LlmService 会退回 DEFAULT_SYSTEM_PROMPT
  systemPrompt: string | null;
  createdAt: string;
  updatedAt: string;
}

// POST /conversation 的请求体
// 注意：后端的 CreateConversationDto 里 title 和 content 都是 @IsNotEmpty，
// 所以创建会话必须同时传这两个字段，不能只传 title；
// systemPrompt 是可选的，不传或传空则使用后端默认提示词
export interface CreateConversationPayload {
  title: string;
  content: string;
  systemPrompt?: string;
}

// PATCH /conversation/:id 的请求体（UpdateConversationDto 是 Partial 的）
export interface UpdateConversationPayload {
  title?: string;
  content?: string;
  systemPrompt?: string;
}
