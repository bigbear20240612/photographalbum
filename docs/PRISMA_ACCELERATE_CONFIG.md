# Prisma Accelerate 数据库配置指南

## 🎯 什么是 Prisma Accelerate？

Prisma Accelerate 是 Prisma 提供的数据库加速服务，它提供：
- ✅ 全球边缘缓存
- ✅ 连接池管理
- ✅ 查询加速
- ✅ 免费的 PostgreSQL 数据库托管

## 📋 你的数据库配置

根据你提供的信息，你使用的是 Prisma 自己托管的数据库服务：

### 数据库连接信息：

```env
# 直连 URL（用于迁移）
POSTGRES_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"

# Accelerate URL（用于查询，包含缓存）
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rcVo4bW9DZFk1eU5qa0dlVzl6eXciLCJhcGlfa2V5IjoiMDFLNzhZNDY1OVBKUFg0WkFLWUZLWEhKUlIiLCJ0ZW5hbnRfaWQiOiI5OTczNjdhZWQyMzM4ZWE1ZTkzZjQ2MjM3YjFkZGExOTZlMDc2YjEzNDZlMTZkODhjOTQxMjNlZDQxMzNlNjU1IiwiaW50ZXJuYWxfc2VjcmV0IjoiOGJiZTNjMzctNWU5ZC00NzhiLThiYTAtMzE3MzI3YmRjNGQ4In0.qZNrP7CF8_XA-Ff7mZaKzL78Io2jbrtdx_00shK0-p4"

# 应用连接 URL（推荐使用 Accelerate）
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rcVo4bW9DZFk1eU5qa0dlVzl6eXciLCJhcGlfa2V5IjoiMDFLNzhZNDY1OVBKUFg0WkFLWUZLWEhKUlIiLCJ0ZW5hbnRfaWQiOiI5OTczNjdhZWQyMzM4ZWE1ZTkzZjQ2MjM3YjFkZGExOTZlMDc2YjEzNDZlMTZkODhjOTQxMjNlZDQxMzNlNjU1IiwiaW50ZXJuYWxfc2VjcmV0IjoiOGJiZTNjMzctNWU5ZC00NzhiLThiYTAtMzE3MzI3YmRjNGQ4In0.qZNrP7CF8_XA-Ff7mZaKzL78Io2jbrtdx_00shK0-p4"

# 迁移 URL（用于 prisma migrate deploy）
DIRECT_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"
```

## 🔧 在 Vercel 中的配置

### 方式 1: 完整配置（推荐）

进入 Vercel 项目设置 → Environment Variables，配置以下变量：

| Key | Value | Environments |
|-----|-------|--------------|
| `DATABASE_URL` | `prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19rcVo4bW9DZFk1eU5qa0dlVzl6eXciLCJhcGlfa2V5IjoiMDFLNzhZNDY1OVBKUFg0WkFLWUZLWEhKUlIiLCJ0ZW5hbnRfaWQiOiI5OTczNjdhZWQyMzM4ZWE1ZTkzZjQ2MjM3YjFkZGExOTZlMDc2YjEzNDZlMTZkODhjOTQxMjNlZDQxMzNlNjU1IiwiaW50ZXJuYWxfc2VjcmV0IjoiOGJiZTNjMzctNWU5ZC00NzhiLThiYTAtMzE3MzI3YmRjNGQ4In0.qZNrP7CF8_XA-Ff7mZaKzL78Io2jbrtdx_00shK0-p4` | ✅ Production, ✅ Preview |
| `DIRECT_URL` | `postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require` | ✅ Production, ✅ Preview |
| `NEXTAUTH_SECRET` | `Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=` | ✅ Production, ✅ Preview |
| `NEXTAUTH_URL` | `https://photographalbum.vercel.app` | ✅ Production only |
| `CLOUDINARY_CLOUD_NAME` | `dmolmq6dr` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_KEY` | `639768862499573` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_SECRET` | `jc1rYAQcZkt1ndtWrAdZyUgdzy8` | ✅ Production, ✅ Preview |

### 方式 2: 简化配置（可选）

