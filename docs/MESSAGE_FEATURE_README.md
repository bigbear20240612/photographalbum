# 私信功能完整文档

> 📅 **实施日期**: 2025-10-13
> 📦 **版本**: 1.0
> ✅ **状态**: 已完成开发，等待部署验证

---

## 📚 文档导航

本功能包含以下文档：

1. **[MESSAGE_FEATURE_DEPLOYMENT.md](./MESSAGE_FEATURE_DEPLOYMENT.md)** - 部署指南
   - 问题描述和解决方案
   - 数据库迁移详情
   - 环境变量配置
   - 常见问题排查

2. **[DEPLOYMENT_VERIFICATION_GUIDE.md](./DEPLOYMENT_VERIFICATION_GUIDE.md)** - 验证指南
   - 完整的验证清单
   - API 端点测试方法
   - 前端功能测试步骤
   - 故障排查流程

3. **本文档** - 功能概览和快速参考

---

## 🎯 功能概述

### 核心功能

私信功能允许用户之间进行一对一的即时通讯，包括：

- ✅ 创建和管理对话
- ✅ 发送和接收消息
- ✅ 未读消息提醒
- ✅ 消息已读状态
- ✅ 对话历史记录
- ✅ 导航栏实时通知

### 技术亮点

- 🔐 完整的权限控制（仅对话参与者可访问）
- 🔄 自动查找或创建对话
- 📱 响应式设计（支持桌面和移动端）
- ⌨️ 键盘快捷键（Ctrl/Cmd + Enter 发送）
- 🔔 系统通知集成
- 📊 实时未读计数（30秒轮询）
- 🎨 优雅的 UI 设计

---

## 📁 文件结构

### 数据库层

```
prisma/
├── schema.prisma                          # Prisma 数据模型定义
│   ├── Conversation model                 # 对话模型
│   └── Message model                      # 消息模型
└── migrations/
    └── 20251013_add_message_models/       # 消息功能迁移
        └── migration.sql                  # SQL 迁移脚本
```

### API 层

```
src/app/api/
├── conversations/
│   └── route.ts                           # 对话 CRUD API
├── messages/
│   ├── route.ts                           # 消息 CRUD API
│   └── unread/
│       └── route.ts                       # 未读消息计数 API
```

### 组件层

```
src/components/
├── messages/
│   ├── MessageInput.tsx                   # 消息输入组件
│   ├── MessageList.tsx                    # 消息列表组件
│   └── ConversationCard.tsx               # 对话卡片组件
└── layout/
    └── Navbar.tsx                         # 导航栏（含消息图标）
```

### 页面层

```
src/app/
├── messages/
│   ├── page.tsx                           # 消息列表页
│   └── [username]/
│       └── page.tsx                       # 对话详情页
└── photographer/
    └── [username]/
        └── page.tsx                       # 摄影师主页（含发私信按钮）
```

### 工具层

```
src/lib/
└── apiService.ts                          # API 服务层
    ├── Message 类型定义
    ├── Conversation 类型定义
    └── messageApi 方法集
```

---

## 🔧 技术实现

### 数据模型

#### Conversation (对话)

```typescript
{
  id: string                    // 对话 ID
  participant1Id: string        // 参与者1 ID
  participant2Id: string        // 参与者2 ID
  lastMessageId: string?        // 最后一条消息 ID
  lastMessageAt: DateTime?      // 最后消息时间
  createdAt: DateTime           // 创建时间
  updatedAt: DateTime           // 更新时间
}

// 约束：
// - participant1Id + participant2Id 唯一
// - CASCADE 删除关联消息
```

#### Message (消息)

```typescript
{
  id: string                    // 消息 ID
  conversationId: string        // 所属对话 ID
  senderId: string              // 发送者 ID
  receiverId: string            // 接收者 ID
  content: string               // 消息内容（最多2000字符）
  read: boolean                 // 是否已读
  createdAt: DateTime           // 发送时间
  updatedAt: DateTime           // 更新时间
}

// 约束：
// - 外键关联到 conversations、users
// - CASCADE 删除
```

