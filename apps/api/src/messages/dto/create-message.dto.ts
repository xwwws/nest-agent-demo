import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMessageDto {
  @IsNotEmpty({ message: 'Content is required' })
  @Transform(({ value }) => value.trim())
  content: string;
}
