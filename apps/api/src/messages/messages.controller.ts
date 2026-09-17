import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { User } from '../common/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import type { JwtPayload } from '../auth/auth.service';

@Controller('conversation/:conversationId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(
    @Param('conversationId') id: string,
    @User() user: JwtPayload,
    @Body() messageDto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(id, user, messageDto);
  }

  @Get()
  getMessages(@Param('conversationId') id: string, @User() user: JwtPayload) {
    return this.messagesService.getMessages(id, user);
  }
}
