# Agent 全栈项目学习路线

## 一、最终项目目标

最终做一个 **AI Agent Workspace（AI Agent 工作台）**，将 Next.js、NestJS、Prisma、Supabase、LLM、RAG、Tool Calling、LangGraph、MCP 等技术串成一个完整的前后端项目。

整体流程：

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

最终 Monorepo：

```text
nest-demo/
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

# 二、技术栈

## 前端

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* React Hook Form
* Zod
* SSE

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

* NestJS
* TypeScript
* Prisma 7
* PostgreSQL
* Supabase
* JWT
* Passport
* DTO / Validation
* SSE
* Redis
* BullMQ
* Docker

---

## AI / Agent

* OpenAI SDK
* LLM API
* Streaming
* Structured Output
* Function Calling / Tool Calling
* Embedding
* pgvector
* RAG
* Agent Loop
* LangGraph
* MCP

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

**不建议一开始就使用 LangChain/LangGraph，而是先手写 Agent Loop，理解 Agent 的核心机制之后再学习框架。**

---

# 三、数据库

当前：

```text
postgres
└── public
    └── User
```

后续逐步扩展：

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

# 四、学习阶段

## Phase 1：NestJS + Prisma 基础

**预计：2～3 天**

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

Prisma：

```text
Prisma
├── Schema
├── Migration
├── CRUD
├── Relation
└── Transaction
```

项目成果：

```text
GET /users
POST /users
GET /users/:id
PATCH /users/:id
DELETE /users/:id
```

---

## Phase 2：用户系统

**预计：2～3 天**

完成：

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

Next.js：

```text
/login
/register
```

---

## Phase 3：Next.js 正式接入

**预计：2～3 天**

重点：

```text
App Router
Layout
Page
Loading
Error
Middleware
Server Component
Client Component
```

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

形成：

```text
Next.js
   ↓
NestJS API
   ↓
Supabase
```

---

## Phase 4：Chat 系统

**预计：3～4 天**

数据库：

```text
Conversation
Message
```

实现：

```text
新建会话
查看会话
发送消息
保存消息
```

先不做 Agent。

先实现：

```text
Next.js
 ↓
NestJS
 ↓
LLM
 ↓
返回答案
```

---

## Phase 5：LLM + Streaming

**预计：3～4 天**

学习：

```text
LLM
Token
Context
Temperature
System Prompt
User Prompt
Assistant Message
Streaming
```

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
实时显示
```

---

## Phase 6：Tool Calling

**预计：4～5 天**

实现：

```text
calculator
weather
search
get_user
```

核心流程：

```text
用户
 ↓
LLM
 ↓
发现需要 Tool
 ↓
调用 Tool
 ↓
获得结果
 ↓
再次调用 LLM
 ↓
最终回答
```

理解：

```text
Agent ≠ LLM

Agent =
LLM
+
Tools
+
Loop
+
State
```

---

## Phase 7：手写第一个 Agent

**预计：4～5 天**

先不使用 LangChain/LangGraph。

自己实现 Agent Loop：

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

最终实现：

```text
Agent
├── System Prompt
├── Tools
├── Memory
├── Max Steps
├── Tool Result
└── Final Answer
```

这一阶段完成后，就真正进入 Agent 开发。

---

## Phase 8：RAG + 知识库

**预计：5～7 天**

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

实现企业知识库式问答：

```text
用户问题
 ↓
Vector Search
 ↓
找到相关文档
 ↓
LLM
 ↓
最终回答
```

---

## Phase 9：LangGraph + MCP

**预计：5～7 天**

学习 LangGraph：

```text
State
Node
Edge
Conditional Edge
Checkpoint
Human-in-the-loop
```

然后学习 MCP：

```text
Agent
 ↓
MCP Client
 ↓
MCP Server
 ↓
Tools
```

---

## Phase 10：工程化

**预计：5～7 天**

加入：

```text
Redis
BullMQ
Docker
日志
异常处理
权限
限流
数据库事务
缓存
Agent Run
Token Usage
```

最终架构：

```text
                    Next.js
                       │
                  HTTP / SSE
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

# 五、时间安排

按照每天 **2～3 小时**：

| 阶段              |         时间 |
| --------------- | ---------: |
| NestJS + Prisma |        3 天 |
| Auth            |        3 天 |
| Next.js         |        3 天 |
| Chat            |        4 天 |
| LLM + Streaming |        4 天 |
| Tool Calling    |        5 天 |
| 手写 Agent        |        5 天 |
| RAG             |        7 天 |
| LangGraph + MCP |        7 天 |
| 工程化             |        7 天 |
| **总计**          | **约 48 天** |

如果每天投入 **4～5 小时**，可以压缩到：

**约 3～4 周。**

---

# 六、整体学习顺序

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

最终项目：

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

---

# 七、当前进度

现在已经完成：

```text
Monorepo
    ↓
Next.js
    ↓
NestJS
    ↓
Prisma 7.10.0
    ↓
Supabase PostgreSQL
    ↓
public.User
```

**下一步：**

使用 Nest CLI 创建 Prisma 模块和 Service：

```bash
pnpm nest g module prisma
pnpm nest g service prisma
```

然后完成：

```text
PrismaModule
      ↓
PrismaService
      ↓
PrismaClient
      ↓
Supabase
      ↓
User
```

之后再创建：

```bash
pnpm nest g module users
pnpm nest g service users
pnpm nest g controller users
```

最终把第一个真实 API 跑通：

```text
GET /users
    ↓
UsersController
    ↓
UsersService
    ↓
PrismaService
    ↓
Supabase User
```
