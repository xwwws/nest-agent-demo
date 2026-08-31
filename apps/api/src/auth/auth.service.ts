import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  register(data: RegisterDTO) {
    return this.prisma.user.create({ data });
  }
}
