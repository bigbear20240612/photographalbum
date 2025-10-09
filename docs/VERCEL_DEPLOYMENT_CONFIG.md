# Vercel 部署配置详细指南

**项目:** PhotoAlbum - 摄影作品展示平台
**版本:** V1.5 Production Ready
**更新时间:** 2025-10-09

---

## 📋 目录

1. [准备工作](#准备工作)
2. [Vercel 项目配置](#vercel-项目配置)
3. [数据库配置](#数据库配置)
4. [环境变量完整列表](#环境变量完整列表)
5. [构建配置](#构建配置)
6. [部署流程](#部署流程)
7. [部署后配置](#部署后配置)
8. [验证清单](#验证清单)
9. [故障排除](#故障排除)

---

## 准备工作

### 1. 必需的账户

- [ ] **Vercel 账户** - https://vercel.com
- [ ] **GitHub/GitLab/Bitbucket 账户** - 代码托管
- [ ] **Cloudinary 账户** - https://cloudinary.com (图片存储)

### 2. 本地准备

```bash
# 确保代码已提交
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# 确保所有依赖正常
npm install
npm run build  # 本地测试构建
```

---

## Vercel 项目配置

### 步骤 1: 导入项目

1. 登录 Vercel Dashboard: https://vercel.com/dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择 Git 提供商 (GitHub 推荐)
4. 选择 `photographalbum` 仓库
5. 点击 **"Import"**

### 步骤 2: 项目基本设置

在项目配置页面,填写以下信息:

#### Framework Preset
```
Next.js
```
> ✅ Vercel 会自动检测,通常无需手动选择

#### Project Name
```
photographalbum
```
> 💡 这将决定你的默认域名: `photographalbum.vercel.app`

#### Root Directory
```
./
```
> ⚠️ 保持默认值,不要修改

#### Build Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
.next
```
> 💡 Next.js 默认输出目录,无需修改

**Install Command:**
```bash
npm install
```

**Development Command (可选):**
```bash
npm run dev
```

---

## 数据库配置

### 创建 Vercel Postgres 数据库

#### 步骤 1: 创建数据库

1. 在项目配置页面,点击顶部的 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 配置数据库:
   - **Database Name:** 保持默认或自定义
   - **Region:** 选择离目标用户最近的区域

#### 推荐的区域选择

| 目标用户位置 | 推荐区域 | Region ID |
|-------------|---------|-----------|
| 中国大陆/亚太 | 新加坡 | `ap-southeast-1` |
| 美国东海岸 | 美国东部 | `us-east-1` |
| 美国西海岸 | 美国西部 | `us-west-1` |
| 欧洲 | 欧洲西部 | `eu-west-1` |

5. 点击 **"Create"**

#### 步骤 2: 确认自动注入的变量

创建后,Vercel 会自动注入以下环境变量:

| 变量名 | 用途 |
|--------|------|
| `POSTGRES_URL` | 完整的数据库连接字符串 |
| `POSTGRES_PRISMA_URL` | Prisma 连接池 URL (推荐用于应用) |
| `POSTGRES_URL_NON_POOLING` | 非池化连接 (用于迁移) |
| `POSTGRES_USER` | 数据库用户名 |
| `POSTGRES_HOST` | 数据库主机地址 |
| `POSTGRES_PASSWORD` | 数据库密码 |
| `POSTGRES_DATABASE` | 数据库名称 |

> ⚠️ **重要**: 这些变量由 Vercel 自动管理,不要手动修改!

---

## 环境变量完整列表

### 进入环境变量配置

1. 在项目配置页面,点击 **"Environment Variables"** 区域
2. 或进入 **Settings** → **Environment Variables**

### 必需的环境变量 (Required)

#### 1. 数据库配置

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` | Production, Preview |
| `DIRECT_URL` | `${POSTGRES_URL_NON_POOLING}` | Production, Preview |

> 💡 **说明**: 使用 `${}` 语法引用 Vercel 自动注入的变量

**添加步骤:**
1. 点击 **"Add New"** 或 **"Add Variable"**
2. Key: `DATABASE_URL`
3. Value: `${POSTGRES_PRISMA_URL}` (完整复制,包括 `${}`)
4. 选择 Environment: ✅ Production, ✅ Preview
5. 点击 **"Save"**
6. 重复以上步骤添加 `DIRECT_URL`

#### 2. NextAuth 配置

| Variable | Value | How to Get |
|----------|-------|------------|
| `NEXTAUTH_SECRET` | (生成的密钥) | 见下方生成方法 |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | 部署后的域名 |

**生成 NEXTAUTH_SECRET:**

**方法 1 - OpenSSL (推荐):**
```bash
openssl rand -base64 32
```

**方法 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**方法 3 - 在线工具:**
```
https://generate-secret.vercel.app/32
```

**示例输出:**
```
dGVzdGluZzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdA==
```

**添加步骤:**
1. 生成密钥后,复制整个字符串
2. 在 Vercel 添加变量:
   - Key: `NEXTAUTH_SECRET`
   - Value: (粘贴生成的密钥)
   - Environment: ✅ Production, ✅ Preview
3. 添加 `NEXTAUTH_URL`:
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-project.vercel.app` (首次可以先用占位符)
   - Environment: ✅ Production, ✅ Preview

> ⚠️ **注意**: 首次部署后,需要将 `NEXTAUTH_URL` 更新为实际的域名

#### 3. Cloudinary 配置 (图片上传)

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | `123456789012345` | Dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Dashboard → Account Details |

**获取 Cloudinary 凭据:**
1. 登录 Cloudinary: https://cloudinary.com/console
2. 在 Dashboard 页面,找到 **"Account Details"** 区域
3. 复制以下信息:
   - Cloud Name
   - API Key
   - API Secret (点击 "眼睛" 图标显示)

**添加到 Vercel:**
- Environment: ✅ Production, ✅ Preview

### 可选的环境变量 (Optional)

#### 性能和限制

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `MAX_FILE_SIZE` | `20971520` | 最大文件大小 (20MB) |
| `MAX_FILES_PER_UPLOAD` | `50` | 单次最大上传数量 |
| `NODE_ENV` | `production` | Node 环境 (Vercel 自动设置) |

#### 功能开关

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `ENABLE_REGISTRATION` | `true` | 是否开放注册 |
| `ENABLE_REALTIME_NOTIFICATIONS` | `true` | 是否启用实时通知 |

### 环境变量配置截图示例

```
┌─────────────────────────────────────────────┐
│ Environment Variables                        │
├─────────────────────────────────────────────┤
│ DATABASE_URL                                 │
│ ${POSTGRES_PRISMA_URL}                      │
│ ✅ Production  ✅ Preview  ⬜ Development   │
├─────────────────────────────────────────────┤
│ DIRECT_URL                                   │
│ ${POSTGRES_URL_NON_POOLING}                 │
│ ✅ Production  ✅ Preview  ⬜ Development   │
├─────────────────────────────────────────────┤
│ NEXTAUTH_SECRET                              │
│ dGVzdGluZzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2...   │
│ ✅ Production  ✅ Preview  ⬜ Development   │
├─────────────────────────────────────────────┤
│ NEXTAUTH_URL                                 │
│ https://photographalbum.vercel.app          │
│ ✅ Production  ⬜ Preview  ⬜ Development   │
├─────────────────────────────────────────────┤
│ CLOUDINARY_CLOUD_NAME                        │
│ your-cloud-name                              │
│ ✅ Production  ✅ Preview  ⬜ Development   │
└─────────────────────────────────────────────┘
```

---

## 构建配置

### Build & Development Settings

在 **Settings** → **General** → **Build & Development Settings**:

#### 推荐配置

**Node.js Version:**
```
20.x (推荐)
```

**Build Command (可选优化):**
```bash
npx prisma generate && npm run build
```
> 💡 确保 Prisma Client 在构建前生成

**Install Command (保持默认):**
```bash
npm install
```

#### 构建缓存

- ✅ 启用 **Build Cache** (加快构建速度)
- ⚠️ 如遇到奇怪的构建问题,可以清除缓存重试

---

## 部署流程

### 步骤 1: 首次部署

> ⚠️ **重要**: 完成所有环境变量配置后再部署!

1. 确认所有配置正确
2. 点击 **"Deploy"** 按钮
3. 等待部署完成 (通常 2-5 分钟)

**预期结果:**
- ✅ 构建成功
- ⚠️ 应用可能无法正常运行 (因为数据库表尚未创建)

### 步骤 2: 运行数据库迁移

#### 方法 A: 使用 Vercel CLI (推荐)

```bash
# 1. 安装 Vercel CLI (首次需要)
npm install -g vercel

# 2. 登录 Vercel
vercel login
# 按照提示完成登录

# 3. 链接项目
cd D:\data\CLAUDE_USE\Vercel\photographalbum
vercel link
# 选择你的团队和项目

# 4. 拉取生产环境变量
vercel env pull .env.production
# 这会创建 .env.production 文件

# 5. 运行数据库迁移
npx prisma migrate deploy

# 6. (可选) 导入测试数据
npx prisma db seed
```

**预期输出:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database
✔ Generated Prisma Client

12 migrations found in prisma/migrations

Applying migration `20251009083756_add_user_role`
Applying migration `...`

The following migrations have been applied:

migrations/
  └─ 20251009083756_add_user_role/
      └─ migration.sql

✔ All migrations have been successfully applied.
```

#### 方法 B: 在构建脚本中自动运行 (可选)

在 `package.json` 中添加:

```json
{
  "scripts": {
    "build": "next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

> ⚠️ **注意**:
> - 这会在每次部署时运行迁移
> - 可能增加构建时间
> - 不推荐用于频繁部署

### 步骤 3: 重新部署

1. 返回 Vercel Dashboard
2. 进入项目 → **"Deployments"** 标签
3. 找到最新的部署
4. 点击右侧的 **"..."** → **"Redeploy"**
5. 选择选项:
   - ✅ **Use existing Build Cache** (如果没有代码变更)
   - ⬜ 或选择 **Clear cache and redeploy** (如果有问题)
6. 点击 **"Redeploy"**

### 步骤 4: 更新 NEXTAUTH_URL

1. 部署成功后,复制你的部署 URL
   - 例如: `https://photographalbum.vercel.app`
2. 进入 **Settings** → **Environment Variables**
3. 找到 `NEXTAUTH_URL` 变量
4. 点击 **"Edit"**
5. 更新为实际的 URL
6. 保存并重新部署 (可选,通常会自动应用)

---

## 部署后配置

### 1. 自定义域名 (可选)

#### 添加域名

1. 进入 **Settings** → **Domains**
2. 点击 **"Add"**
3. 输入你的域名: `example.com`
4. 点击 **"Add"**

#### 配置 DNS

Vercel 会提供 DNS 配置指南,通常需要添加:

**A 记录 (根域名):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 记录 (www 子域名):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 更新环境变量

添加自定义域名后,更新 `NEXTAUTH_URL`:
```
NEXTAUTH_URL=https://yourdomain.com
```

### 2. 配置 Deployment Protection (可选)

#### 保护预览部署

1. 进入 **Settings** → **Deployment Protection**
2. 选择保护级别:
   - **Standard Protection** - Vercel 认证
   - **Password Protection** - 自定义密码
   - **Trusted IPs** - IP 白名单

推荐配置:
```
Production: 无保护 (公开访问)
Preview: Vercel Authentication (团队成员可访问)
```

### 3. 配置 Serverless Functions

#### 函数超时设置 (Pro 计划)

1. 进入 **Settings** → **Functions**
2. 调整超时时间 (默认 10 秒)
3. 针对上传等耗时操作,可以增加到 60 秒

### 4. 配置分析和监控

#### 启用 Analytics

1. 进入项目 → **"Analytics"** 标签
2. 点击 **"Enable Analytics"**
3. 查看访问统计和性能数据

#### 启用 Speed Insights

1. 进入项目 → **"Speed Insights"** 标签
2. 点击 **"Enable Speed Insights"**
3. 监控页面加载性能

---

## 验证清单

### ✅ 部署前检查

- [ ] 代码已推送到 Git 仓库
- [ ] 所有依赖已安装 (`package.json` 完整)
- [ ] 本地构建成功 (`npm run build`)
- [ ] Vercel 项目已创建
- [ ] Vercel Postgres 数据库已创建
- [ ] 所有必需环境变量已添加:
  - [ ] `DATABASE_URL`
  - [ ] `DIRECT_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`

### ✅ 部署后验证

#### 1. 基本功能测试

访问你的部署 URL:

- [ ] **首页加载正常**
  ```
  https://your-domain.vercel.app/
  ```

- [ ] **API 端点响应正常**
  ```bash
  curl https://your-domain.vercel.app/api/categories
  ```
  预期: 返回分类列表 JSON

- [ ] **用户注册功能**
  - 访问: `/auth/register`
  - 尝试注册新账户
  - 检查是否成功创建

- [ ] **用户登录功能**
  - 访问: `/auth/signin`
  - 使用测试账户登录
  - Email: `john@example.com`
  - Password: `password123`

- [ ] **创建专辑功能**
  - 登录后访问: `/dashboard`
  - 尝试创建新专辑

- [ ] **照片上传功能**
  - 进入专辑详情
  - 尝试上传照片
  - 检查 Cloudinary 是否收到图片

- [ ] **管理员后台访问**
  - 使用管理员账户登录
  - 访问: `/admin`
  - 检查统计数据是否显示

#### 2. 性能测试

- [ ] **页面加载速度**
  - 首页加载时间 < 3 秒
  - 使用 Chrome DevTools Lighthouse 测试

- [ ] **API 响应时间**
  - 列表 API < 500ms
  - 详情 API < 300ms

- [ ] **图片加载**
  - 缩略图快速显示
  - 使用 Cloudinary CDN

#### 3. 数据库验证

```bash
# 连接到 Vercel Postgres (使用 psql 或 GUI 工具)
# 从 Vercel Dashboard → Storage → Postgres → .env 获取连接信息

# 检查表是否存在
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

# 预期输出应包含:
# - users
# - albums
# - photos
# - categories
# - likes
# - comments
# - follows
# - notifications
# 等

# 检查测试数据
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM albums;
SELECT COUNT(*) FROM categories;
```

---

## 故障排除

### 问题 1: 部署失败 - "Module not found"

**错误信息:**
```
Error: Cannot find module '@prisma/client'
```

**解决方法:**
```bash
# 确保 @prisma/client 在 dependencies (不是 devDependencies)
npm install @prisma/client --save

# 重新部署
git add package.json package-lock.json
git commit -m "Fix dependencies"
git push
```

### 问题 2: 数据库连接失败

**错误信息:**
```
P1001: Can't reach database server at xxx
```

**检查清单:**
1. ✅ Vercel Postgres 数据库已创建
2. ✅ `DATABASE_URL` 设置为 `${POSTGRES_PRISMA_URL}`
3. ✅ `DIRECT_URL` 设置为 `${POSTGRES_URL_NON_POOLING}`
4. ✅ 变量引用格式正确 (包括 `${}`)
5. ✅ 数据库和应用在同一区域

**解决方法:**
```bash
# 检查环境变量
vercel env ls

# 重新拉取环境变量
vercel env pull .env.production

# 测试连接
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('Connected!')).catch(console.error)"
```

### 问题 3: Prisma Client 未生成

**错误信息:**
```
@prisma/client did not initialize yet
```

**解决方法:**

在 `package.json` 中添加 postinstall 脚本:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

重新部署:
```bash
git add package.json
git commit -m "Add prisma generate postinstall"
git push
```

### 问题 4: NextAuth 认证失败

**错误信息:**
```
[next-auth][error][CALLBACK_CREDENTIALS_HANDLER_ERROR]
```

**检查清单:**
1. ✅ `NEXTAUTH_SECRET` 已设置且不为空
2. ✅ `NEXTAUTH_URL` 与实际域名一致
3. ✅ 数据库中存在 `users` 表
4. ✅ 密码哈希正确 (bcrypt)

**解决方法:**
```bash
# 重新生成 NEXTAUTH_SECRET
openssl rand -base64 32

# 在 Vercel Dashboard 更新变量
# 重新部署
```

### 问题 5: 图片上传失败

**错误信息:**
```
Cloudinary upload failed
```

**检查清单:**
1. ✅ Cloudinary 账户有效且未超出配额
2. ✅ `CLOUDINARY_CLOUD_NAME` 正确
3. ✅ `CLOUDINARY_API_KEY` 正确
4. ✅ `CLOUDINARY_API_SECRET` 正确
5. ✅ 环境变量没有多余的空格

**解决方法:**
```bash
# 在 Cloudinary Console 重新获取凭据
# 在 Vercel 更新环境变量
# 注意: API Secret 可能需要重新生成
```

### 问题 6: 构建超时

**错误信息:**
```
Error: Command "npm run build" exceeded timeout
```

**解决方法:**

**方法 1**: 升级到 Vercel Pro (构建时间更长)

**方法 2**: 优化构建:
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

**方法 3**: 启用构建缓存 (Settings → General → Build Cache)

### 问题 7: 环境变量未生效

**症状**: 代码中 `process.env.XXX` 为 undefined

**检查清单:**
1. ✅ 变量名拼写正确
2. ✅ 选择了正确的 Environment (Production/Preview)
3. ✅ 保存后重新部署
4. ✅ 使用 `NEXT_PUBLIC_` 前缀 (如果需要在客户端使用)

**解决方法:**
```bash
# 查看所有环境变量
vercel env ls

# 拉取并检查
vercel env pull

# 查看 .env 文件内容
cat .env.production
```

---

## 📊 监控和维护

### 实时日志

**查看部署日志:**
1. Vercel Dashboard → 项目 → **Deployments**
2. 点击具体的部署
3. 查看 **Build Logs**

**查看运行时日志:**
1. Vercel Dashboard → 项目 → **Functions**
2. 点击具体的函数 (API 路由)
3. 查看实时日志和错误

**使用 Vercel CLI 查看日志:**
```bash
# 实时日志流
vercel logs --follow

# 查看特定函数日志
vercel logs [deployment-url]
```

### 性能监控

**Speed Insights:**
- 查看 Core Web Vitals
- 监控页面加载性能
- 识别性能瓶颈

**Analytics:**
- 查看访问量
- 分析用户行为
- 追踪转化率

### 定期维护

**每周:**
- [ ] 检查错误日志
- [ ] 监控 API 响应时间
- [ ] 查看数据库使用量

**每月:**
- [ ] 更新依赖包
- [ ] 检查安全漏洞
- [ ] 审查性能指标
- [ ] 备份数据库

**按需:**
- [ ] 更新环境变量
- [ ] 调整 Serverless Function 配置
- [ ] 优化图片存储

---

## 🚀 持续部署

### Git 集成

Vercel 自动监听 Git 仓库变更:

| 分支 | 环境 | 行为 |
|------|------|------|
| `main` / `master` | Production | 自动部署到生产环境 |
| 其他分支 | Preview | 创建预览部署 |
| Pull Request | Preview | 为每个 PR 创建预览 |

### 部署钩子 (Webhooks)

**配置部署钩子:**
1. Settings → Git → Deploy Hooks
2. 创建新的 Hook
3. 选择分支和名称
4. 复制 Hook URL

**触发部署:**
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/xxx/xxx
```

### CI/CD 集成

**GitHub Actions 示例:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📚 参考资源

### 官方文档

- **Vercel 文档**: https://vercel.com/docs
- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Next.js 部署**: https://nextjs.org/docs/deployment
- **Prisma 部署**: https://www.prisma.io/docs/guides/deployment
- **NextAuth 部署**: https://next-auth.js.org/deployment

### 社区资源

- **Vercel Discord**: https://vercel.com/discord
- **GitHub Discussions**: https://github.com/vercel/vercel/discussions
- **Stack Overflow**: Tag `vercel`

### 项目相关

- **项目仓库**: (你的 GitHub URL)
- **部署文档**: `docs/VERCEL_DEPLOYMENT_GUIDE.md`
- **快速配置**: `docs/VERCEL_QUICK_CONFIG.md`
- **环境变量模板**: `.env.example`

---

## 📞 获取帮助

### 问题反馈

如遇到问题:
1. 检查本文档的 [故障排除](#故障排除) 部分
2. 查看 Vercel 官方文档
3. 在项目仓库提交 Issue
4. 联系 Vercel 支持 (Pro 计划)

### 支持渠道

- **项目 Issues**: (你的 GitHub Issues URL)
- **Vercel Support**: https://vercel.com/support
- **社区讨论**: Vercel Discord

---

**文档版本:** V2.0
**最后更新:** 2025-10-09
**维护者:** PhotoAlbum Team

**部署状态:**
- ✅ 配置完整
- ✅ 文档完整
- ✅ 测试通过
- 🚀 生产就绪

---

## 附录

### A. 环境变量速查表

```bash
# 必需变量 (Required)
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}
NEXTAUTH_SECRET=<generated-32-byte-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# 可选变量 (Optional)
MAX_FILE_SIZE=20971520
MAX_FILES_PER_UPLOAD=50
NODE_ENV=production
ENABLE_REGISTRATION=true
```

### B. 常用命令

```bash
# Vercel CLI
vercel login              # 登录
vercel                    # 部署到预览
vercel --prod             # 部署到生产
vercel env ls             # 列出环境变量
vercel env pull           # 拉取环境变量
vercel logs --follow      # 查看实时日志
vercel domains ls         # 列出域名

# Prisma
npx prisma migrate deploy # 部署迁移
npx prisma db seed        # 导入种子数据
npx prisma studio         # 打开数据库 GUI
npx prisma generate       # 生成 Prisma Client

# 数据库
psql $POSTGRES_URL        # 连接数据库 (需要 psql)
```

### C. 部署检查清单 (打印版)

```
PhotoAlbum Vercel 部署检查清单
================================

准备阶段:
□ Vercel 账户已创建
□ Cloudinary 账户已创建
□ 代码已推送到 Git
□ 本地构建测试通过

配置阶段:
□ 项目已导入到 Vercel
□ Framework 设置为 Next.js
□ Root Directory 为 ./
□ Vercel Postgres 已创建
□ 选择合适的数据库区域

环境变量:
□ DATABASE_URL 已设置
□ DIRECT_URL 已设置
□ NEXTAUTH_SECRET 已生成并设置
□ NEXTAUTH_URL 已设置
□ CLOUDINARY_CLOUD_NAME 已设置
□ CLOUDINARY_API_KEY 已设置
□ CLOUDINARY_API_SECRET 已设置

部署阶段:
□ 首次部署已完成
□ 数据库迁移已运行
□ 测试数据已导入 (可选)
□ 重新部署已完成
□ NEXTAUTH_URL 已更新为实际域名

验证阶段:
□ 首页可以访问
□ API 端点正常响应
□ 用户注册功能正常
□ 用户登录功能正常
□ 创建专辑功能正常
□ 照片上传功能正常
□ 管理员后台可访问

后续配置 (可选):
□ 自定义域名已添加
□ DNS 已配置
□ Analytics 已启用
□ Speed Insights 已启用
□ Deployment Protection 已配置

完成! 🎉
```

---

**祝你部署顺利! 🚀**
