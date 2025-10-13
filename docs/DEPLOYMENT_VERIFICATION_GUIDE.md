# 部署验证指南

**日期**: 2025-10-13
**迁移提交**: `65c79c1`
**目的**: 验证消息功能数据库迁移是否成功部署

---

## ✅ 验证清单

### 1. Vercel Dashboard 检查

访问 [Vercel Dashboard](https://vercel.com/dashboard)，找到 `photographalbum` 项目：

#### 1.1 检查最新部署状态
- [ ] 最新部署显示为 **Ready** (绿色勾号)
- [ ] 部署的提交是 `65c79c1` 或更新
- [ ] 构建时间显示在合理范围内（通常 2-5 分钟）

#### 1.2 检查构建日志
点击最新部署 → **Build Logs**，搜索以下关键信息：

```bash
# 应该看到这些日志
✓ Running "vercel-build"
✓ Running "prisma migrate deploy"
✓ Applying migration `20251013_add_message_models`
✓ Database is up to date
✓ Running "prisma generate"
✓ Generated Prisma Client
✓ Running "next build"
```

**关键检查点**：
- [ ] 看到 "Applying migration `20251013_add_message_models`"
- [ ] 迁移应用成功，无错误信息
- [ ] Prisma Client 生成成功
- [ ] Next.js 构建完成

**⚠️ 如果看到迁移错误**：
```bash
Error: Migration failed to apply cleanly
Error: Table 'conversations' already exists
```
这可能是因为之前手动运行过迁移。请继续检查下一步。

---

### 2. API 端点测试

使用浏览器开发者工具或 API 测试工具（如 Postman）：

#### 2.1 测试未读消息 API

**URL**: `https://photographalbum.vercel.app/api/messages/unread`
**方法**: GET
**预期结果**:
- ✅ **200** - 如果你已登录，返回 `{ "success": true, "unreadCount": 0 }`
- ✅ **401** - 如果未登录，返回 `{ "success": false, "error": "未授权访问" }`
- ❌ **500** - 如果返回 500，说明数据库迁移失败

#### 2.2 测试对话列表 API

**URL**: `https://photographalbum.vercel.app/api/conversations`
**方法**: GET
**预期结果**:
- ✅ **200** - 返回 `{ "success": true, "conversations": [] }`
- ✅ **401** - 返回 `{ "success": false, "error": "未授权访问" }`
- ❌ **500** - 说明数据库迁移失败

#### 2.3 测试消息列表 API

**URL**: `https://photographalbum.vercel.app/api/messages?otherUserId=test123`
**方法**: GET
**预期结果**:
- ✅ **200/400/401** - 任何非 500 的状态码都是正常的
- ❌ **500** - 说明数据库迁移失败

---

### 3. 数据库直接验证（可选）

如果你有数据库访问权限，可以直接连接数据库验证：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('conversations', 'messages');

-- 应该返回 2 行
```

**预期结果**：
```
 table_name
--------------
 conversations
 messages
```

```sql
-- 检查表结构
\d conversations
\d messages

-- 应该看到所有列和约束
```

---

### 4. 前端功能测试

访问 `https://photographalbum.vercel.app` 并登录：

#### 4.1 导航栏检查
- [ ] 顶部导航栏显示消息图标（信封图标）
- [ ] 消息图标可以点击
- [ ] 如果有未读消息，显示红色数字徽章

#### 4.2 消息页面访问
访问 `https://photographalbum.vercel.app/messages`：
- [ ] 页面正常加载，无 500 错误
- [ ] 显示 "暂无对话" 或对话列表
- [ ] 无浏览器控制台错误

#### 4.3 发送消息测试
1. 访问任意摄影师主页，例如：`/photographer/[username]`
2. 检查是否显示 **"发私信"** 按钮
3. 点击按钮，应该跳转到 `/messages/[username]`
4. 尝试发送一条测试消息
5. 检查：
   - [ ] 消息成功发送
   - [ ] 消息显示在聊天界面
   - [ ] 无错误提示
   - [ ] 返回 `/messages` 页面，对话出现在列表中

#### 4.4 接收消息测试
1. 使用另一个账号（或让朋友）给你发消息
2. 检查：
   - [ ] 导航栏消息图标显示未读数字
   - [ ] 对话列表显示未读徽章
   - [ ] 打开对话后，消息标记为已读
   - [ ] 未读徽章消失

---

## 🐛 故障排查

### 问题 1: 仍然返回 500 错误

**可能原因**：
1. 数据库迁移未成功应用
2. 环境变量配置错误
3. 数据库连接问题

**解决步骤**：

#### 方法 1: 检查 Vercel 环境变量
访问 Vercel Dashboard → Settings → Environment Variables，确认以下变量存在：

```env
DATABASE_URL=postgresql://...?sslmode=require
DIRECT_URL=postgresql://...?sslmode=require
NEXTAUTH_URL=https://photographalbum.vercel.app
NEXTAUTH_SECRET=your-secret-key
```

#### 方法 2: 手动运行迁移
如果自动迁移失败，可以手动执行：

```bash
# 在本地，使用生产数据库连接字符串
DATABASE_URL="postgresql://your-production-db-url" npx prisma migrate deploy

# 或者使用 Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

#### 方法 3: 强制重新部署
在 Vercel Dashboard 中：
1. 找到最新的成功部署
2. 点击右侧的 "..." 菜单
3. 选择 **Redeploy**
4. 确保勾选 "Use existing build cache"

#### 方法 4: 检查数据库连接
```bash
# 测试数据库连接
DATABASE_URL="your-production-url" npx prisma db execute --stdin <<< "SELECT 1;"
```

---

### 问题 2: Prisma Client 类型错误

**症状**: TypeScript 报错找不到 Conversation 或 Message 类型

**解决方案**：
```bash
# 重新生成 Prisma Client
npx prisma generate

# 重启 TypeScript 服务器（VS Code）
# Cmd/Ctrl + Shift + P > TypeScript: Restart TS Server
```

---

### 问题 3: 前端显示但功能异常

**可能原因**: 缓存问题

**解决方案**：
1. 清除浏览器缓存
2. 硬刷新页面 (Ctrl+Shift+R / Cmd+Shift+R)
3. 在无痕模式下测试
4. 检查浏览器控制台是否有 JavaScript 错误

---

## 📋 快速验证脚本

### 使用 Node.js 脚本验证

项目已包含验证脚本 `scripts/verify-deployment.js`，运行：

```bash
node scripts/verify-deployment.js
```

**预期输出**：
```
============================================================
🚀 开始验证 Vercel 部署
============================================================
📍 生产环境: https://photographalbum.vercel.app

🔍 检查端点: /api/messages/unread
✅ 状态码: 401 (预期)

🔍 检查端点: /api/conversations
✅ 状态码: 401 (预期)

🔍 检查端点: /api/messages?otherUserId=test
✅ 状态码: 401 (预期)

============================================================
📊 验证结果汇总
============================================================
✅ 未读消息 API: 通过
✅ 对话列表 API: 通过
✅ 消息列表 API: 通过

============================================================
🎉 所有检查通过！消息功能部署成功！
============================================================
```

### 使用 curl 快速测试

```bash
# 测试未读消息 API
curl -i https://photographalbum.vercel.app/api/messages/unread

# 预期: HTTP/1.1 401 或 200

# 测试对话列表 API
curl -i https://photographalbum.vercel.app/api/conversations

# 预期: HTTP/1.1 401 或 200

# 如果返回 500，说明迁移失败
```

---

## ✅ 成功标志

当以下所有项都完成时，部署验证成功：

1. ✅ Vercel 构建日志显示迁移成功
2. ✅ API 端点返回 200/401，不是 500
3. ✅ 前端消息页面可以正常访问
4. ✅ 可以成功发送和接收消息
5. ✅ 未读消息计数正常工作
6. ✅ 消息标记为已读功能正常

---

## 📞 需要帮助？

如果验证过程中遇到问题：

1. **查看 Vercel 部署日志**: 最详细的错误信息在这里
2. **检查浏览器控制台**: 查看是否有 JavaScript 错误
3. **查看网络请求**: 开发者工具 → Network → 找到失败的请求
4. **参考文档**: `docs/MESSAGE_FEATURE_DEPLOYMENT.md` 有更详细的故障排查

---

## 📝 验证记录模板

复制下面的模板，填写你的验证结果：

```markdown
## 验证记录

**验证日期**: _______________
**验证人**: _______________

### Vercel 部署检查
- [ ] 构建成功
- [ ] 迁移已应用
- [ ] 无构建错误

### API 测试
- [ ] /api/messages/unread - 状态码: ______
- [ ] /api/conversations - 状态码: ______
- [ ] /api/messages - 状态码: ______

### 前端测试
- [ ] 消息图标显示正常
- [ ] 消息页面可访问
- [ ] 可以发送消息
- [ ] 可以接收消息
- [ ] 未读计数正常

### 数据库检查（可选）
- [ ] conversations 表存在
- [ ] messages 表存在
- [ ] 外键约束正确

### 整体结果
- [ ] ✅ 验证通过
- [ ] ⚠️ 部分问题（描述）: _______________
- [ ] ❌ 验证失败（原因）: _______________
```

---

**文档版本**: 1.0
**最后更新**: 2025-10-13
**相关文档**:
- `docs/MESSAGE_FEATURE_DEPLOYMENT.md` - 部署指南
- `scripts/verify-deployment.js` - 自动验证脚本