### API 端点

#### GET /api/conversations
获取当前用户的所有对话列表

**响应**:
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conversation_id",
      "otherUser": {
        "id": "user_id",
        "username": "photographer1",
        "displayName": "Photographer One",
        "avatarUrl": "https://..."
      },
      "lastMessage": {
        "id": "message_id",
        "content": "你好！",
        "read": false,
        "senderId": "user_id",
        "receiverId": "current_user_id",
        "createdAt": "2025-10-13T10:00:00Z"
      },
      "unreadCount": 3,
      "lastMessageAt": "2025-10-13T10:00:00Z",
      "createdAt": "2025-10-12T15:30:00Z"
    }
  ]
}
```

#### POST /api/conversations
创建或获取与指定用户的对话

**请求体**:
```json
{
  "otherUserId": "target_user_id"
}
```

**响应**:
```json
{
  "success": true,
  "conversation": {
    "id": "conversation_id",
    "otherUser": {
      "id": "user_id",
      "username": "photographer1",
      "displayName": "Photographer One",
      "avatarUrl": "https://..."
    }
  }
}
```

#### GET /api/messages
获取对话中的消息（自动标记为已读）

**查询参数**:
- `conversationId` - 对话 ID
- `otherUserId` - 对方用户 ID（二选一）
- `limit` - 返回数量（默认 50）
- `offset` - 偏移量（默认 0）

**响应**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "message_id",
      "conversationId": "conversation_id",
      "senderId": "user_id",
      "receiverId": "current_user_id",
      "content": "你好！",
      "read": true,
      "createdAt": "2025-10-13T10:00:00Z",
      "updatedAt": "2025-10-13T10:01:00Z",
      "sender": {
        "id": "user_id",
        "username": "photographer1",
        "displayName": "Photographer One",
        "avatarUrl": "https://..."
      }
    }
  ],
  "hasMore": false,
  "conversationId": "conversation_id"
}
```

#### POST /api/messages
发送新消息

**请求体**:
```json
{
  "receiverId": "target_user_id",
  "content": "消息内容"
}
```

**验证规则**:
- 内容不能为空
- 内容最多 2000 字符
- 不能给自己发消息
- 接收者必须存在

**响应**:
```json
{
  "success": true,
  "message": {
    "id": "message_id",
    "conversationId": "conversation_id",
    "senderId": "current_user_id",
    "receiverId": "target_user_id",
    "content": "消息内容",
    "read": false,
    "createdAt": "2025-10-13T10:00:00Z",
    "sender": {
      "id": "current_user_id",
      "username": "myusername",
      "displayName": "My Name",
      "avatarUrl": "https://..."
    }
  },
  "conversationId": "conversation_id"
}
```

**副作用**:
- 创建或更新对话
- 更新对话的 lastMessageAt
- 创建系统通知给接收者

#### GET /api/messages/unread
获取未读消息总数

**响应**:
```json
{
  "success": true,
  "unreadCount": 5
}
```

---

## 🎨 UI 组件

### MessageInput
消息输入框组件

**Props**:
```typescript
{
  onSend: (content: string) => Promise<void>  // 发送回调
  disabled?: boolean                          // 是否禁用
  placeholder?: string                        // 占位符文字
}
```

**功能**:
- 多行文本输入（自动调整高度）
- 字符计数（2000 字符限制）
- Ctrl/Cmd + Enter 快捷键发送
- 发送中状态禁用
- 发送后自动清空

### MessageList
消息列表组件

**Props**:
```typescript
{
  messages: Message[]      // 消息数组
  currentUserId: string    // 当前用户 ID
  isLoading?: boolean      // 加载状态
}
```

**功能**:
- 消息气泡布局（左右分布）
- 已读/未读状态显示
- 相对时间显示（"3分钟前"）
- 自动滚动到最新消息
- 空状态提示

### ConversationCard
对话卡片组件

