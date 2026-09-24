import { Injectable, NotFoundException } from '@nestjs/common';
import type { JwtPayload } from '../auth/auth.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { MAX_HISTORY_MESSAGES } from './messages.config';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly llmService: LlmService,
  ) {}

  async createMessage(
    id: string,
    user: JwtPayload,
    messageDto: CreateMessageDto,
  ) {
    // 确认当前会话存在
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: id, userId: user.id },
      include: {
        agent: true,
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    // 将用户问题写入数据库
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: id,
        content: messageDto.content,
        role: 'user',
      },
    });
    // 查询该会话的所有历史消息
    const historyMessages = await this.prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'desc' },
      take: MAX_HISTORY_MESSAGES,
    });
    const hisMessages = historyMessages.toReversed();
    // 将数据库消息转换成大模型需要的格式
    const messages = hisMessages.map((message) => ({
      role: message.role as 'user' | 'assistant',
      content: message.content,
    }));
    // 查询会话信息  获取会话的agent提示词
    const conversationInfo = await this.prisma.conversation.findFirst({
      where: { id: id, userId: user.id },
    });
    const systemPrompt =
      conversation.agent?.systemPrompt ?? conversationInfo?.systemPrompt ?? '';
    // 调用llm生成回复消息
    const assistantContent = await this.llmService.chat(messages, systemPrompt);
    // 将llm生成的回复消息写入数据库
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: id,
        content: assistantContent || '',
        role: 'assistant',
      },
    });
    // 返回用户问题和llm生成的回复消息
    return {
      userMessage,
      assistantMessage,
    };
  }

  async getMessages(id: string, user: JwtPayload) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: id, userId: user.id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return await this.prisma.message.findMany({
      where: { conversationId: id },
    });
  }
}
