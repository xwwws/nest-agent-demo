# Agent 全栈项目学习进度

> 更新时间：2026-08-31  
> 项目目标：基于 Monorepo 构建一个完整的 AI Agent 全栈项目  
> 前端：Next.js  
> 后端：NestJS  
> 数据库：Supabase PostgreSQL  
> ORM：Prisma 7.10.0

---

## 一、最终项目目标

最终构建一个 **AI Agent Workspace（AI Agent 工作台）**，将 Next.js、NestJS、Prisma、Supabase、LLM、RAG、Tool Calling、LangGraph、MCP 等技术串成一个完整的前后端项目。

最终用户可以：

```text
注册 / 登录
    ↓
进入工作台
    ↓
创建 Agent
    ↓
配置 Agent
├── System Prompt
├── Model
├── Tools
└── Knowledge Base
    ↓
和 Agent 对话
    ↓
Agent 执行
├── 调用 LLM
├── 调用 Tool
├── 查询知识库
└── 保存 Memory
    ↓
流式返回
    ↓
Next.js 展示
```

---

# 二、Monorepo 项目结构

目标结构：

```text
nest-demo/
├── apps/
│   ├── web/                    # Next.js 前端
│   └── api/                    # NestJS 后端
│
├── packages/
│   ├── types/                  # 前后端共享 TS 类型
│   ├── eslint-config/
│   └── tsconfig/
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

---

# 三、当前技术栈

## 前端

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod
- SSE

重点学习：

```text
Next.js App Router
Server Component
Client Component
Server Action
Route Handler
Middleware
Streaming
```

---

## 后端

- NestJS
- TypeScript
- Prisma 7.10.0
- PostgreSQL
- Supabase
- JWT
- Passport
- DTO / Validation
- SSE
- Redis
- BullMQ
- Docker

---

## AI / Agent

- OpenAI SDK
- LLM API
- Streaming
- Structured Output
- Function Calling / Tool Calling
- Embedding
- pgvector
- RAG
- Agent Loop
- LangGraph
- MCP

学习顺序：

```text
LLM
 ↓
Streaming
 ↓
Structured Output
 ↓
Tool Calling
 ↓
Agent Loop
 ↓
RAG
 ↓
LangGraph
 ↓
MCP
```

---

# 四、数据库规划

当前数据库：

```text
Supabase PostgreSQL
└── postgres
    └── public
        └── User
```

当前 `User` Schema：

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

后续数据库会逐渐扩展为：

```text
User
 │
 ├── Conversation
 │       └── Message
 │
 ├── Agent
 │       ├── AgentTool
 │       └── AgentKnowledgeBase
 │
 ├── Memory
 │
 └── ...
```

知识库：

```text
KnowledgeBase
      │
      └── Document
              │
              └── DocumentChunk
                       │
                       └── embedding
```

Agent 执行记录：

```text
AgentRun
   │
   ├── AgentStep
   ├── ToolCall
   └── TokenUsage
```

---

# 五、当前已经完成

## 1. Monorepo

状态：**已完成**

项目已经采用 pnpm Monorepo。

```text
nest-demo/
├── apps/
│   ├── api/
│   └── web/
└── ...
```

---

## 2. Next.js

状态：**基础完成**

前端已经可以正常启动。

由于已有 React SPA 开发经验，因此 React 基础不作为主要学习内容。

后续重点学习：

```text
Next.js App Router
Server Component
Client Component
Middleware
Streaming
```

---

## 3. NestJS

状态：**基础完成 / 开始进入实战**

NestJS 后端已经可以正常启动。

后续重点学习：

```text
Module
Controller
Service
Provider
Dependency Injection
DTO
Pipe
Guard
Interceptor
Exception Filter
```

---

## 4. Prisma

状态：**已完成基础安装和配置**

当前版本：

```text
prisma              7.10.0
@prisma/client      7.10.0
@prisma/adapter-pg  7.10.0
pg                  8.23.0
@types/pg           8.23.1
```

已经确认 Prisma CLI：

```bash
pnpm prisma --version
```

输出：

```text
7.10.0
```

---

## 5. Prisma 配置

当前：

```text
apps/api/
├── .env
├── prisma7.config.ts
├── prisma/
│   └── schema.prisma
└── ...
```

`prisma7.config.ts`：

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

---

## 6. Supabase PostgreSQL

状态：**已完成**

已经成功连接 Supabase PostgreSQL。

数据库：

```text
postgres
```

Schema：

```text
public
```

目前决定：

> 继续使用 PostgreSQL 默认的 `public` Schema，不修改。

---

## 7. Prisma DB Pull

状态：**已完成**

已经成功执行：

```bash
pnpm prisma db pull
```

证明：

```text
Prisma
   ↓
DATABASE_URL
   ↓
Supabase PostgreSQL
```

连接正常。

---

## 8. User Model

状态：**已完成**

当前 Prisma Schema 已经定义：

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 9. Prisma Migration

状态：**已执行**

已经执行：

```bash
pnpm prisma migrate dev --name init
```

目标是将：

```text
schema.prisma
      ↓
Migration
      ↓
Supabase PostgreSQL
```

并创建：

```text
public.User
```

以及 Prisma 的：

```text
_prisma_migrations
```

---

# 六、当前所在学习节点

当前最准确的位置：

```text
Monorepo
   ↓ ✅
Next.js
   ↓ ✅
NestJS
   ↓ ✅
Prisma 7.10.0
   ↓ ✅
Supabase PostgreSQL
   ↓ ✅
Prisma db pull
   ↓ ✅
User Schema
   ↓ ✅
Prisma Migration
   ↓