如果 Accelerate 连接有问题，可以只使用直连 URL：

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require` |
| `DIRECT_URL` | 同上（相同值） |

⚠️ **注意：** 方式 2 会失去 Accelerate 的缓存和连接池优势。

## 📝 Prisma Schema 配置

当前的 `prisma/schema.prisma` 配置已经正确：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

这个配置的含义：
- `url` - 用于查询（使用 Accelerate 加速）
- `directUrl` - 用于迁移（直连数据库）

## 🔄 URL 的区别和用途

### DATABASE_URL（查询用）

**Accelerate URL：**
```
prisma+postgres://accelerate.prisma-data.net/?api_key=xxx
```
- ✅ 用于应用查询
- ✅ 包含全球边缘缓存
- ✅ 连接池管理
- ✅ 查询优化

**直连 URL：**
```
postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require
```
- 直接连接数据库
- 无缓存和优化
- 适合迁移和管理操作

### DIRECT_URL（迁移用）

必须使用直连 URL，因为：
- ❌ Accelerate 不支持 DDL 操作（CREATE TABLE, ALTER TABLE 等）
- ✅ 迁移需要直接修改数据库 schema

## 🚀 部署步骤

### 步骤 1: 配置环境变量

按照上面的表格，在 Vercel 中配置所有环境变量。

### 步骤 2: 确保数据库已迁移

如果是新数据库，需要先运行迁移：

**选项 A: 本地运行迁移（推荐）**
```bash
# 设置环境变量
export DATABASE_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"

# 运行迁移
npx prisma migrate deploy
```

**选项 B: 通过 Vercel 部署自动迁移**

package.json 中的 `vercel-build` 脚本会自动运行迁移：
```json
"vercel-build": "prisma migrate deploy && prisma generate && next build"
```

### 步骤 3: 重新部署

配置完环境变量后：
1. 进入 Vercel Dashboard
2. Deployments → 最新部署 → "..." → "Redeploy"

### 步骤 4: 验证

检查部署日志，应该看到：
```
✅ Prisma schema loaded from prisma/schema.prisma
✅ Datasource "db": PostgreSQL database
✅ 3 migrations found in prisma/migrations
✅ The following migrations have been applied:
✅ Database is now in sync with your Prisma schema
```

## 🔍 常见问题排查

### 问题 1: P1013 数据库连接字符串无效

**原因：** 环境变量中使用了占位符语法

**解决：** 使用实际的 URL 值，不要使用 `${VARIABLE_NAME}` 语法

### 问题 2: 连接超时

**原因：** Accelerate API key 可能过期或无效

**解决：**
1. 访问 Prisma Console: https://console.prisma.io
2. 重新生成 API key
3. 更新 DATABASE_URL

### 问题 3: 迁移失败

**错误信息：** `Error: Direct URL is required for migrations`

**解决：** 确保 `DIRECT_URL` 环境变量已设置且使用直连 URL（不是 Accelerate URL）

### 问题 4: Accelerate 连接失败

**临时解决方案：** 两个 URL 都使用直连：
```env
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."
```

## 📊 Accelerate vs 直连对比

| 特性 | Accelerate URL | 直连 URL |
|------|----------------|----------|
| **查询速度** | ✅ 快（全球缓存） | ⚠️ 一般 |
| **连接数** | ✅ 连接池管理 | ⚠️ 受限 |
| **迁移支持** | ❌ 不支持 | ✅ 支持 |
| **适用场景** | 应用查询 | 数据库迁移 |
| **URL 格式** | `prisma+postgres://...` | `postgres://...` |

## ✅ 推荐配置

**生产环境（Vercel）：**
```env
# 应用查询使用 Accelerate（快速）
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=xxx

# 迁移使用直连（必须）
DIRECT_URL=postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require
```

**开发环境（本地）：**
```env
# 两者都用直连（简单）
DATABASE_URL=postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require
DIRECT_URL=postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require
```

## 🎯 总结

1. ✅ Accelerate URL 用于应用查询（快速、有缓存）
2. ✅ 直连 URL 用于数据库迁移（必须）
3. ✅ 两个 URL 都要在 Vercel 环境变量中配置
4. ✅ 不要使用占位符语法，使用实际 URL 值
5. ✅ 配置后重新部署项目

**关键环境变量清单：**
- [ ] DATABASE_URL（Accelerate URL）
- [ ] DIRECT_URL（直连 URL）
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET

全部配置完成后，注册功能即可正常工作！🚀
