import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtGuard } from './auth/jwt.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * 允许跨域
   */
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
  });
  app.useGlobalGuards(app.get(JwtGuard));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
