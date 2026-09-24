# Agent ↔ Conversation 关联问题修复说明

> 修复时间：2026-09-24
> 涉及模块：`apps/api/src/agent`、`apps/api/src/conversation`、`apps/api/src/messages`

## 一、问题现象

`Conversation` 模型上有 `agentId`，创建会话的 DTO 里也要传 `agentId`，但整个项目里
**没有任何创建 Agent 的入口**（Agent 表里永远是空的），于是这条关联关系是"悬空"的：

- 前端 / 接口根本没法先创建一个 Agent，再拿着它的 id 去建会话；
- 传了 `agentId` 也必然失败，传个空值又会直接 500。

## 二、根因分析（共 3 个独立问题）

### 1. `AgentModule` 没有导出 `AgentService`（这是最致命的一个）

```ts
// 上一个提交给 ConversationService 注入了 AgentService
constructor(
  private readonly prisma: PrismaService,
  private readonly agentService: AgentService, // ← 来自 AgentModule
) {}
```

`ConversationModule` 虽然 `imports: [AgentModule]`，但 `AgentModule` 里只有
`providers` 没有 `exports`。Nest 的作用域规则是：**import 一个模块只能拿到它 exported 的
provider**，所以 `AgentService` 在 `ConversationModule` 上下文里根本不存在，
应用启动时就会报依赖解析失败（`Nest can't resolve dependencies of the ConversationService`）。
→ 这就是"后台 Agent 没有创建成功"的直接原因：Agent 服务压根没被创建出来。

### 2. Agent 数据永远无法产生

- `AgentController` 只有 `GET /agent`、`GET /agent/:id`，没有 `POST`；
- `CreateAgentDto` 是个空类（`export class CreateAgentDto {}`）；
- `AgentService` 也没有 `create` 方法。

即只有"读"的通道，没有"写"的通道，所以 Agent 表注定为空，`agentId` 也就无从谈起。

### 3. `agentId` / `systemPrompt` 的空值处理会炸

```ts
@Transform(({ value }) => value.trim()) // 传 null 时 → TypeError
agentId?: string | null;
```

两个坑：

- 前端显式传 `null`（比如"不绑定 Agent"、"清空提示词"）时 `value.trim()` 直接抛
  `TypeError`，接口返回 500 而不是正常处理；
- `ConversationService.create` 用 `data: { ...createConversationDto }` 整体展开，
  如果传的是空字符串 `''`，Prisma 会**真把它写进 `agentId`**，触发外键约束错误
  （空串不是 `null`）。

## 三、改动清单

| 文件 | 改动 |
| --- | --- |
| `src/agent/agent.module.ts` | 新增 `exports: [AgentService]`，修复 DI |
| `src/agent/dto/create-agent.dto.ts` | 补 `name`、`systemPrompt` 两个必填字段 + 空值安全 trim |
| `src/agent/agent.service.ts` | 新增 `create()`，id 交由数据库 `cuid` 默认值生成 |
| `src/agent/agent.controller.ts` | 新增 `POST /agent` |
| `src/conversation/dto/create-conversation.dto.ts` | `trim` 改为空值安全（`typeof value === 'string'` 才 trim） |
| `src/conversation/conversation.service.ts` | 抽出 `resolveAgentId()` 做归一化 + 存在性校验；`create` 改为显式挑字段构造 `data`；`update` 支持绑定/解绑 |
| `src/messages/messages.service.ts` | 删掉重复的第二次 `conversation.findFirst`，直接用 `include: { agent: true }` 查回来的结果 |

## 四、改动后的行为规则

### 创建 / 更新会话时的 `agentId`

| 传值 | 行为 |
| --- | --- |
| 不传该键（`undefined`） | 会话不绑定 Agent，正常创建 |
| `null` 或 `''` | 视为"不绑定 / 解绑"，写入 `null`，不再 500 和外键报错 |
| 一个真实存在的 agent id | 校验通过后绑定 |
| 一个不存在的 id | 抛 `404 Agent not found`，不会落到数据库报外键错误 |

### 提示词优先级（`messages.service`）

```
绑定的 Agent.systemPrompt  >  会话自己的 systemPrompt  >  DEFAULT_SYSTEM_PROMPT（LlmService 兜底）
```

## 五、接口变化

```http
POST /agent
Content-Type: application/json
Authorization: Bearer <token>

{ "name": "代码助手", "systemPrompt": "你是一个资深 TypeScript 工程师……" }

# → 201
{ "id": "cxxxxxxx", "name": "代码助手", "systemPrompt": "...", "createdAt": "...", "updatedAt": "..." }
```

拿到返回的 `id` 后，即可：

```http
POST /conversation
{ "title": "标题", "content": "内容", "agentId": "cxxxxxxx" }
```

## 六、验证步骤（建议自行执行）

1. 重启 API（本次只改代码，**没有改 schema、不需要再 migrate**）；
2. `POST /agent` 建一个 Agent，`GET /agent` 确认列表里有数据；
3. 带这个 `agentId` 建会话 → 应成功；
4. 传一个假的 `agentId` → 应返回 404 `Agent not found`；
5. 传 `"agentId": null` → 应正常创建（修复前是 500）。

## 七、后续可选（本次未做）

- `PATCH /agent`、`DELETE /agent`：目前 Agent 只支持创建和查询；
- Agent 目前是全局共享的（表里没有 `userId`），如果要做"每个用户自己的 Agent"，需要加字段和迁移；
- 前端 `apps/web` 目前创建会话时**不传** `agentId`，所以会话创建链路本来就不受影响；
  若要在 UI 上选 Agent，需要新增一个 `GET /agent` 的下拉选择组件。
