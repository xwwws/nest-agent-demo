# Agent Workspace

> 基于 **Next.js + NestJS + PostgreSQL + Prisma + LLM + RAG + Tool Calling + LangGraph + MCP** 构建的全栈 **AI Agent 工作台**学习项目。

一个用来系统学习「前后端分离 + AI Agent 开发」的练手项目：后端核心业务 API 由 NestJS 提供，前端用 Next.js App Router，最终目标是搭出一个能注册登录、创建 Agent、配置工具与知识库、流式对话的完整平台。

目前已经打通 **注册登录 → 会话 → 消息 → LLM 回复** 的完整链路（非流式）。

---

## 目录

- [一、技术栈](#一技术栈)
- [二、项目结构](#二项目结构)
- [三、已完成内容（当前进度）](#三已完成内容当前进度)
- [四、API 接口一览](#四api-接口一览)
- [五、数据库模型](#五数据库模型)
- [六、学习笔记](#六学习笔记)
- [七、下一步计划](#七下一步计划)
- [常用命令](#常用命令)

---

## 一、技术栈

| 层面 | 技术 | 说明 |
| --- | --- | --- |
| Monorepo | pnpm workspace + Turborepo | 单仓管理 `apps/` 与 `packages/` |
| 后端 | NestJS 11 + TypeScript | API 服务，IoC/DI 架构 |
| 前端 | Next.js 16（App Router）+ React 19 | 客户端组件 + 原生 fetch |
| 样式 | Tailwind CSS 4 | `@tailwindcss/postcss` |
| ORM | Prisma 7.10.0 | 使用 `prisma7.config.ts` + driver adapter 新配置 |
| 数据库 | PostgreSQL（Supabase 托管） | 连接串 `DATABASE_URL`（应用）+ `DIRECT_URL`（migrate） |
| 鉴权 | JWT + Passport（passport-jwt） | `JwtStrategy` + `JwtGuard` 全局守卫 |
| 参数校验 | class-validator + class-transformer | 全局 `ValidationPipe` |
| 密码 | bcrypt | salt rounds = 10 |
| LLM | OpenAI SDK + 通义千问 | 走 DashScope 的 OpenAI 兼容接口，模型 `qwen-plus` |

> 前端侧计划引入（尚未落地）：shadcn/ui、TanStack Query、Zustand、React Hook Form、Zod、SSE。

---

## 二、项目结构

```text
nest-demo/
├── apps/
│   ├── api/                                  # NestJS 后端（端口 9500）
│   │   ├── src/
│   │   │   ├── auth/                         # 认证模块
│   │   │   │   ├── DTO/                      # 注册 / 登录 DTO
│   │   │   │   ├── auth.controller.ts        # POST /auth/register|login，GET /auth/profile
│   │   │   │   ├── auth.service.ts           # 注册、登录、签发 JWT（含 JwtPayload 定义）
│   │   │   │   ├── auth.strategy.ts          # JwtStrategy：验签 + 还原 req.user
│   │   │   │   ├── jwt.guard.ts              # JwtGuard：结合 @Public 系列装饰器放行
│   │   │   │   └── auth.module.ts
│   │   │   ├── users/                        # 用户 CRUD（含软删除 / 恢复）
│   │   │   ├── conversation/                 # 会话 CRUD（关联当前用户）
│   │   │   │   ├── dto/                      # Create / Update（PartialType）
│   │   │   │   └── entities/
│   │   │   ├── messages/                     # 消息模块（嵌套在会话下）
│   │   │   │   ├── dto/create-message.dto.ts
│   │   │   │   ├── messages.controller.ts    # /conversation/:conversationId/messages
│   │   │   │   ├── messages.service.ts       # 落库 user 消息 → 调 LLM → 落库 assistant 消息
│   │   │   │   └── messages.module.ts
│   │   │   ├── llm/                          # LLM 模块
│   │   │   │   ├── llm.service.ts            # OpenAI SDK 封装，chat(content)
│   │   │   │   └── llm.module.ts             # exports LlmService
│   │   │   ├── prisma/                       # PrismaService / PrismaModule（@Global）
│   │   │   ├── health/                       # GET /health
│   │   │   ├── common/decorators/            # @PublicApi / @User
│   │   │   ├── app.module.ts                 # 各模块装配 + APP_GUARD 全局守卫
│   │   │   └── main.ts                       # CORS + 全局守卫 + 全局 ValidationPipe
│   │   ├── prisma/
│   │   │   ├── schema.prisma                 # User / Conversation / Message
│   │   │   └── migrations/                   # 6 条迁移记录
│   │   └── prisma7.config.ts                 # Prisma 7 配置文件
│   │
│   └── web/                                  # Next.js 前端（端口 9501）
│       ├── next.config.ts                    # rewrites：/api/backend/* → NestJS
│       └── src/
│           ├── app/                          # App Router 路由
│           │   ├── layout.tsx                # 根布局（字体 + globals.css + metadata）
│           │   ├── globals.css               # Tailwind 入口
│           │   ├── page.tsx                  # 首页（检查登录态 → 跳会话列表）
│           │   ├── login/page.tsx            # 登录页
│           │   ├── register/page.tsx         # 注册页
│           │   └── conversations/
│           │       ├── page.tsx              # 会话列表页
│           │       └── [id]/page.tsx         # 对话页（await params → ChatView）
│           ├── components/
│           │   ├── ApiStatus.tsx             # 后端连通状态探测
│           │   ├── auth/
│           │   │   ├── LoginForm.tsx         # 登录表单 → 存 token → 跳会话列表
│           │   │   └── RegisterForm.tsx      # 注册表单 → 跳登录页
│           │   ├── conversations/
│           │   │   ├── ConversationList.tsx  # 拉列表 / 新建 / 删除 / 登出
│           │   │   └── ConversationItem.tsx  # 单条会话（Link 进聊天页）
│           │   └── messages/
│           │       ├── ChatView.tsx          # 聊天主视图：拉取 + 发送 + 滚动
│           │       ├── MessageList.tsx       # 消息列表 / 空态
│           │       ├── MessageItem.tsx       # 气泡（按 role 决定样式）
│           │       └── MessageInput.tsx      # 输入框（Enter 发送）
│           ├── lib/
│           │   ├── api.ts                    # fetch 封装：前缀 / Authorization / 错误翻译
│           │   └── auth.ts                   # token 存取（localStorage）+ JWT 解码
│           └── types/                        # conversation.ts / message.ts / user.ts
│
├── packages/
│   └── types/                                # 共享 TS 类型（@agent-workspace/types）
│
├── errNotes/                                 # 学习笔记（每个目标一个文件）
├── README.md                                 # 本文（项目现状）
├── LEARNING_PLAN.md                          # 学习计划
├── agent-progress.md                         # 进度记录
├── pnpm-workspace.yaml
└── turbo.json
```

**请求链路**：

```text
浏览器 → /api/backend/*  →  Next rewrites  →  http://localhost:9500/*
              （浏览器视角同源，无 CORS 预检）        NestJS
```

---

## 三、已完成内容（当前进度）

> 后端从 Monorepo 到数据库、认证、会话、消息、LLM 已全部打通；前端已完成登录注册、会话列表、聊天页的完整闭环。

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
- CORS 配置允许前端跨域访问（实际上前端走 rewrites 代理，不触发预检）。

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

### 目标八 · Message 消息模块（✅ 已完成）

- **嵌套路由**：`/conversation/:conversationId/messages`，消息挂载在会话之下。
- Prisma 一对多关联：`Conversation 1 — N Message`，并配置 `onDelete: Cascade`（删会话级联删消息）。
- 读写消息前先校验会话归属（`findFirst({ id, userId })`），非本人会话抛 `NotFoundException`。
- 发送流程：先落库 `role='user'` 的消息 → 调 `LlmService` 生成回复 → 落库 `role='assistant'` → 一次返回 `{ userMessage, assistantMessage }`。
- DTO 用 `@IsNotEmpty` + `@Transform(trim)` 做内容校验与清洗。

### 目标九 · LLM 模块（✅ 已完成）

- 基于 **OpenAI SDK** 封装 `LlmService`，通过 `baseURL` 指向 **DashScope 的 OpenAI 兼容接口**，模型 `qwen-plus`（通义千问）。
- 凭证与模型全部走环境变量：`LLM_API_KEY` / `LLM_API_BASE_URL` / `LLM_MODEL`，不写死在代码里。
- `LlmModule` 导出 `LlmService`，由 `MessagesModule` 显式 `imports` 引入，模块间解耦。
- 调用失败统一包成 `InternalServerErrorException('LLM failed')`。
- 当前为**非流式**：一次请求拿到完整回复。

### 目标十 · Next.js 前端（✅ 已完成）

- **App Router 路由**：`/`（首页）、`/login`、`/register`、`/conversations`、`/conversations/[id]`。
- **请求层**（`lib/api.ts`）：统一 `/api/backend` 前缀、自动带 `Authorization: Bearer`、把 HTTP 状态码包成 `ApiError`、把 NestJS 的 `message` 翻译成可读文案。
- **跨域方案**：`next.config.ts` 用 rewrites 把 `/api/backend/:path*` 代理到 `http://localhost:9500`，浏览器视角同源 → 不触发 CORS 预检。
- **登录态**：token 存 `localStorage`（`lib/auth.ts`），受保护页面在 Client Component 的 `useEffect` 里做守卫；因中间件（Next 16 的 `proxy.ts`）在服务端读不到 `localStorage`，故未用中间件重定向。
- **登录 / 注册**：表单提交 → 存 token → 跳会话列表；注册成功后跳回登录页。
- **会话列表**：拉取列表（前端按创建时间倒序）、新建会话（`title` + `content` 均必填）、删除会话（级联删消息）、退出登录。
- **聊天页**：`ChatView` 并行拉取会话详情 + 历史消息 → 发送消息 → 追加 `user` / `assistant` 两条 → 自动滚到底部，等待回复时显示三点占位气泡。
- **消息气泡**按 `role` 渲染（`user` / `assistant` / `system` / `tool`），为后续 Agent 的多角色预留。
- 全站用 **Tailwind CSS 4** 完成样式。

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
| Conversation | `DELETE /conversation/:id` | 删除会话（级联删消息） | 需 JWT |
| Messages | `POST /conversation/:conversationId/messages` | 发送消息，返回 `{ userMessage, assistantMessage }` | 需 JWT |
| Messages | `GET /conversation/:conversationId/messages` | 查询会话消息列表 | 需 JWT |

> 后端端口 `9500`（`apps/api/.env` 的 `PORT`），前端端口 `9501`（`next dev -p 9501`）。

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
  id        String    @id @default(uuid())
  title     String
  content   String
  userId    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  user     User      @relation(fields: [userId], references: [id])
  messages Message[]
}

model Message {
  id             Int          @id @default(autoincrement())
  content        String
  role           String
  conversationId String
  createdAt      DateTime     @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
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
| `20260911064407_add_message` | 新增 Message 表（`onDelete: Cascade`）+ 移除 Conversation 原有软删除标记 |

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

当前学习节点：**后端（NestJS + Prisma + Auth + Conversation + Message + LLM）与前端基础链路均已完成**，下一步进入流式输出。

```text
SSE 流式输出（把 LLM 回复改成逐字返回）
        ↓
Tool Calling（calculator / weather / search …）
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

# 单独启动后端（端口 9500）
pnpm --filter api dev

# 单独启动前端（端口 9501）
pnpm --filter web dev

# Prisma 迁移 / 生成 client
pnpm --filter api exec prisma migrate dev
pnpm --filter api exec prisma generate
```
