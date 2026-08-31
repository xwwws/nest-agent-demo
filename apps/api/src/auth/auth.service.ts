import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from './DTO/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './DTO/login.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 注册
   * @param data
   */
  async register(data: RegisterDTO) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data });
  }

  /**
   * 登录
   * @param data
   */
  async login(data: LoginDto) {
    const userInfo = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!userInfo) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    const passwordMatch = await bcrypt.compare(
      data.password,
      userInfo.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('邮箱或密码错误');
    }
    return true;
  }
}
