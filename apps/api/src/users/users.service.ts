import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDTO } from './DTO/create.DTO';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询所有用户
   */
  findAll() {
    return this.prisma.user.findMany();
  }
  /**
   * 根据id查询用户
   */
  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * 创建用户
   */
  createUser(data: CreateDTO) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  /**
   * 删除用户（假删除）
   */
  deleteUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isDelete: true },
    });
  }
  /**
   * 恢复用户
   */
  restoreUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isDelete: false },
    });
  }
  /**
   * 更新用户
   */
  updateUser(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
}
