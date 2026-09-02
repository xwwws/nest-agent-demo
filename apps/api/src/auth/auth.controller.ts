import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './DTO/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

// 认证控制器：暴露 /auth/* 路由
@Controller('auth')
export class AuthController {
  // 通过构造函数注入 AuthService（NestJS 依赖注入）
  constructor(private readonly authService: AuthService) {}

  /**
   * @param data 注册信息
   */
  @Post('/register')
  async register(@Body() data: RegisterDTO) {
    const registerData = plainToClass(RegisterDTO, data);
    const errors = await validate(registerData);
    if (errors.length > 0) {
      return { message: 'Validation failed', errors };
    }
    return await this.authService.register(data);
  }

  /**
   * @param data 登录信息
   */
  @Post('/login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return req.user;
  }
}