**Props**:
```typescript
{
  conversation: Conversation  // 对话数据
  currentUserId: string       // 当前用户 ID
  isActive?: boolean          // 是否为当前激活对话
}
```

**功能**:
- 头像显示（支持默认头像）
- 用户名和显示名
- 最后消息预览（最多 50 字符）
- 相对时间显示
- 未读消息徽章
- 悬停和激活状态样式

---

## 🚀 使用流程

### 用户视角

1. **发起对话**
   - 访问摄影师主页
   - 点击 "发私信" 按钮
   - 跳转到对话页面

2. **发送消息**
   - 在输入框输入文字
   - 按 Ctrl/Cmd + Enter 或点击 "发送"
   - 消息立即显示在聊天界面

3. **接收消息**
   - 导航栏消息图标显示未读数字
   - 点击图标查看对话列表
   - 点击对话进入详情页
   - 消息自动标记为已读

4. **查看历史**
   - 访问 `/messages` 查看所有对话
   - 对话按最后消息时间排序
   - 显示未读消息徽章

### 开发者视角

1. **创建对话**
   ```typescript
   const response = await messageApi.getOrCreateConversation(otherUserId);
   const conversationId = response.conversation.id;
   ```

2. **发送消息**
   ```typescript
   const message = await messageApi.sendMessage({
     receiverId: otherUserId,
     content: '你好！'
   });
   ```

3. **获取消息**
   ```typescript
   const { messages } = await messageApi.getMessages({
     otherUserId: otherUserId,
     limit: 50
   });
   ```

4. **获取未读数**
   ```typescript
   const { unreadCount } = await messageApi.getUnreadCount();
   ```

---

## 🔐 权限控制

### 访问控制

所有消息 API 都需要登录：

```typescript
const session = await auth();
if (!session?.user?.id) {
  return NextResponse.json(
    { success: false, error: '未授权访问' },
    { status: 401 }
  );
}
```

### 对话访问验证

只有对话参与者可以访问消息：

```typescript
const conversation = await prisma.conversation.findFirst({
  where: {
    id: conversationId,
    OR: [
      { participant1Id: userId },
      { participant2Id: userId },
    ],
  },
});

if (!conversation) {
  return NextResponse.json(
    { success: false, error: '对话不存在或无权访问' },
    { status: 403 }
  );
}
```

### 防止自我消息

```typescript
if (userId === receiverId) {
  return NextResponse.json(
    { success: false, error: '不能给自己发消息' },
    { status: 400 }
  );
}
```

---

## 🔔 通知系统集成

发送消息时自动创建通知：

```typescript
await prisma.notification.create({
  data: {
    userId: receiverId,
    type: 'MESSAGE',
    title: '新消息',
    content: `${senderName} 给你发送了一条消息`,
    data: JSON.stringify({
      messageId: message.id,
      conversationId: conversation.id,
      senderId: userId,
      preview: content.slice(0, 50),
    }),
  },
});
```

---

## 📊 性能优化

### 数据库查询优化

1. **索引优化**
   - conversations 表：`(participant1_id, participant2_id)` 唯一索引
   - messages 表：`conversation_id` 外键索引自动创建

2. **关联查询优化**
   ```typescript
   // 使用 include 预加载关联数据
   const conversations = await prisma.conversation.findMany({
     include: {
       participant1: { select: { id: true, username: true, ... } },
       messages: {
         orderBy: { createdAt: 'desc' },
         take: 1,  // 只取最后一条消息
       },
     },
   });
   ```

3. **分页支持**
   ```typescript
   const messages = await prisma.message.findMany({
     take: limit,      // 限制返回数量
     skip: offset,     // 跳过前 N 条
     orderBy: { createdAt: 'desc' },
   });
   ```

### 前端优化

1. **轮询频率控制**
   - 未读消息每 30 秒检查一次
   - 避免过于频繁的请求

2. **自动滚动优化**
   ```typescript
   useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);
   ```

