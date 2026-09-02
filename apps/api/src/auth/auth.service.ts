import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from './DTO/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './DTO/login.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}
// 认证服务：核心业务逻辑（密码加密、用户查询、密码比对）
@Injectable()
export class AuthService {
  // 注入全局 PrismaModule 导出的 PrismaService（PrismaModule 标了 @Global）
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  /**
   * 注册
   * @param data 注册信息（name / email / password，password 为明文）
   */
  async register(data: RegisterDTO) {
    // bcrypt.hash(明文, 10)：第二个参数是 salt rounds（成本因子）
    // 每次调用都会生成随机盐并嵌入结果，同一个密码两次 hash 的输出不同
    // 10 轮约 100ms，是安全性和性能的常用平衡点
    data.password = await bcrypt.hash(data.password, 10);
    // 入库：此时 password 已经是 "$2b$10$..." 形式的哈希串，明文不落库
    return this.prisma.user.create({ data });
  }

  /**
   * 登录
   * @param data 登录信息（email / password，password 为明文）
   * @returns 校验通过返回 true，否则抛 401
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
    const jwtPayload: JwtPayload = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name!,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    return {
      access_token: accessToken,
      // userInfo,
    };
  }




  // async profile() {
  //   const user
  //   return {}
  // }
}
