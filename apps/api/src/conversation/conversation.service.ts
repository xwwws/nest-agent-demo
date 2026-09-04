import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import type { JwtPayload } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createConversationDto: CreateConversationDto, user: JwtPayload) {
    return await this.prisma.conversation.create({
      data: { ...createConversationDto, userId: user.id },
    });
  }

  async findAll(user: JwtPayload) {
    return await this.prisma.conversation.findMany({
      where: { userId: user.id, isDelete: false },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    return await this.prisma.conversation.findFirstOrThrow({
      where: { id: id, userId: user.id, isDelete: false },
    });
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
    user: JwtPayload,
  ) {
    return await this.prisma.conversation.updateMany({
      where: { id: id, userId: user.id, isDelete: false },
      data: updateConversationDto,
    });
  }

  async remove(id: string, user: JwtPayload) {
    return await this.prisma.conversation.updateMany({
      where: {
        id,
        userId: user.id,
        isDelete: false,
      },
      data: {
        isDelete: true,
      },
    });
  }
}
