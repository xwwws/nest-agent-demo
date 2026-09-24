import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import type { JwtPayload } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AgentService } from '../agent/agent.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentService: AgentService,
  ) {}

  // 把前端传来的 agentId 归一化：空串 / 空值 / null 一律视为「不绑定 Agent」
  private async resolveAgentId(agentId?: string | null) {
    const id = agentId?.trim();
    if (!id) {
      return null;
    }
    // 绑定了 Agent 就校验它真的存在，不存在直接 404，而不是等到数据库报外键错误
    await this.agentService.findOne(id);
    return id;
  }

  async create(createConversationDto: CreateConversationDto, user: JwtPayload) {
    const { title, content, systemPrompt, agentId } = createConversationDto;
    // 显式挑字段，避免 DTO 上的多余字段被 spread 进 Prisma
    return await this.prisma.conversation.create({
      data: {
        title,
        content,
        userId: user.id,
        systemPrompt: systemPrompt ?? null,
        agentId: await this.resolveAgentId(agentId),
      },
    });
  }

  async findAll(user: JwtPayload) {
    return await this.prisma.conversation.findMany({
      where: { userId: user.id },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    return await this.prisma.conversation.findFirstOrThrow({
      where: { id: id, userId: user.id },
    });
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
    user: JwtPayload,
  ) {
    const { agentId, ...rest } = updateConversationDto;
    // agentId 没传（undefined）= 不改动绑定关系；传了空串/null = 解绑
    const nextAgentId =
      agentId === undefined ? undefined : await this.resolveAgentId(agentId);
    return await this.prisma.conversation.updateMany({
      where: { id: id, userId: user.id },
      data: { ...rest, agentId: nextAgentId },
    });
  }

  async remove(id: string, user: JwtPayload) {
    return await this.prisma.conversation.delete({
      where: {
        id,
        userId: user.id,
      },
    });
  }
}
