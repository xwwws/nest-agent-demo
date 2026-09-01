import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from './DTO/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './DTO/login.dto';
import bcrypt from 'bcrypt';

// 认证服务：核心业务逻辑（密码加密、用户查询、密码比对）
@Injectable()
export class AuthService {
  // 注入全局 PrismaModule 导出的 PrismaService（PrismaModule 标了 @Global）
  constructor(private readonly prisma: PrismaService) {}

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
    // 第一步：按邮箱查用户
    const userInfo = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!userInfo) {
      // 用户不存在：抛 401
      // 注意提示语和密码错误时保持一致（"邮箱或密码错误"），
      // 避免攻击者通过不同报错探测哪些邮箱已注册（用户枚举攻击）
      throw new UnauthorizedException('邮箱或密码错误');
    }
    // 第二步：bcrypt 比对密码
    // 不能用 hash(明文) === 存的哈希 来比较——因为盐是随机的，两次 hash 结果必然不同
    // compare 内部会从哈希串里解析出盐和成本因子，用同样的参数重新计算再比对
    const passwordMatch = await bcrypt.compare(
      data.password,
      userInfo.password,
    );
    if (!passwordMatch) {
      // 密码不匹配：抛 401，提示语与"用户不存在"保持一致
      throw new UnauthorizedException('邮箱或密码错误');
    }
    return true;
  }
}
