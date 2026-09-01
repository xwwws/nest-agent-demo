import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './DTO/auth.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './DTO/login.dto';

// 认证控制器：暴露 /auth/* 路由
@Controller('auth')
export class AuthController {
  // 通过构造函数注入 AuthService（NestJS 依赖注入）
  constructor(private readonly authService: AuthService) {}

  // 注册接口：POST /auth/register
  // 流程：手动校验 DTO → 校验失败返回错误信息 → 成功交给 service 处理
  // 注意：这里手动调 plainToClass + validate 是教学写法，
  // NestJS 更地道的做法是在全局绑定 ValidationPipe，@Body() 会自动校验
  @Post('/register')
  async register(@Body() data: RegisterDTO) {
    // 把普通对象转成 RegisterDTO 类实例，触发 class-validator 装饰器
    const registerData = plainToClass(RegisterDTO, data);
    // 手动执行校验，收集所有不符合装饰器规则的字段
    const errors = await validate(registerData);
    if (errors.length > 0) {
      // 校验失败：返回 200 + 错误详情（更好的做法是抛 BadRequestException）
      return { message: 'Validation failed', errors };
    }
    // 校验通过：交给 service 完成加密入库
    return await this.authService.register(data);
  }

  // 登录接口：POST /auth/login
  // 校验逻辑在 service 里做（查用户 + bcrypt 比对密码）
  // 失败时 service 会抛 UnauthorizedException（401），这里只处理成功分支
  // TODO: 登录成功后应签发 JWT 返回 token，而不是只返回一个 message
  @Post('/login')
  async login(@Body() data: LoginDto) {
    const flag = await this.authService.login(data);
    if (flag) {
      return { message: '登录成功' };
    }
  }
}
