# 私信功能部署指南

**日期**: 2025-10-13
**状态**: ✅ 已修复
**Git Commit**: `65c79c1`

---

## 📋 问题描述

部署到 Vercel 后，访问消息 API 返回 500 错误：

```
GET /api/messages/unread 500 (Internal Server Error)
GET /api/conversations 500 (Internal Server Error)
```

**根本原因**: 数据库中缺少 `conversations` 和 `messages` 表。

---

## ✅ 解决方案

### 1. 创建数据库迁移文件

已创建: `prisma/migrations/20251013_add_message_models/migration.sql`

**包含的表结构**:
```sql
-- conversations 表
CREATE TABLE "conversations" (
    "id" TEXT PRIMARY KEY,
    "participant1_id" TEXT NOT NULL,
    "participant2_id" TEXT NOT NULL,
    "last_message_id" TEXT,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- messages 表
CREATE TABLE "messages" (
    "id" TEXT PRIMARY KEY,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- 唯一索引
CREATE UNIQUE INDEX "conversations_participant1_id_participant2_id_key"
ON "conversations"("participant1_id", "participant2_id");

-- 外键约束
ALTER TABLE "conversations"
ADD CONSTRAINT "conversations_participant1_id_fkey"
FOREIGN KEY ("participant1_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "messages"
ADD CONSTRAINT "messages_conversation_id_fkey"
FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE;

ALTER TABLE "messages"
ADD CONSTRAINT "messages_sender_id_fkey"
FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE;

ALTER TABLE "messages"
ADD CONSTRAINT "messages_receiver_id_fkey"
FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE;
```

### 2. Vercel 自动部署

**构建脚本** (已配置在 `package.json`):
```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy && prisma generate && next build"
  }
}
```

**工作流程**:
1. ✅ Vercel 检测到新推送
2. ✅ 运行 `prisma migrate deploy` - 应用数据库迁移
3. ✅ 运行 `prisma generate` - 生成 Prisma Client
4. ✅ 运行 `next build` - 构建 Next.js 应用

---

## 🔧 Vercel 环境变量

确保在 Vercel Dashboard 中配置了以下环境变量：

### 必需的环境变量

```env
# 数据库连接（用于应用运行）
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# 直连URL（用于迁移）
DIRECT_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# NextAuth 配置
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Cloudinary（图片上传）
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 重要说明

1. **DATABASE_URL 和 DIRECT_URL**:
   - 对于 Vercel Postgres，这两个通常相同
   - 对于 Supabase/Neon，DIRECT_URL 使用端口 5432，DATABASE_URL 使用连接池端口 6543

2. **连接字符串格式**:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
   ```

3. **SSL 模式**:
   - 生产环境必须使用 `?sslmode=require`
   - 确保数据库提供商支持 SSL 连接

---

## 📊 部署验证清单

### 部署后检查

1. **Vercel Dashboard**:
   - ✅ 构建日志显示 "Running prisma migrate deploy"
   - ✅ 迁移成功应用（无错误）
   - ✅ 构建成功完成

2. **数据库验证**:
   ```sql
   -- 检查表是否存在
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('conversations', 'messages');

   -- 应该返回 2 行
   ```

3. **API 端点测试**:
   ```bash
   # 测试未读消息 API（需要登录）
   curl https://your-app.vercel.app/api/messages/unread

   # 应该返回 200 或 401（未登录），不应该是 500
   ```

4. **前端功能测试**:
   - ✅ 导航栏显示消息图标
   - ✅ 访问 `/messages` 不报错
   - ✅ 在摄影师页面点击"发私信"
   - ✅ 可以发送消息

---

## 🐛 常见问题排查

### 问题 1: 500 错误持续出现

**症状**: API 仍然返回 500 错误

**可能原因**:
1. 迁移未执行成功
2. 环境变量配置错误
3. 数据库连接问题

**解决步骤**:
```bash
# 1. 检查 Vercel 部署日志
# 在 Vercel Dashboard > Deployments > [最新部署] > Build Logs
# 搜索 "prisma migrate deploy"

# 2. 手动运行迁移（如果自动迁移失败）
# 本地连接生产数据库
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# 3. 验证表结构
DATABASE_URL="postgresql://..." npx prisma db push --force-reset
```

### 问题 2: Prisma Client 类型错误

**症状**: TypeScript 报错找不到 Conversation/Message 类型

**解决方案**:
```bash
# 重新生成 Prisma Client
npx prisma generate

# 重启 TypeScript 服务器（VS Code）
# Cmd/Ctrl + Shift + P > TypeScript: Restart TS Server
```

### 问题 3: 外键约束错误

**症状**: 创建消息时报错 "Foreign key constraint failed"

**可能原因**: users 表中没有对应的用户 ID

**解决方案**:
```sql
-- 检查用户是否存在
SELECT id, username FROM users WHERE id = 'user-id';

-- 如果不存在，需要先创建用户或使用正确的用户 ID
```

---

## 📝 迁移历史

| 迁移名称 | 日期 | 描述 |
|---------|------|------|
| `20251009033413_init` | 2025-10-09 | 初始化数据库表 |
| `20251009035429_add_social_features` | 2025-10-09 | 添加社交功能（点赞、评论、关注） |
| `20251009083756_add_user_role` | 2025-10-09 | 添加用户角色字段 |
| `20251013_add_message_models` | 2025-10-13 | **添加私信功能（conversations, messages）** |

---

## 🔄 回滚方案

如果需要回滚私信功能：

```sql
-- 删除表（注意：会丢失所有消息数据）
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "conversations" CASCADE;
```

或者使用 Prisma：
```bash
# 回滚到上一个迁移
npx prisma migrate resolve --rolled-back 20251013_add_message_models
```

---

## ✅ 成功标志

当以下所有项都完成时，部署成功：

1. ✅ Vercel 构建成功（绿色勾号）
2. ✅ 数据库迁移日志显示成功
3. ✅ API 返回 200/401，不是 500
4. ✅ 前端可以正常访问消息功能
5. ✅ 可以发送和接收消息
6. ✅ 未读消息计数正确显示

---

## 📞 支持

如果遇到问题：
1. 检查 Vercel 部署日志
2. 查看浏览器控制台错误
3. 验证环境变量配置
4. 检查数据库连接状态
5. 参考本文档的"常见问题排查"部分

---

**文档版本**: 1.0
**最后更新**: 2025-10-13
**维护者**: Claude Code Assistant
