import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { User } from '../common/decorators/user.decorator';
import type { JwtPayload } from '../auth/auth.service';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @User() user: JwtPayload,
  ) {
    return this.conversationService.create(createConversationDto, user);
  }

  @Get()
  findAll(@User() user: JwtPayload) {
    return this.conversationService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: JwtPayload) {
    return this.conversationService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(id, updateConversationDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: JwtPayload) {
    return this.conversationService.remove(id, user);
  }
}
