# AI Agent 前端页面开发规划

> 项目：AI Agent 全栈学习项目  
> 前端：Next.js  
> 后端：NestJS  
> 数据库：Supabase PostgreSQL  
> 当前前端状态：从 0 开始  
> 目标：先完成基础 Web 聊天应用，再逐步接入 AI Agent

---

## 一、前端最终要实现什么

前端最终需要形成下面这套页面和功能：

```text
Next.js
│
├── 首页 /
│
├── 登录 /login
│
├── 注册 /register
│
└── 对话系统
    │
    ├── 会话列表 /conversations
    │
    └── 聊天页面 /conversations/[id]
```

整体用户流程：

```text
打开网站
  ↓
登录 / 注册
  ↓
进入会话列表
  ↓
创建一个 Conversation
  ↓
进入聊天页面
  ↓
查看历史 Message
  ↓
输入消息
  ↓
发送消息
  ↓
消息保存到后端
  ↓
页面显示消息
  ↓
以后再接入 AI Agent
```

---

# 二、页面一览

| 页面 | 路由 | 当前阶段 | 主要功能 |
|---|---|---|---|
| 首页 | `/` | 第一阶段 | 项目入口 |
| 登录 | `/login` | 第一阶段 | 用户登录、获取 JWT |
| 注册 | `/register` | 第一阶段 | 注册新用户 |
| 会话列表 | `/conversations` | 第二阶段 | 查看/创建/删除 Conversation |
| 聊天页面 | `/conversations/[id]` | 第三阶段 | 查看和发送 Message |
| Agent 聊天 | `/conversations/[id]` | 后续 | 接入 LLM / Agent |

---

# 三、首页 `/`

文件：

```text
apps/web/app/page.tsx
```

## 功能

第一阶段只需要作为项目入口。

可以包含：

```text
AI Agent
一个简单的 AI Agent 学习项目

[登录]
[注册]
```

后续可以增加：

- 项目介绍
- Agent 能力介绍
- 最近会话
- 用户信息

## 第一阶段不要做

- AI 对话
- Agent
- RAG
- Tool Calling
- SSE

---

# 四、登录页面 `/login`

文件：

```text
apps/web/app/login/page.tsx
```

## 页面元素

```text
登录

邮箱
[________________]

密码
[________________]

[登录]

还没有账号？
[注册]
```

## 需要实现的功能

### 1. 邮箱输入

保存：

```ts
email
```

### 2. 密码输入

保存：

```ts
password
```

### 3. 点击登录

调用 NestJS：

```http
POST /auth/login
```

请求：

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

### 4. 登录成功

后端返回 JWT。

前端保存 Token。

然后跳转：

```text
/conversations
```

### 5. 登录失败

显示错误信息，例如：

```text
邮箱或密码错误
```

---

# 五、注册页面 `/register`

文件：

```text
apps/web/app/register/page.tsx
```

## 页面元素

```text
注册

邮箱
[________________]

密码
[________________]

姓名
[________________]

[注册]

已有账号？
[登录]
```

## 调用接口

```http
POST /auth/register
```

请求：

```json
{
  "email": "test@test.com",
  "password": "123456",
  "name": "张三"
}
```

## 注册成功

可以：

```text
注册成功
 ↓
跳转 /login
```

第一阶段暂时不要求注册成功后自动登录。

---

# 六、会话列表 `/conversations`

文件：

```text
apps/web/app/conversations/page.tsx
```

这是登录以后最重要的页面之一。

## 页面结构

```text
┌─────────────────────────────────────┐
│ AI Agent                  [退出登录] │
├──────────────┬──────────────────────┤
│ 会话列表      │                      │
│              │   选择一个会话        │
│ + 新建会话    │                      │
│              │                      │
│ AI 学习      │                      │
│ Python       │                      │
│ NestJS       │                      │
│              │                      │
└──────────────┴──────────────────────┘
```

第一阶段甚至可以先做得非常简单：

```text
会话列表

[+ 新建会话]

----------------
AI Agent 学习
----------------
Python 学习
----------------
NestJS 学习
----------------
```

---

# 七、会话列表需要调用的 API

后端已经有 Conversation CRUD。

前端需要使用：

## 获取会话

```http
GET /conversations
```

页面打开时：

```text
页面加载
 ↓
GET /conversations
 ↓
NestJS
 ↓
返回当前用户的 Conversation
 ↓
React 保存到 state
 ↓
渲染列表
```

---

## 创建会话

```http
POST /conversations
```

例如：

```json
{
  "title": "AI Agent 学习"
}
```

创建成功：

```text
POST
 ↓
返回 Conversation
 ↓
加入列表
 ↓
或者直接进入聊天页面
```

---

## 获取单个会话

```http
GET /conversations/:id
```

主要用于聊天页面确认当前 Conversation。

---

## 删除会话

```http
DELETE /conversations/:id
```

点击删除：

```text
确认删除？
    ↓
DELETE
    ↓
从页面列表删除
```

---

# 八、聊天页面 `/conversations/[id]`

文件：

```text
apps/web/app/conversations/[id]/page.tsx
```

这是整个前端最核心的页面。

## 页面结构

```text
┌─────────────────────────────────────┐
│ ← AI Agent 学习                     │
├─────────────────────────────────────┤
│                                     │
│ 用户                                │
│ 你好，我想学习 AI Agent             │
│                                     │
│ AI                                  │
│ 你好，我可以帮助你学习 AI Agent。   │
│                                     │
│ 用户                                │
│ 什么是 Agent？                      │
│                                     │
├─────────────────────────────────────┤
│ 输入消息...                         │
│                              [发送] │
└─────────────────────────────────────┘
```

---

# 九、聊天页面第一阶段需要实现什么

