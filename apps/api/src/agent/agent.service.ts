import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    // id 由数据库默认值（cuid）生成，不需要前端传
    return this.prisma.agent.create({ data: createAgentDto });
  }

  findAll() {
    return this.prisma.agent.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    return agent;
  }
}