PrismaService       ← 当前学习节点
   ↓
UsersModule
   ↓
Auth
   ↓
Next.js 登录
   ↓
Chat
   ↓
LLM
   ↓
Streaming
   ↓
Tool Calling
   ↓
Agent Loop
   ↓
RAG
   ↓
LangGraph
   ↓
MCP
```

---

# 七、当前进度总览

目前属于 **第一阶段的开头，但项目基础设施已经基本打通**。

```text
Agent 全栈项目

[████░░░░░░░░░░░░░░░░] 约 10%
```

具体：

| 模块 | 当前进度 |
|---|---:|
| Monorepo | 100% |
| Next.js 基础 | 20% |
| NestJS 基础 | 20% |
| Prisma 基础 | 80% |
| Supabase | 90% |
| 数据库基础 | 90% |
| User API | 0% |
| Auth | 0% |
| Chat | 0% |
| LLM | 0% |
| Streaming | 0% |
| Tool Calling | 0% |
| Agent | 0% |
| RAG | 0% |
| LangGraph | 0% |
| MCP | 0% |
| 工程化 | 0% |

> 这里的“约 10%”代表整个项目的学习/开发进度，而不是知识掌握程度。

---

# 八、接下来马上做什么

## 当前任务：PrismaService

使用 Nest CLI 创建：

```bash
pnpm nest g module prisma
pnpm nest g service prisma
```

生成：

```text
src/
└── prisma/
    ├── prisma.module.ts
    └── prisma.service.ts
```

然后完成：

```text
PrismaModule
      ↓
PrismaService
      ↓
PrismaClient
      ↓
PrismaPg Adapter
      ↓
pg
      ↓
Supabase PostgreSQL
```

---

# 九、接下来近期课程

## 第 1 阶段：NestJS + Prisma

```text
PrismaService
 ↓
UsersModule
 ↓
UsersService
 ↓
UsersController
 ↓
GET /users
 ↓
POST /users
 ↓
CRUD
```

---

## 第 2 阶段：Auth

```text
注册
 ↓
密码 Hash
 ↓
登录
 ↓
JWT
 ↓
Access Token
 ↓
Guard
 ↓
当前用户
```

接口：

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

---

## 第 3 阶段：Next.js

```text
Login
 ↓
Dashboard
 ↓
用户状态
 ↓
Auth
 ↓
NestJS API
```

---

## 第 4 阶段：Chat

```text
Conversation
 ↓
Message
 ↓
Next.js Chat UI
 ↓
NestJS
```

---

## 第 5 阶段：LLM

```text
NestJS
 ↓
OpenAI SDK
 ↓
LLM
 ↓
返回答案
```

然后增加：

```text
Streaming
 ↓
SSE
 ↓
Next.js 实时显示
```

---

## 第 6 阶段：Tool Calling

```text
User
 ↓
LLM
 ↓
Tool Call
 ↓
Tool
 ↓
Tool Result
 ↓
LLM
 ↓
Final Answer
```

---

## 第 7 阶段：Agent

手写 Agent Loop：

```text
while (!finished) {
  response = LLM(messages, tools)

  if (response.toolCall) {
    result = executeTool()
    messages.push(result)
    continue
  }

  return response
}
```

---

## 第 8 阶段：RAG

```text
Document
 ↓
Chunk
 ↓
Embedding
 ↓
pgvector
 ↓
Vector Search
 ↓
Context
 ↓
LLM
```

---

## 第 9 阶段：LangGraph + MCP

```text
Agent
 ↓
LangGraph
 ↓
State / Node / Edge
 ↓
MCP
 ↓
External Tools
```

---

## 第 10 阶段：工程化

加入：

```text
Redis
BullMQ
Docker
日志
异常处理
权限
限流
事务
缓存
Agent Run
Token Usage
```

---

# 十、预计时间

按照每天 **2～3 小时**：

| 阶段 | 时间 |
|---|---:|
| NestJS + Prisma | 3 天 |
| Auth | 3 天 |
| Next.js | 3 天 |
| Chat | 4 天 |
| LLM + Streaming | 4 天 |
| Tool Calling | 5 天 |
| 手写 Agent | 5 天 |
| RAG | 7 天 |
| LangGraph + MCP | 7 天 |
| 工程化 | 7 天 |
| **总计** | **约 48 天** |

如果每天投入 **4～5 小时**：

**约 3～4 周。**

---

# 十一、最终项目能力

完成整个项目后，应该能够独立理解和实现：

```text
前端
├── Next.js
├── React
├── App Router
├── Server / Client Component
├── SSE
└── AI Chat UI

后端
├── NestJS
├── IOC / DI
├── REST API
├── JWT
├── Guard
├── DTO
└── SSE

数据库
├── PostgreSQL
├── Supabase
├── Prisma
├── Migration
├── Relation
└── pgvector

AI
├── LLM
├── Prompt
├── Streaming
├── Structured Output
├── Tool Calling
├── Agent Loop
├── RAG
├── LangGraph
└── MCP

工程化
├── Monorepo
├── Redis
├── BullMQ
├── Docker
├── Logging
├── Error Handling
└── Agent Observability
```

---

## 当前课程位置

**现在正式进入：**

> **NestJS + Prisma → PrismaService**

下一步严格按照学习流程：

```text
① Nest CLI 创建 Module
② Nest CLI 创建 Service
③ 理解 Module / Provider / DI
④ 编写 PrismaService
⑤ 连接 PrismaClient
⑥ 启动 NestJS
⑦ 查询 User
⑧ 创建 UsersModule
⑨ 完成第一个 API
```

之后再进入 Auth，不跳课。
