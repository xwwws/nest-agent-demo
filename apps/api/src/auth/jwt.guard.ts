import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import {
  IS_PUBLIC_KEY,
  PUBLIC_WHITE_LIST_KEY,
} from '../common/decorators/publicApi.decorators';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    // 1. 检查 @Public() - 完全公开
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. 检查 @PublicWhiteList() - 路径匹配才公开
    const request = context.switchToHttp().getRequest();
    const whiteList = this.reflector.getAllAndOverride<string[]>(
      PUBLIC_WHITE_LIST_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 关键：匹配当前请求路径是否在白名单中
    if (whiteList?.some((pattern) => this.matchPath(request.path, pattern))) {
      return true;
    }
    return super.canActivate(context);
  }
  // 支持通配符匹配
  private matchPath(requestPath: string, pattern: string): boolean {
    // 简单匹配（支持通配符 * 和 **）
    if (pattern.includes('**')) {
      return requestPath.startsWith(pattern.replace('**', ''));
    }
    return requestPath === pattern;
  }
}
