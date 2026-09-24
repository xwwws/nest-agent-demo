import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// 空值安全的 trim：显式传 null（例如清空提示词）时不能直接调 .trim()，否则会抛 TypeError
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  @Transform(trim)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Transform(trim)
  content: string;

  @IsOptional()
  @IsString()
  @Transform(trim)
  systemPrompt?: string | null;

  @IsOptional()
  @IsString()
  @Transform(trim)
  agentId?: string | null;
}
