import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './auth/jwt.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [HealthModule, PrismaModule, UsersModule, AuthModule],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard, // 全局守卫
    },
    JwtGuard, // 必须同时声明为 provider，否则 Nest 解析不到
    AppService,
  ],
})
export class AppModule {}
