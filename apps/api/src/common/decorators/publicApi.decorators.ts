// auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const PUBLIC_WHITE_LIST_KEY = 'publicWhiteList';

/**
 * 标记接口为公开接口（无需JWT验证）
 * 使用方式：@Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * 为特定路径设置白名单（支持通配符）
 * 使用方式：@PublicWhiteList(['/auth/login', '/auth/register'])
 */
export const PublicWhiteList = (paths: string[]) =>
  SetMetadata(PUBLIC_WHITE_LIST_KEY, paths);

// 组合使用
export const PublicApi = (paths?: string[]) => {
  if (paths) {
    return (target: any, key?: string, descriptor?: any) => {
      // @ts-ignore
      PublicWhiteList(paths)(target, key, descriptor);
      // @ts-ignore
      Public()(target, key, descriptor);
    };
  }
  return Public();
};
