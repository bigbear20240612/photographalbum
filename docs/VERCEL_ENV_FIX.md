# Vercel 环境变量配置修复指南

## 🚨 发现的问题

### 1. NEXTAUTH_SECRET 配置错误
**当前错误配置：**
```
NEXTAUTH_SECRET = NEXTAUTH_SECRET=Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=
```

**正确配置应该是：**
```
Key: NEXTAUTH_SECRET
Value: Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=
```

⚠️ **不要在 Value 字段中包含 `NEXTAUTH_SECRET=` 前缀！**

### 2. 缺少数据库迁移步骤
已更新 package.json 的 build 脚本，现在会自动运行数据库迁移。

## ✅ 正确的环境变量配置

请在 Vercel 项目设置中按以下方式配置：

### 🚨 重要：数据库 URL 配置

**检测你使用的数据库类型：**

#### 选项 A: Prisma Accelerate 数据库 ⚡（推荐）

如果你的 URL 包含 `prisma+postgres://accelerate.prisma-data.net`，说明使用的是 Prisma Accelerate。

配置方式：
| Key | Value | 说明 |
|-----|-------|------|
| `DATABASE_URL` | `prisma+postgres://accelerate.prisma-data.net/?api_key=xxx` | Accelerate URL（包含缓存和连接池）|
| `DIRECT_URL` | `postgres://user:pass@db.prisma.io:5432/postgres?sslmode=require` | 直连 URL（用于迁移）|

✅ **优势：** 全球边缘缓存、连接池管理、查询加速

📖 **详细配置指南：** 参见 `docs/PRISMA_ACCELERATE_CONFIG.md`

---

#### 选项 B: Vercel Postgres 数据库

如果你使用的是 Vercel Postgres（集成方式）：

Vercel Postgres 会自动创建以下环境变量，你**不需要手动添加** DATABASE_URL：
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

但你需要手动添加这两个变量来引用它们：

| Key | Value | 说明 |
|-----|-------|------|
| `DATABASE_URL` | 从 Storage 标签页复制 `POSTGRES_PRISMA_URL` 的实际值 | Prisma 连接池 URL |
| `DIRECT_URL` | 从 Storage 标签页复制 `POSTGRES_URL_NON_POOLING` 的实际值 | 直连 URL（用于迁移）|

**获取实际数据库 URL 的步骤：**
1. 进入 Vercel 项目的 **Storage** 标签页
2. 点击你的 Postgres 数据库
3. 点击 **.env.local** 标签
4. 复制 `POSTGRES_PRISMA_URL=` 后面的完整 URL（以 `postgres://` 或 `postgresql://` 开头）
5. 复制 `POSTGRES_URL_NON_POOLING=` 后面的完整 URL

### 必需的环境变量（完整列表）

#### 使用 Prisma Accelerate（根据你的配置）：

| Key | Value | Environments |
|-----|-------|--------------|
| `DATABASE_URL` | `prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Production, ✅ Preview |
| `DIRECT_URL` | `postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require` | ✅ Production, ✅ Preview |
| `NEXTAUTH_SECRET` | `Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=` | ✅ Production, ✅ Preview |
| `NEXTAUTH_URL` | `https://photographalbum.vercel.app` | ✅ Production only |
| `CLOUDINARY_CLOUD_NAME` | `dmolmq6dr` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_KEY` | `639768862499573` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_SECRET` | `jc1rYAQcZkt1ndtWrAdZyUgdzy8` | ✅ Production, ✅ Preview |

⚠️ **重要说明：**
- ❌ 不要使用 `${POSTGRES_PRISMA_URL}` 这样的占位符语法
- ✅ 使用你提供的完整 URL 值
- ✅ DATABASE_URL 使用 Accelerate URL（以 `prisma+postgres://` 开头）
- ✅ DIRECT_URL 使用直连 URL（以 `postgres://` 开头，用于迁移）

### Preview 环境的 NEXTAUTH_URL

对于 Preview 部署，建议添加：
- Key: `NEXTAUTH_URL`
- Value: 留空或设置为 `https://${VERCEL_URL}`
- Environments: ✅ Preview only

## 📝 修复步骤

### 步骤 1: 获取正确的数据库 URL

1. 进入 Vercel 项目的 **Storage** 标签页
2. 点击你的 Postgres 数据库实例
3. 点击 **.env.local** 标签或 **Quickstart** 标签
4. 你会看到类似这样的内容：
   ```
   POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb"
   POSTGRES_PRISMA_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"
   ```
5. 复制这两个 URL 的实际值（不要复制变量名）：
   - `POSTGRES_PRISMA_URL` 的值（包含 `?pgbouncer=true`）
   - `POSTGRES_URL_NON_POOLING` 的值（不包含 `?pgbouncer=true`）

