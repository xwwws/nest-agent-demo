import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// 空值安全的 trim：显式传 null 时不能直接调 .trim()，否则会抛 TypeError
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  @Transform(trim)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(trim)
  systemPrompt: string;
}
