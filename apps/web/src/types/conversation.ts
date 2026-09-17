// 与 Prisma 的 Conversation 模型对应（apps/api/prisma/schema.prisma）
export interface Conversation {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// POST /conversation 的请求体
// 注意：后端的 CreateConversationDto 里 title 和 content 都是 @IsNotEmpty，
// 所以创建会话必须同时传这两个字段，不能只传 title
export interface CreateConversationPayload {
  title: string;
  content: string;
}

// PATCH /conversation/:id 的请求体（UpdateConversationDto 是 Partial 的）
export interface UpdateConversationPayload {
  title?: string;
  content?: string;
}