3. **防抖处理**
   - 发送按钮在发送中禁用
   - 防止重复提交

---

## 🧪 测试建议

### 单元测试

```typescript
// 测试 API 路由
describe('POST /api/messages', () => {
  it('should send message successfully', async () => {
    const response = await POST({
      json: () => ({ receiverId: 'user2', content: 'Hello' })
    });
    expect(response.status).toBe(200);
  });

  it('should reject empty content', async () => {
    const response = await POST({
      json: () => ({ receiverId: 'user2', content: '' })
    });
    expect(response.status).toBe(400);
  });
});
```

### 集成测试

```typescript
// 测试完整流程
describe('Messaging Flow', () => {
  it('should create conversation and send message', async () => {
    // 1. 创建对话
    const conv = await createConversation(user1, user2);

    // 2. 发送消息
    const message = await sendMessage(conv.id, 'Hello');

    // 3. 验证消息
    expect(message.content).toBe('Hello');
    expect(message.read).toBe(false);

    // 4. 标记已读
    await getMessages(conv.id, user2);
    const updated = await getMessage(message.id);
    expect(updated.read).toBe(true);
  });
});
```

### E2E 测试

```typescript
// 使用 Playwright
test('user can send message to photographer', async ({ page }) => {
  // 1. 登录
  await page.goto('/login');
  await page.fill('[name="username"]', 'user1');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // 2. 访问摄影师主页
  await page.goto('/photographer/photographer1');

  // 3. 点击发私信
  await page.click('text=发私信');

  // 4. 发送消息
  await page.fill('textarea', 'Hello, I love your work!');
  await page.click('button:has-text("发送")');

  // 5. 验证消息显示
  await expect(page.locator('text=Hello, I love your work!')).toBeVisible();
});
```

---

## 📈 未来优化方向

### 功能增强

- [ ] 实时消息推送（WebSocket）
- [ ] 消息搜索功能
- [ ] 图片和文件发送
- [ ] 消息撤回
- [ ] 消息引用回复
- [ ] 表情符号支持
- [ ] 打字状态提示
- [ ] 消息已读回执（显示阅读时间）
- [ ] 对话置顶
- [ ] 消息免打扰

### 性能优化

- [ ] 虚拟滚动（处理大量消息）
- [ ] 消息分页加载
- [ ] 图片懒加载
- [ ] Service Worker 缓存
- [ ] 离线消息队列

### 用户体验

- [ ] 消息发送失败重试
- [ ] 消息发送状态（发送中、已发送、已送达）
- [ ] 更丰富的通知提示音
- [ ] 桌面通知支持
- [ ] 快捷键支持
- [ ] Markdown 渲染支持
- [ ] 链接预览

---

## 🔗 相关资源

### 内部文档

- [MESSAGE_FEATURE_DEPLOYMENT.md](./MESSAGE_FEATURE_DEPLOYMENT.md) - 部署详细指南
- [DEPLOYMENT_VERIFICATION_GUIDE.md](./DEPLOYMENT_VERIFICATION_GUIDE.md) - 验证步骤

### 外部参考

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [NextAuth.js v5](https://authjs.dev/)
- [date-fns Documentation](https://date-fns.org/)

### 代码仓库

- GitHub: `https://github.com/[your-username]/photographalbum`
- Vercel: `https://photographalbum.vercel.app`

---

## 📝 更新日志

### v1.0 (2025-10-13)

**新功能**:
- ✅ 完整的一对一私信功能
- ✅ 对话列表和历史记录
- ✅ 未读消息提醒
- ✅ 消息已读状态
- ✅ 导航栏集成

**技术实现**:
- ✅ Prisma 数据模型
- ✅ RESTful API 端点
- ✅ React 组件库
- ✅ 响应式设计

**文档**:
- ✅ 部署指南
- ✅ 验证指南
- ✅ 功能文档

---

**维护者**: Claude Code Assistant
**最后更新**: 2025-10-13
**项目状态**: ✅ 开发完成，等待部署验证
