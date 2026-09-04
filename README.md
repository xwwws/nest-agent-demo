# Agent Workspace

> 基于 **Next.js + NestJS + PostgreSQL + Prisma + LLM + RAG + Tool Calling + LangGraph + MCP** 构建的全栈 **AI Agent 工作台**学习项目。

一个用来系统学习「前后端分离 + AI Agent 开发」的练手项目：后端核心业务 API 由 NestJS 提供，前端用 Next.js App Router，最终目标是搭出一个能注册登录、创建 Agent、配置工具与知识库、流式对话的完整平台。

---

## 目录

- [一、技术栈](#一技术栈)
- [二、Monorepo 结构](#二monorepo-结构)
- [三、已完成内容（当前进度）](#三已完成内容当前进度)
- [四、API 接口一览](#四api-接口一览)
- [五、数据库模型](#五数据库模型)
- [六、学习笔记](#六学习笔记)
- [七、下一步计划](#七下一步计划)

---

## 一、技术栈

| 层面 | 技术 | 说明 |
| --- | --- | --- |
| Monorepo | pnpm workspace + Turborepo | 单仓管理 `apps/` 与 `packages/` |
| 后端 | NestJS 11 + TypeScript | API 服务，IoC/DI 架构 |
| 前端 | Next.js 16 + React 19 | App Router（尚在起步阶段） |
| ORM | Prisma 7.10.0 | 使用 `prisma7.config.ts` + driver adapter 新配置 |
| 数据库 | PostgreSQL（Supabase 托管） | 连接串 `DATABASE_URL`（应用）+ `DIRECT_URL`（migrate） |
| 鉴权 | JWT + Passport（passport-jwt） | `JwtStrategy` + `JwtGuard` 全局守卫 |
| 参数校验 | class-validator + class-transformer | 全局 `ValidationPipe` |
| 密码 | bcrypt | salt rounds = 10 |

> 前端侧计划引入（尚未落地）：Tailwind CSS、shadcn/ui、TanStack Query、Zustand、React Hook Form、Zod、SSE。

---

## 二、Monorepo 结构

```text
nest-demo/
├── apps/
│   ├── api/                    # NestJS 后端
│   │   ├── src/
│   │   │   ├── auth/           # 认证（注册/登录/JWT/Passport/守卫/装饰器）
│   │   │   ├── users/          # 用户 CRUD（含软删除）
│   │   │   ├── conversation/   # 会话 CRUD（关联当前用户）
│   │   │   ├── prisma/         # PrismaService / PrismaModule
│   │   │   ├── health/         # 健康检查
│   │   │   └── common/         # 公共装饰器（@PublicApi / @User）
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 数据模型
│   │   │   └── migrations/     # 迁移记录
│   │   └── prisma7.config.ts   # Prisma 7 配置文件
│   └── web/                    # Next.js 前端（起步）
├── packages/
│   └── types/                  # 前后端共享 TS 类型（@agent-workspace/types）
├── errNotes/                   # 学习笔记（每个目标一个文件）
├── LEARNING_PLAN.md            # 学习计划
├── agent-progress.md           # 项目进度记录
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 三、已完成内容（当前进度）

> 后端基础设施已基本打通：从 Monorepo 到数据库、再到完整的用户认证链路和第一个业务模块（会话）均已落地。

### 目标一 · Monorepo（✅ 已完成）

- 采用 **pnpm workspace + Turborepo** 单仓管理。
- 目录划分为 `apps/api`（NestJS）、`apps/web`（Next.js）、`packages/types`（共享类型）。
- 根目录 `package.json` 提供 `dev` / `build` / `lint` 三条 turbo 命令。

### 目标二 · Prisma 7 配置（✅ 已完成）

- 升级到 Prisma 7 新配置：`schema.prisma` 不再写 `url`，改为 `prisma7.config.ts` 管理。
- 引入 driver adapter：`@prisma/adapter-pg` + `pg` 连接 PostgreSQL。
- 成功打通 `Prisma → DATABASE_URL → Supabase PostgreSQL`，并执行 `db pull` 验证连接。

### 目标三 · 用户模块 CRUD（✅ 已完成）

- 标准 NestJS 三层结构：`UsersModule / UsersController / UsersService`。
- 实现完整增删改查，并支持**软删除**（`isDelete` 标记）与**恢复**。

### 目标四 · Auth 模块 + DTO 验证（✅ 已完成）

- `class-validator` + `class-transformer` 实现注册/登录 DTO 校验。
- 全局 `ValidationPipe`（`whitelist` + `transform` 自动类型转换）。
- CORS 配置允许 `http://localhost:3000` 前端跨域访问。

### 目标五 · bcrypt 密码存储（✅ 已完成）

- 密码使用 bcrypt 加盐哈希（salt rounds = 10），登录时 `compare` 校验。

### 目标六 · JWT 鉴权（✅ 已完成）

- `@nestjs/jwt` 签发 `access_token`。
- 采用 **Passport 方案**：`JwtStrategy` 验签 + `JwtGuard` 守卫。
- 通过 `APP_GUARD` 注册为**全局守卫**，默认保护所有路由。
- 公开路由通过 `@Public()` / `@PublicApi()` 系列装饰器放行（基于 `Reflector` + `SetMetadata`）。
- 受保护接口用自定义 `@User()` 参数装饰器取 `req.user`（payload 类型 `JwtPayload = { id, email, name }`）。

### 目标七 · Conversation 会话模块（✅ 已完成）

- Prisma 一对多关联：`User 1 — N Conversation`。
- 通过 `@User()` 装饰器把会话与当前登录用户自动关联。
- 使用 `PartialType`（更新 DTO 复用）+ `@Transform` 做字段处理。
- 同样支持软删除。

---

## 四、API 接口一览

| 模块 | 方法 & 路径 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| Health | `GET /health` | 健康检查 | 公开 |
| Users | `GET /users` | 用户列表 | — |
| Users | `GET /users/:id` | 查询单个用户 | — |
| Users | `POST /users` | 创建用户 | — |
| Users | `POST /users/update/:id` | 更新用户 | — |
| Users | `DELETE /users/:id` | 软删除用户 | — |
| Users | `POST /users/restore/:id` | 恢复用户 | — |
| Auth | `POST /auth/register` | 注册 | 公开 |
| Auth | `POST /auth/login` | 登录（返回 `access_token`） | 公开 |
| Auth | `GET /auth/profile` | 获取当前登录用户信息 | 需 JWT |
| Conversation | `POST /conversation` | 新建会话 | 需 JWT |
| Conversation | `GET /conversation` | 当前用户会话列表 | 需 JWT |
| Conversation | `GET /conversation/:id` | 查询单个会话 | 需 JWT |
| Conversation | `PATCH /conversation/:id` | 更新会话 | 需 JWT |
| Conversation | `DELETE /conversation/:id` | 软删除会话 | 需 JWT |

> 后端默认端口 `3001`（`PORT` 环境变量可改），前端默认 `3000`。

---

## 五、数据库模型

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  isDelete  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  conversations Conversation[]
}

model Conversation {
  id        String   @id @default(uuid())
  title     String
  content   String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  isDelete  Boolean  @default(false)

  user User @relation(fields: [userId], references: [id])
}
```

**迁移记录**（`apps/api/prisma/migrations/`）：

| 迁移 | 内容 |
| --- | --- |
| `20260830013122_init` | 初始化 User 表 |
| `20260831034605_add_user_is_delete` | User 增加软删除标记 |
| `20260903053447_add_conversation` | 新增 Conversation 表 |
| `20260903072810_add_conversation_content` | Conversation 增加 content 字段 |
| `20260903083940_add_conversation_isdelete` | Conversation 增加软删除标记 |

---

## 六、学习笔记

每个「目标」拆成一个独立文件，`errNotes/0.all.md` 作总目录索引：

| 编号 | 主题 | 文件 |
| --- | --- | --- |
| 01 | Monorepo | [01.monorepo.md](./errNotes/01.monorepo.md) |
| 02 | Prisma + Supabase | [02.prisma-supabase.md](./errNotes/02.prisma-supabase.md) |
| 03 | 用户 CRUD | [03.user-crud.md](./errNotes/03.user-crud.md) |
| 04 | Auth DTO 验证 | [04.auth-dto.md](./errNotes/04.auth-dto.md) |
| 05 | 全局验证管道 | [05.global-validation-pipe.md](./errNotes/05.global-validation-pipe.md) |
| 06 | bcrypt | [06.bcrypt.md](./errNotes/06.bcrypt.md) |
| 07 | JWT 引入与签发 | [07.jwt.md](./errNotes/07.jwt.md) |
| 08 | JWT + Passport 守卫 | [08.jwt-passport.md](./errNotes/08.jwt-passport.md) |
| 09 | 全局守卫 + 公开路由 | [09.public-guard.md](./errNotes/09.public-guard.md) |
| 10 | @User 参数装饰器 | [10.user-decorator.md](./errNotes/10.user-decorator.md) |
| 11 | Conversation 模块 | [11.conversation.md](./errNotes/11.conversation.md) |

---

## 七、下一步计划

当前学习节点：**后端基础（NestJS + Prisma + Auth + Conversation）已完成**，进入下一阶段。

```text
Next.js App Router 正式接入
        ↓
登录页 / Dashboard / 用户状态
        ↓
Chat 系统（Conversation + Message）
        ↓
LLM + Streaming（OpenAI SDK + SSE）
        ↓
Tool Calling
        ↓
手写 Agent Loop
        ↓
RAG（Embedding + pgvector）
        ↓
LangGraph + MCP
        ↓
工程化（Redis / BullMQ / Docker）
```

> 详细路线与阶段拆解见 [LEARNING_PLAN.md](./LEARNING_PLAN.md)，进度记录见 [agent-progress.md](./agent-progress.md)。

---

## 常用命令

```bash
# 安装依赖
pnpm install

# 启动所有 app（turbo）
pnpm dev

# 单独启动后端（默认 3001）
pnpm --filter api dev

# 单独启动前端（默认 3000）
pnpm --filter web dev

# Prisma 迁移 / 生成 client
pnpm --filter api prisma migrate dev
pnpm --filter api prisma generate
```