## 1. 获取 Conversation ID

例如：

```text
/conversations/abc123
```

前端拿到：

```text
conversationId = abc123
```

---

## 2. 获取历史消息

调用：

```http
GET /conversations/:conversationId/messages
```

例如：

```http
GET /conversations/abc123/messages
```

返回：

```json
[
  {
    "id": "1",
    "conversationId": "abc123",
    "role": "user",
    "content": "你好",
    "createdAt": "..."
  },
  {
    "id": "2",
    "conversationId": "abc123",
    "role": "assistant",
    "content": "你好！",
    "createdAt": "..."
  }
]
```

前端渲染：

```text
用户：你好

AI：你好！
```

---

# 十、发送 Message

输入框：

```text
[请输入消息................] [发送]
```

点击发送：

```http
POST /conversations/:conversationId/messages
```

请求：

```json
{
  "content": "你好，我想学习 AI Agent"
}
```

后端：

```text
NestJS
 ↓
检查 Conversation 是否属于当前用户
 ↓
创建 Message
 ↓
返回 Message
```

前端：

```text
收到返回结果
 ↓
setMessages()
 ↓
页面立即显示
```

---

# 十一、Message 的前端数据结构

建议定义：

```ts
interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
}
```

目前：

```text
role = user
```

未来：

```text
role = user
role = assistant
role = system
role = tool
```

所以不要在前端设计成：

```ts
isUser: boolean
```

应该保留：

```ts
role: string
```

这样未来接入 Agent 不需要重新设计。

---

# 十二、前端认证

这是前端必须解决的一件事情。

后端已经有：

```text
JWT
Global Auth Guard
@PublicApi()
```

因此前端访问受保护 API 时需要：

```http
Authorization: Bearer <JWT>
```

例如：

```ts
fetch('/conversations', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

# 十三、前端需要统一 API 请求

随着页面越来越多，不建议每个页面都写：

```ts
fetch(...)
```

最终建议建立：

```text
apps/web/
└── lib/
    └── api.ts
```

例如：

```ts
export async function apiFetch(
  path: string,
  options?: RequestInit,
) {
  // 统一处理：
  // Token
  // Base URL
  // headers
  // 错误
}
```

然后页面：

```ts
apiFetch('/conversations')
```

而不是到处重复：

```ts
fetch(
  'http://localhost:3001/conversations',
  ...
)
```

---

# 十四、建议的前端目录

最终逐步形成：

```text
apps/web/
│
├── app/
│   ├── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   └── conversations/
│       ├── page.tsx
│       │
│       └── [id]/
│           └── page.tsx
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── conversations/
│   │   ├── ConversationList.tsx
│   │   └── ConversationItem.tsx
│   │
│   └── messages/
│       ├── MessageList.tsx
│       ├── MessageItem.tsx
│       └── MessageInput.tsx
│
├── lib/
│   ├── api.ts
│   └── auth.ts
│
└── types/
    ├── user.ts
    ├── conversation.ts
    └── message.ts
```

但是：

> **不要一次创建这么多文件。**

这是最终目标结构。

我们会随着学习逐步创建。

---

# 十五、开发顺序

严格按照下面顺序开发：

## Phase 1：Next.js 基础

- [ ] 首页 `/`
- [ ] 登录 `/login`
- [ ] 注册 `/register`
- [ ] Next.js 路由
- [ ] React `useState`
- [ ] 表单处理

---

## Phase 2：连接认证 API

- [ ] 登录 API
- [ ] 注册 API
- [ ] JWT Token 保存
- [ ] 登录成功跳转
- [ ] 登录失败提示
- [ ] 退出登录

---

## Phase 3：Conversation

- [ ] `/conversations`
- [ ] 获取 Conversation
- [ ] Conversation 列表
- [ ] 创建 Conversation
- [ ] 删除 Conversation
- [ ] 点击 Conversation 进入 `/conversations/[id]`

---

## Phase 4：Message

- [ ] `/conversations/[id]`
- [ ] 获取 Message
- [ ] Message 列表
- [ ] 输入框
- [ ] 发送 Message
- [ ] 页面更新 Message
- [ ] 用户消息和 AI 消息区分显示

---

## Phase 5：前端代码重构

- [ ] API Client
- [ ] TypeScript 类型
- [ ] Components 拆分
- [ ] Loading 状态
- [ ] Error 状态
- [ ] 空状态
- [ ] 基础 UI

---

# 十六、最后才进入 AI Agent

当前：

```text
用户
 ↓
Next.js
 ↓
NestJS
 ↓
PostgreSQL
```

完成 Agent 后：

```text
用户
 ↓
Next.js
 ↓
NestJS
 ↓
Agent Service
 ↓
LLM
 ↓
Tool / RAG / Memory
 ↓
Agent Response
 ↓
NestJS
 ↓
Message
 ↓
Next.js
```

所以现在做的这些前端页面并不是“普通聊天项目”，而是在给后面的 Agent 搭 UI 和数据通道。

---

# 十七、当前学习任务

你现在不要直接做完整前端。

按照这个顺序：

```text
① /
   ↓
② /login
   ↓
③ /register
   ↓
④ 登录 API
   ↓
⑤ JWT
   ↓
⑥ /conversations
   ↓
⑦ Conversation API
   ↓
⑧ /conversations/[id]
   ↓
⑨ Message API
   ↓
⑩ AI Agent
```

**当前第一任务只有：**

> 从 0 创建 `/`、`/login`、`/register` 三个 Next.js 页面，并理解 App Router 的文件路由。

后续每一步我会继续按照“**这一章做什么 → 为什么 → 你先尝试 → 完整参考代码 → 测试 → 总结**”的方式带你做。
