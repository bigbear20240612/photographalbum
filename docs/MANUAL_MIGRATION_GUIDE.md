# 手动数据库迁移指南

> ⚠️ **仅在 Vercel 自动迁移失败时使用本指南**

如果你看到 API 返回 500 错误，且错误信息提示表不存在，说明数据库迁移没有自动应用。按照以下步骤手动执行迁移。

---

## 🔍 第一步：确认问题

### 1.1 检查 Vercel 部署日志

访问 [Vercel Dashboard](https://vercel.com) → 找到你的项目 → Deployments → 最新部署 → Build Logs

搜索关键词：`prisma migrate deploy`

**如果看到**:
```
✓ Running "prisma migrate deploy"
✓ Database is up to date
```
说明迁移应该成功了，问题可能在其他地方。

**如果看到**:
```
Error: Migration engine exited
Error: Can't reach database server
```
说明迁移失败，需要手动执行。

### 1.2 检查浏览器控制台错误

访问 `https://photographalbum.vercel.app/messages`，打开浏览器开发者工具（F12）：

**如果看到**:
```
GET /api/conversations 500 (Internal Server Error)
ApiError: 获取对话列表失败
```

这确认了数据库表缺失问题。

---

## 🛠️ 第二步：手动执行迁移

### 方法 1: 使用本地环境（推荐）

#### 前提条件
- 已安装 Node.js
- 已克隆项目代码
- 有生产数据库的连接字符串

#### 步骤

1. **获取生产数据库 URL**

访问 Vercel Dashboard → Settings → Environment Variables

复制 `DATABASE_URL` 或 `DIRECT_URL` 的值，格式类似：
```
postgresql://user:password@host.supabase.co:5432/postgres?sslmode=require
```

2. **在本地项目目录运行迁移**

Windows PowerShell:
```powershell
$env:DATABASE_URL="your-production-database-url"
npx prisma migrate deploy
```

Windows CMD:
```cmd
set DATABASE_URL=your-production-database-url
npx prisma migrate deploy
```

Mac/Linux:
```bash
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

3. **验证迁移结果**

应该看到输出：
```
1 migration found in prisma/migrations
Applying migration `20251013_add_message_models`
The following migration have been applied:

migrations/
  └─ 20251013_add_message_models/
    └─ migration.sql

All migrations have been successfully applied.
```

4. **测试 API**

在浏览器访问：
```
https://photographalbum.vercel.app/api/messages/unread
```

应该返回 `401` (需要登录) 或 `200`，而不是 `500`。

---

### 方法 2: 使用 Vercel CLI

#### 前提条件
- 已安装 Vercel CLI: `npm i -g vercel`
- 已登录 Vercel 账号: `vercel login`

#### 步骤

1. **拉取环境变量**

```bash
cd D:\data\CLAUDE_USE\Vercel\photographalbum
vercel env pull .env.production
```

这会创建一个 `.env.production` 文件，包含所有生产环境变量。

2. **运行迁移**

```bash
npx dotenv -e .env.production -- npx prisma migrate deploy
```

或者手动设置环境变量：

```bash
# 查看 .env.production 文件内容
cat .env.production

# 复制 DATABASE_URL 或 DIRECT_URL 的值
set DATABASE_URL=...
npx prisma migrate deploy
```

3. **清理敏感文件**

```bash
rm .env.production
```

⚠️ **重要**: 不要将 `.env.production` 提交到 Git！

---

### 方法 3: 使用数据库客户端直接执行 SQL

#### 前提条件
- 已安装数据库客户端（如 pgAdmin、DBeaver、TablePlus）
- 有数据库访问权限

#### 步骤

1. **连接到生产数据库**

使用 Vercel 提供的数据库连接信息连接。

2. **运行迁移 SQL**

打开文件：`prisma/migrations/20251013_add_message_models/migration.sql`

复制所有内容，在数据库客户端中执行：

```sql
-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "participant1_id" TEXT NOT NULL,
    "participant2_id" TEXT NOT NULL,
    "last_message_id" TEXT,
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_participant1_id_participant2_id_key" ON "conversations"("participant1_id", "participant2_id");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_participant1_id_fkey" FOREIGN KEY ("participant1_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

3. **更新迁移记录表**

```sql
INSERT INTO "_prisma_migrations" (
  id,
  checksum,
  finished_at,
  migration_name,
  logs,
  rolled_back_at,
  started_at,
  applied_steps_count
) VALUES (
  gen_random_uuid(),
  '手动执行',
  NOW(),
  '20251013_add_message_models',
  NULL,
  NULL,
  NOW(),
  1
);
```

---

## ✅ 第三步：验证迁移成功

### 3.1 使用检查脚本（推荐）

运行项目提供的检查脚本：

```bash
node scripts/check-database.js
```

应该看到：
```
✅ conversations 表存在
   当前对话数量: 0
✅ messages 表存在
   当前消息数量: 0
```

### 3.2 手动验证

连接到数据库，运行：

```sql
-- 检查表是否存在
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('conversations', 'messages');

-- 应该返回 2 行
```

### 3.3 测试 API

访问以下 URL（在浏览器中）：

1. `https://photographalbum.vercel.app/api/messages/unread`
   - 预期: 401 (未登录) 或 200
   - ❌ 不应该: 500

2. `https://photographalbum.vercel.app/api/conversations`
   - 预期: 401 (未登录) 或 200
   - ❌ 不应该: 500

### 3.4 测试前端功能

1. 登录网站
2. 访问 `/messages` 页面
3. 应该显示 "暂无对话" 而不是错误信息
4. 访问任意摄影师主页，点击 "发私信"
5. 尝试发送一条消息
6. 检查消息是否成功发送

---

## 🔧 常见问题

### Q1: 执行迁移时报错 "Table already exists"

**原因**: 表已经存在（可能之前手动创建过）

**解决方案**:

选项 1 - 删除现有表重新创建：
```sql
DROP TABLE IF EXISTS "messages" CASCADE;
DROP TABLE IF EXISTS "conversations" CASCADE;
-- 然后重新运行迁移
```

选项 2 - 标记迁移为已完成：
```sql
-- 直接在迁移记录表中标记为已执行
INSERT INTO "_prisma_migrations" (...) VALUES (...);
```

### Q2: 外键约束错误

**原因**: users 表可能不存在或名称不匹配

**检查**:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'users';
```

**解决方案**: 确保先运行之前的所有迁移。

### Q3: 迁移成功但 API 仍返回 500

**可能原因**:
1. Prisma Client 没有重新生成
2. Vercel 部署使用了旧的代码
3. 缓存问题

**解决方案**:

1. 强制重新部署 Vercel
2. 在 Vercel Dashboard 找到最新部署
3. 点击右侧菜单 → Redeploy
4. 等待部署完成

### Q4: 数据库连接失败

**检查清单**:
- [ ] DATABASE_URL 格式正确
- [ ] 数据库服务正常运行
- [ ] 网络可以访问数据库主机
- [ ] SSL 模式设置正确（`?sslmode=require`）
- [ ] 用户名和密码正确

---

## 📋 迁移前检查清单

在执行迁移前，确认以下事项：

- [ ] 已备份数据库（可选但推荐）
- [ ] 已获取正确的生产数据库 URL
- [ ] DATABASE_URL 包含正确的 SSL 模式
- [ ] 已测试数据库连接
- [ ] 已关闭其他可能锁定数据库的连接
- [ ] 已阅读迁移 SQL 内容，确认无误

---

## 🚀 迁移后操作

迁移成功后：

1. **清理敏感信息**
   ```bash
   # 删除包含数据库 URL 的临时文件
   rm .env.production
   rm .env.local
   ```

2. **测试完整功能**
   - 登录网站
   - 测试发送消息
   - 测试接收消息
   - 检查未读计数

3. **监控错误**
   - 查看 Vercel 实时日志
   - 检查浏览器控制台
   - 监控数据库性能

4. **通知团队**
   - 告知其他开发者迁移已完成
   - 更新项目文档
   - 记录遇到的问题和解决方案

---

## 📞 需要帮助？

如果手动迁移仍然失败：

1. **检查 Vercel 文档**: https://vercel.com/docs/storage/postgres
2. **查看 Prisma 文档**: https://www.prisma.io/docs/guides/migrate
3. **查看项目日志**: Vercel Dashboard → Runtime Logs
4. **数据库提供商支持**: 联系 Supabase/Neon/Vercel Postgres 支持

---

## 🎯 快速参考命令

```bash
# 检查迁移状态
npx prisma migrate status

# 执行迁移
DATABASE_URL="..." npx prisma migrate deploy

# 强制重置（⚠️ 会删除所有数据）
DATABASE_URL="..." npx prisma migrate reset --force

# 检查数据库连接
DATABASE_URL="..." npx prisma db execute --stdin <<< "SELECT 1;"

# 查看迁移历史
DATABASE_URL="..." npx prisma migrate status

# 生成 Prisma Client
npx prisma generate

# 检查数据库表
node scripts/check-database.js
```

---

**文档版本**: 1.0
**创建日期**: 2025-10-13
**适用场景**: Vercel 自动迁移失败时的手动迁移指南
