# 紧急修复：数据库表缺失问题

## 🚨 问题诊断

### 错误信息：
```
The table `public.users` does not exist in the current database
code: 'P2021'
```

### 根本原因：
Prisma 迁移在 Vercel 部署时**没有成功执行**，导致数据库中没有创建任何表。

---

## 🔍 第一步：检查 Vercel 构建日志

### 需要确认的内容：

进入 Vercel Dashboard → Deployments → 最新部署 → Building

在日志中搜索 `prisma migrate deploy`，应该看到：

#### ✅ 成功的情况：
```
> prisma migrate deploy

Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database

3 migrations found in prisma/migrations

Applying migration `20251009033413_init`
Applying migration `20251009035429_add_social_features`
Applying migration `20251009083756_add_user_role`

The following migrations have been applied:

migrations/
  └─ 20251009033413_init/
  └─ 20251009035429_add_social_features/
  └─ 20251009083756_add_user_role/

All migrations have been successfully applied.
```

#### ❌ 失败的情况（你可能遇到的）：
```
> prisma migrate deploy

Error: P1013: The provided database string is invalid
Error: Connection timeout
Error: Authentication failed
```

或者根本**没有找到** `prisma migrate deploy` 的输出。

---

## 🎯 解决方案

### 方案 1: 手动运行迁移（推荐，最快）

#### 步骤 1: 在本地配置数据库连接

创建本地 `.env.local` 文件（如果还没有）：

```env
# 使用直连 URL
DATABASE_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"
```

⚠️ **注意：** 使用 **DIRECT_URL**（直连），不要用 Accelerate URL！

#### 步骤 2: 运行迁移

```bash
# 确保在项目根目录
cd D:\data\CLAUDE_USE\Vercel\photographalbum

# 运行迁移
npx prisma migrate deploy
```

#### 步骤 3: 验证迁移

```bash
# 查看数据库状态
npx prisma migrate status

# 应该显示：
# Database schema is up to date!
```

#### 步骤 4: 测试注册

现在重新访问：https://photographalbum.vercel.app/register

尝试注册，应该成功了！

---

### 方案 2: 修复 Vercel 环境变量

如果方案 1 失败，说明环境变量配置有问题。

#### 检查清单：

进入 Vercel: Settings → Environment Variables

**确认 DIRECT_URL：**
```
Key: DIRECT_URL
Value: postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require

✅ Environments: Production
✅ Environments: Preview
```

**确认 DATABASE_URL：**
```
Key: DATABASE_URL
Value: prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rcVo4bW9DZFk1eU5qa0dlVzl6eXciLCJhcGlfa2V5IjoiMDFLNzhZNDY1OVBKUFg0WkFLWUZLWEhKUlIiLCJ0ZW5hbnRfaWQiOiI5OTczNjdhZWQyMzM4ZWE1ZTkzZjQ2MjM3YjFkZGExOTZlMDc2YjEzNDZlMTZkODhjOTQxMjNlZDQxMzNlNjU1IiwiaW50ZXJuYWxfc2VjcmV0IjoiOGJiZTNjMzctNWU5ZC00NzhiLThiYTAtMzE3MzI3YmRjNGQ4In0.qZNrP7CF8_XA-Ff7mZaKzL78Io2jbrtdx_00shK0-p4

✅ Environments: Production
✅ Environments: Preview
```

#### 修复后重新部署：

1. Deployments → 最新部署 → "..." → "Redeploy"
2. 仔细查看构建日志中的 `prisma migrate deploy` 部分
3. 确认看到 "All migrations have been successfully applied"

---

### 方案 3: 临时使用直连 URL（如果 Accelerate 有问题）

如果 Accelerate 连接有问题，可以暂时都用直连：

**修改 Vercel 环境变量：**
```
DATABASE_URL: postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require

DIRECT_URL: postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require
```

（两个 URL 使用相同的直连值）

然后重新部署。

⚠️ **缺点：** 失去 Accelerate 的缓存和连接池优势。

---

## 🔧 package.json 检查

确认 `vercel-build` 脚本存在：

```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy && prisma generate && next build"
  }
}
```

如果没有这个脚本，Vercel 会使用默认的 `build` 脚本，可能不包含迁移。

---

## 📊 验证数据库连接

### 测试 1: 本地连接测试

```bash
# 设置环境变量
export DATABASE_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"

# 测试连接
npx prisma db pull

# 如果成功，应该显示：
# Introspecting based on datasource defined in prisma/schema.prisma
# ✔ Introspected 14 models and wrote them into prisma/schema.prisma
```

### 测试 2: 查看现有表

```bash
# 使用 Prisma Studio
npx prisma studio

# 或者直接查询
npx prisma db execute --stdin <<EOF
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
EOF
```

如果显示**没有表**或**表列表为空**，说明确实需要运行迁移。

---

## 🚀 完整修复流程（推荐）

### 步骤 1: 本地运行迁移

```bash
# 1. 设置环境变量（Windows PowerShell）
$env:DATABASE_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"

# 或者使用 .env.local 文件
# 创建文件内容如上

# 2. 运行迁移
npx prisma migrate deploy

# 3. 验证
npx prisma migrate status
```

### 步骤 2: 确认 Vercel 环境变量

确保 `DIRECT_URL` 在 Vercel 中正确配置。

### 步骤 3: 测试应用

访问：https://photographalbum.vercel.app/register

尝试注册用户。

### 步骤 4: 如果仍然失败

查看 Vercel Runtime Logs，提供完整错误信息。

---

## 📋 故障排查检查清单

- [ ] 确认 `DIRECT_URL` 在 Vercel 中配置正确
- [ ] 确认 `DATABASE_URL` 在 Vercel 中配置正确
- [ ] 确认 `vercel-build` 脚本存在于 package.json
- [ ] 确认本地可以连接到数据库
- [ ] 确认本地可以运行 `prisma migrate deploy`
- [ ] 确认 Vercel 构建日志中包含迁移输出
- [ ] 确认迁移显示"成功应用"
- [ ] 测试注册功能

---

## 🎯 预期结果

### 迁移成功后：

**数据库应该包含以下表：**
- users
- albums
- photos
- categories
- accounts
- sessions
- verification_tokens
- likes
- comments
- follows
- notifications

### 注册成功响应：

```json
{
  "message": "注册成功",
  "user": {
    "id": "xxx",
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "testuser",
    "createdAt": "2025-10-11T..."
  }
}
```

---

## 💡 关键提示

1. ⚠️ **必须使用 DIRECT_URL** 运行迁移，Accelerate URL 不支持 DDL 操作
2. ✅ 本地手动运行迁移是最可靠的方法
3. ✅ 运行一次迁移后，数据库表永久存在，不需要每次部署都运行
4. ℹ️ 如果 Vercel 构建时迁移失败，应用仍会部署，但没有表

---

## 🆘 仍然失败？

提供以下信息：

1. **本地运行 `npx prisma migrate deploy` 的完整输出**
2. **`npx prisma migrate status` 的输出**
3. **Vercel 构建日志中 `prisma migrate deploy` 部分的完整内容**
4. **Vercel 环境变量的截图**（隐藏敏感信息）

我会进一步协助排查！
