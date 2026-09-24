import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';

@Module({
  controllers: [AgentController],
  providers: [AgentService],
  // 必须导出，否则 import 了本模块的 ConversationModule 无法注入 AgentService
  exports: [AgentService],
})
export class AgentModule {}
