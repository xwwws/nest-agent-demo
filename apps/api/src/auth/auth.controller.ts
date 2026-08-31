import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async register(@Body() data: RegisterDTO) {
    const registerData = plainToClass(RegisterDTO, data);
    const errors = await validate(registerData);
    if (errors.length > 0) {
      return { message: 'Validation failed', errors };
    }
    return await this.authService.register(data);
  }

  @Post('/login')
  async login(@Body() data: LoginDto) {
    const flag = await this.authService.login(data);
    if (flag) {
      return { message: '登录成功' };
    }
  }
}
