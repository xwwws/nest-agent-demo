import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

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
}
