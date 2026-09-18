import { Injectable, NotFoundException } from '@nestjs/common';
import type { JwtPayload } from '../auth/auth.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';

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
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: id, userId: user.id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: id,
        content: messageDto.content,
        role: 'user',
      },
    });
    const assistantContent = await this.llmService.chat(messageDto.content);
    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: id,
        content: assistantContent || '',
        role: 'assistant',
      },
    });
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
