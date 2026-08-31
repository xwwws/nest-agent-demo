# AI Agent 工作台 · 学习计划

> 项目代号：**Agent Workspace**
> 定位：基于 Next.js + NestJS + PostgreSQL + Prisma + LLM + RAG + Tool Calling + LangGraph + MCP 构建的全栈 Agent 平台
> 来源：ChatGPT 生成的学习路线（2026-08-30 归档）

---

## 目录

- [一、最终项目目标](#一最终项目目标)
- [二、前端技术栈](#二前端技术栈)
- [三、后端技术栈](#三后端技术栈)
- [四、AI / Agent 技术栈](#四ai--agent-技术栈)
- [五、数据库最终结构](#五数据库最终结构)
- [六、完整学习路线（10 个阶段）](#六完整学习路线10-个阶段)
- [七、时间安排](#七时间安排)
- [八、学习顺序（不要变）](#八学习顺序不要变)
- [九、最终你会得到什么](#九最终你会得到什么)

---

## 一、最终项目目标

我们最终做一个：

**AI Agent 工作台 / Agent Workspace** —— 类似一个简化版的 AI Chat + Agent 平台。

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
Agent 思考
    ├── 调用 LLM
    ├── 调用 Tool
    ├── 查询知识库
    └── 保存 Memory
    ↓
流式返回
    ↓
Next.js 展示
```

最终项目结构：

```text
nest-demo/
│
├── apps/
│   ├── web/                    # Next.js
│   └── api/                    # NestJS
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

## 二、前端技术栈

| 技术 | 用途 |
|---|---|
| Next.js | Web 应用 |
| React | UI |
| TypeScript | 类型系统 |
| Tailwind CSS | UI |
| shadcn/ui | UI 组件 |
| TanStack Query | API 状态管理 |
| Zustand | 客户端状态 |
| React Hook Form | 表单 |
| Zod | 前端校验 |
| SSE | Agent 流式输出 |

你以前写过 React SPA，所以这里重点学习：

- Next.js App Router
- Server Component
- Client Component
- Server Action
- Route Handler
- Middleware
- Streaming

但我们的**核心业务 API 仍然由 NestJS 提供**。

---

## 三、后端技术栈

| 技术 | 用途 |
|---|---|
| NestJS | API 服务 |
| TypeScript | 后端开发 |
| Prisma 7 | ORM |
| PostgreSQL | 数据库 |
| Supabase | PostgreSQL 托管 |
| JWT | 登录认证 |
| Passport | Auth |
| class-validator / Zod | 参数校验 |
| SSE | AI 流式响应 |
| BullMQ | 异步任务 |
| Redis | 缓存 / Queue |
| Docker | 服务容器化 |

---

## 四、AI / Agent 技术栈

这里才是我们整个课程的重点。

**建议不要一开始就上 LangChain。先手写 Agent 核心循环，你会真正理解 Agent 是怎么工作的。**

然后再学习：

```text
OpenAI SDK
        ↓
Tool Calling
        ↓
Agent Loop
        ↓
LangGraph
```

| 技术 | 学习内容 |
|---|---|
| OpenAI API | LLM 基础 |
| OpenAI SDK | 模型调用 |
| Streaming | 流式输出 |
| Structured Output | JSON 输出 |
| Function Calling | Tool |
| Embedding | 向量 |
| pgvector | 向量数据库 |
| RAG | 知识库 |
| Agent Loop | Agent 核心 |
| LangGraph | Agent 编排 |
| MCP | 工具协议 |
| Redis | Agent 状态 / Queue |

---

## 五、数据库最终结构

我们现在只有：

```text
User
```

最终会逐渐变成：

```text
User
 │
 ├── Conversation
 │       │
 │       └── Message
 │
 ├── Agent
 │       │
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
   │
   ├── ToolCall
   │
   └── TokenUsage
```

---

## 六、完整学习路线（10 个阶段）

### Phase 1：NestJS + Prisma 基础

> 预计：2～3 天
> **★ 你现在在这里**

学习：

```text
NestJS
├── Module
├── Controller
├── Service
├── Provider
├── Dependency Injection
├── DTO
├── Pipe
├── Guard
├── Interceptor
└── Exception Filter
```

数据库：

```text
Prisma
├── Schema
├── Migration
├── CRUD
├── Relation
└── Transaction
```

项目成果，完成：

```text
GET    /users
POST   /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

### Phase 2：用户系统

> 预计：2～3 天

完成：

```text
注册
 ↓
密码 bcrypt/argon2 hash
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

NestJS：

- AuthModule
- UsersModule

接口：

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

前端：

- `/login`
- `/register`

### Phase 3：Next.js 正式接入

> 预计：2～3 天

把现在的 Next.js 从"能跑"变成真正的 Web App。

学习：

- App Router
- Layout
- Page
- Loading
- Error
- Middleware
- Server Component
- Client Component

完成：

```text
登录页
 ↓
Dashboard
 ↓
用户信息
 ↓
退出登录
```

同时学习 Next.js ↔ NestJS API 的前后端分离架构。

### Phase 4：Chat 系统

> 预计：3～4 天

开始进入 AI。

数据库：

- Conversation
- Message

页面：

- `/dashboard`
- `/chat`

实现：

- 新建会话
- 查看会话
- 发送消息
- 保存消息

**先不要 Agent。** 先实现：

```text
Next.js
 ↓
NestJS
 ↓
LLM
 ↓
返回答案
```

### Phase 5：LLM + Streaming

> 预计：3～4 天
> **非常重要的一阶段**

学习：

- LLM
- Token
- Context
- Temperature
- System Prompt
- User Prompt
- Assistant Message
- Streaming

实现：

```text
用户输入
 ↓
NestJS
 ↓
OpenAI SDK
 ↓
SSE
 ↓
Next.js
 ↓
逐字显示
```

最终体验：

```text
用户：帮我分析一下 NestJS IOC

AI：
NestJS 的 IOC...
       ↓
实时输出
```

### Phase 6：Tool Calling

> 预计：4～5 天
> **Agent 的真正起点**

先做几个简单 Tool：

- calculator
- weather
- search
- get_user

例如：

```text
用户：
帮我计算 123 * 456

Agent
 ↓
LLM
 ↓
发现需要 calculator
 ↓
调用 calculator
 ↓
得到结果
 ↓
LLM
 ↓
最终回答
```

你会开始理解：

```text
Agent ≠ LLM

而是：

LLM
+
Tools
+
Loop
+
State
```

### Phase 7：手写第一个 Agent

> 预计：4～5 天
> **非常重要的一阶段**

我们先不使用 LangChain/LangGraph。

自己实现 **Agent Loop**，核心逻辑：

```ts
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

然后实现：

```text
Agent
├── System Prompt
├── Tools
├── Memory
├── Max Steps
├── Tool Result
└── Final Answer
```

做到这里，你就已经真正入门 Agent 开发了。

### Phase 8：RAG + 知识库

> 预计：5～7 天
> **第二个大模块**

实现：

```text
上传 PDF / Markdown / TXT
        ↓
Document
        ↓
切 Chunk
        ↓
Embedding
        ↓
pgvector
        ↓
向量搜索
        ↓
Context
        ↓
LLM
```

最终：

```text
用户：
根据我的公司技术文档回答：
Nest 项目的数据库规范是什么？

Agent
 ↓
Vector Search
 ↓
找到相关文档
 ↓
LLM
 ↓
回答
```

这时候你的 Agent 就真正具有"知识"。

### Phase 9：LangGraph + MCP

> 预计：5～7 天

前面你已经自己实现 Agent Loop，这时候再学习框架就非常有意义。

学习：

```text
LangGraph
├── State
├── Node
├── Edge
├── Conditional Edge
├── Checkpoint
└── Human-in-the-loop
```

然后是 MCP，理解：

```text
Agent
 ↓
MCP Client
 ↓
MCP Server
 ↓
Tools
```

最终可以让 Agent 调用外部能力。

### Phase 10：工程化

> 预计：5～7 天

最后把这个项目从 Demo 变成真正的项目。

加入：

- Redis
- BullMQ
- Docker
- 日志
- 异常处理
- 权限
- 限流
- 数据库事务
- 缓存
- Agent Run
- Token Usage

最终架构：

```text
                    Next.js
                       │
                       │ SSE / HTTP
                       ↓
                  NestJS API
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       Prisma        Redis       Agent
          │            │            │
          ↓            ↓            ↓
      Supabase      BullMQ       LLM
          │                         │
          │                         ├── Tools
          │                         ├── RAG
          │                         └── MCP
          ↓
      PostgreSQL
        pgvector
```

---

## 七、时间安排

如果你是每天 2～3 小时：

| 阶段 | 时间 |
|---|---|
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

也就是大约 **6～8 周** 完成一个比较完整的 Agent 全栈项目。

如果每天能投入 4～5 小时，可以压缩到 **3～4 周**。

---

## 八、学习顺序（不要变）

尤其是这几个顺序非常重要：

```text
NestJS
 ↓
Prisma
 ↓
Auth
 ↓
Next.js
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
 ↓
工程化
```

**不要一上来就学 LangChain。**

你本身有前端经验，真正需要补的是：

- 后端工程
- LLM 原理
- Agent 架构

如果直接上 LangChain / LangGraph / MCP，很容易变成"会调 API，但不知道 Agent 为什么这么运行"。

---

## 九、最终你会得到什么

最后这个项目不是一个简单的 Todo：

```text
Next.js
      ↓
NestJS
      ↓
PostgreSQL
      ↓
JWT
      ↓
LLM
      ↓
Streaming
      ↓
Tool Calling
      ↓
Agent
      ↓
RAG
      ↓
LangGraph
      ↓
MCP
```

而是一个**可以写进简历的完整项目**：

> AI Agent Workspace —— 基于 Next.js + NestJS + PostgreSQL + Prisma + LLM + RAG + Tool Calling + LangGraph + MCP 构建的全栈 Agent 平台。

而且我们现在的进度正好在：

```text
                    ★ 你现在
                       ↓
Supabase → Prisma → PrismaService → Users → Auth
                                      ↓
                                  Next.js
                                      ↓
                                    Chat
                                      ↓
                                    LLM
                                      ↓
                                   Agent
```

---

## 当前进行中的任务

> 下一步：用 `pnpm nest g module prisma` / `pnpm nest g service prisma` 正式创建 Prisma 模块，然后把 User 查询跑通。
