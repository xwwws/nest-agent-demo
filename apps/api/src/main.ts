import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/jwt.guard';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * 允许跨域
   */
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
  });

  /**
   * 全局守卫，用于验证 JWT
   */
  app.useGlobalGuards(app.get(JwtGuard));

  /**
   * 全局管道，用于验证 DTO
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤掉 DTO 中未定义的属性
      forbidNonWhitelisted: false, // 允许前端传入多余字段  后端不进行限制
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT as unknown as number);
}
bootstrap();
