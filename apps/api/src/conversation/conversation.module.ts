import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { AgentModule } from '../agent/agent.module';

@Module({
  imports: [AgentModule],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
