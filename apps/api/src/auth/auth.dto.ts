import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class RegisterDTO {
  // 用户名
  @IsNotEmpty({ message: '用户名必填' })
  @IsString()
  name: string;

  // 邮箱
  @IsNotEmpty({ message: '邮箱必填' })
  @IsEmail()
  @IsString()
  email: string;

  // 密码
  @IsNotEmpty({ message: '密码必填' })
  @IsString()
  password: string;
}