### 步骤 2: 修复环境变量

进入 Vercel 项目设置: https://vercel.com/[你的用户名]/photographalbum/settings/environment-variables

**2.1 修复 DATABASE_URL：**
1. 找到 `DATABASE_URL` 变量
2. 点击 "Edit"
3. 将 Value 改为你复制的 `POSTGRES_PRISMA_URL` 的实际值
   - 应该类似：`postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`
4. 确保勾选 ✅ Production 和 ✅ Preview
5. 点击 "Save"

**2.2 修复 DIRECT_URL：**
1. 找到 `DIRECT_URL` 变量
2. 点击 "Edit"
3. 将 Value 改为你复制的 `POSTGRES_URL_NON_POOLING` 的实际值
   - 应该类似：`postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb`
4. 确保勾选 ✅ Production 和 ✅ Preview
5. 点击 "Save"

**2.3 修复 NEXTAUTH_SECRET：**
1. 找到 `NEXTAUTH_SECRET` 变量
2. 点击 "Edit"
3. 将 Value 改为: `Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=`（不要包含 NEXTAUTH_SECRET= 前缀）
4. 确保勾选 ✅ Production 和 ✅ Preview
5. 点击 "Save"

### 步骤 3: 重新部署

修复环境变量后，需要重新部署：

**方式 1: 通过 Vercel Dashboard**
1. 进入 Deployments 页面
2. 点击最新部署的 "..." 菜单
3. 选择 "Redeploy"

**方式 2: 通过 Git Push**
```bash
git add .
git commit -m "fix: 修复数据库迁移配置"
git push origin master
```

### 步骤 4: 检查部署日志

1. 等待部署完成
2. 查看构建日志，确认以下内容：
   - ✅ Prisma 迁移成功执行
   - ✅ Prisma Client 生成成功
   - ✅ Next.js 构建成功

3. 查看运行时日志：
   - 进入 Vercel Dashboard
   - 点击 "Logs" 或 "Runtime Logs"
   - 检查是否有数据库连接错误或其他错误

### 步骤 5: 测试注册功能

1. 访问 https://photographalbum.vercel.app/register
2. 尝试注册新用户
3. 如果仍然失败，查看浏览器控制台的网络请求
4. 查看 Vercel 运行时日志获取详细错误信息

### 📸 环境变量配置示例截图说明

正确的环境变量配置应该是这样的：

```
Key: DATABASE_URL
Value: postgres://default:AbC123XyZ@ep-xxx-pooler.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15
Environments: ✅ Production ✅ Preview

Key: DIRECT_URL
Value: postgres://default:AbC123XyZ@ep-xxx.postgres.vercel-storage.com:5432/verceldb
Environments: ✅ Production ✅ Preview

Key: NEXTAUTH_SECRET
Value: Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=
Environments: ✅ Production ✅ Preview
```

❌ **错误示例：**
```
DATABASE_URL = ${POSTGRES_PRISMA_URL}  ← 这样不会被解析
NEXTAUTH_SECRET = NEXTAUTH_SECRET=Dl20sc... ← 不要包含变量名
```

## 🔍 故障排查

### 如果注册仍然失败：

**检查数据库连接：**
```bash
# 在 Vercel 部署的 Functions 日志中查找：
- "Database connection error"
- "Prisma Client initialization error"
- "Migration failed"
```

**检查环境变量是否生效：**
在注册 API (`/api/auth/register`) 中临时添加日志：
```typescript
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set');
```

**常见错误原因：**
1. ❌ 数据库未迁移 → 已通过更新 build 脚本修复
2. ❌ NEXTAUTH_SECRET 格式错误 → 需要按上述步骤修复
3. ❌ DATABASE_URL 未正确设置 → 检查 Vercel Postgres 集成
4. ❌ 网络问题或 Vercel Postgres 连接限制

## 📊 验证清单

部署后验证以下内容：

- [ ] Vercel 构建成功（绿色勾选）
- [ ] 环境变量正确配置（无 NEXTAUTH_SECRET= 前缀）
- [ ] 数据库迁移成功执行（查看构建日志）
- [ ] 访问首页成功加载
- [ ] 注册页面可以访问
- [ ] 注册表单提交后检查网络请求状态
- [ ] 查看 Vercel Runtime Logs 确认无错误

## 🆘 仍然无法解决？

提供以下信息以便进一步诊断：
1. Vercel 部署日志（构建阶段）
2. Vercel Runtime Logs（运行时错误）
3. 浏览器控制台错误信息
4. 网络请求的详细响应（POST /api/auth/register）
