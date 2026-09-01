import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

// 认证模块：负责注册 / 登录
// 后续会在这里注册 JwtModule 和 Passport 策略（LEARNING_PLAN Phase 2）
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
