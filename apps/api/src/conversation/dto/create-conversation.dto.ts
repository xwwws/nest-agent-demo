import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  content: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  systemPrompt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  agentId?: string;
}
