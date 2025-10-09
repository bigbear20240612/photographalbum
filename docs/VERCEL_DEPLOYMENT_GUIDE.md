# Vercel 部署指南 - PhotoAlbum 项目

**版本：** V1.5 (PostgreSQL Production)
**更新时间：** 2025-10-09

---

## 📋 部署前准备

### 1. 确保代码已推送到 Git 仓库

支持的 Git 平台:
- GitHub (推荐)
- GitLab
- Bitbucket

```bash
# 确保所有更改已提交
git add .
git commit -m "准备部署到 Vercel"
git push origin main
```

### 2. 准备 Vercel 账户

- 访问 https://vercel.com
- 使用 GitHub/GitLab/Bitbucket 账户登录
- 确保已验证邮箱

---

## 🚀 部署步骤

### 步骤 1: 导入项目到 Vercel

1. 登录 Vercel Dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择你的 Git 仓库 (photographalbum)
4. 点击 **"Import"**

### 步骤 2: 配置构建设置

在项目配置页面:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Install Command: npm install
Output Directory: .next (默认)
```

**不要点击 Deploy!** 先配置数据库和环境变量。

### 步骤 3: 创建 Vercel Postgres 数据库

#### 3.1 在 Vercel 中创建数据库

1. 在项目配置页面,点击 **"Storage"** 标签
2. 点击 **"Create Database"**
3. 选择 **"Postgres"**
4. 选择区域 (推荐选择离目标用户最近的区域):
   - **ap-southeast-1** (新加坡 - 亚太地区推荐)
   - **us-east-1** (美国东部)
   - **eu-west-1** (欧洲西部)
5. 点击 **"Create"**

#### 3.2 自动注入的环境变量

Vercel Postgres 会自动注入以下环境变量到你的项目:
- `POSTGRES_URL` - 完整连接字符串
- `POSTGRES_PRISMA_URL` - Prisma 连接池URL (推荐)
- `POSTGRES_URL_NON_POOLING` - 非连接池URL (用于迁移)
- `POSTGRES_USER` - 数据库用户名
- `POSTGRES_HOST` - 数据库主机
- `POSTGRES_PASSWORD` - 数据库密码
- `POSTGRES_DATABASE` - 数据库名称

### 步骤 4: 配置环境变量

#### 4.1 必需的环境变量

在 Vercel 项目设置中,进入 **"Settings"** → **"Environment Variables"**,添加以下变量:

##### 1. 数据库配置 (使用 Vercel Postgres 自动注入)

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` |
| `DIRECT_URL` | `${POSTGRES_URL_NON_POOLING}` |

> ⚠️ **重要:** 使用 `${POSTGRES_PRISMA_URL}` 这样的语法,Vercel 会自动引用已注入的变量。

##### 2. NextAuth 配置

| Variable Name | Value | 说明 |
|--------------|-------|------|
| `NEXTAUTH_SECRET` | (生成的密钥) | 见下方生成方法 |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 部署后的完整URL |

**生成 NEXTAUTH_SECRET:**

方法1 - 使用 OpenSSL (推荐):
```bash
openssl rand -base64 32
```

方法2 - 在线生成:
https://generate-secret.vercel.app/32

方法3 - Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

##### 3. Cloudinary 配置 (图片上传)

| Variable Name | Value |
|--------------|-------|
| `CLOUDINARY_CLOUD_NAME` | 你的 Cloud Name |
| `CLOUDINARY_API_KEY` | 你的 API Key |
| `CLOUDINARY_API_SECRET` | 你的 API Secret |

> 获取方式: https://cloudinary.com/console → Dashboard → Account Details

##### 4. 其他可选配置

| Variable Name | Value | 说明 |
|--------------|-------|------|
| `NODE_ENV` | `production` | Node 环境 |
| `MAX_FILE_SIZE` | `20971520` | 最大文件大小(20MB) |
| `MAX_FILES_PER_UPLOAD` | `50` | 单次最大上传数 |

#### 4.2 环境变量作用域

为所有环境变量选择适当的作用域:
- ✅ **Production** - 生产环境(必选)
- ✅ **Preview** - 预览部署(推荐)
- ⬜ **Development** - 本地开发(可选)

### 步骤 5: 数据库迁移

#### 5.1 等待首次部署完成

点击 **"Deploy"** 按钮,等待部署完成。首次部署会失败,因为数据库表还未创建,这是正常的。

#### 5.2 运行数据库迁移

方法1 - 使用 Vercel CLI (推荐):

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 拉取环境变量
vercel env pull .env.production

# 运行迁移
npx prisma migrate deploy
```

方法2 - 在项目设置中添加构建命令:

在 Vercel 项目设置 → **Settings** → **General** → **Build & Development Settings**:

```bash
Build Command: npx prisma generate && npx prisma migrate deploy && npm run build
```

> ⚠️ **注意:** 这会在每次部署时运行迁移,可能影响构建时间。

#### 5.3 导入种子数据 (可选)

```bash
# 使用生产环境变量
vercel env pull .env.production

# 运行 seed
npx prisma db seed
```

或者创建一个部署后的 seed 脚本:

在 `package.json` 中添加:
```json
{
  "scripts": {
    "postbuild": "npx prisma migrate deploy && npx prisma db seed"
  }
}
```

### 步骤 6: 重新部署

1. 在 Vercel Dashboard,进入项目
2. 点击 **"Deployments"** 标签
3. 找到最新的部署,点击右侧的 **"..."** → **"Redeploy"**
4. 选择 **"Use existing Build Cache"** (可选)
5. 点击 **"Redeploy"**

---

## ✅ 验证部署

### 1. 检查部署状态

- 在 Vercel Dashboard 查看部署日志
- 确保没有错误信息
- 查看 "Functions" 标签,确保所有 API 路由正常

### 2. 测试应用功能

访问你的部署 URL (`https://your-project.vercel.app`):

- ✅ 首页加载正常
- ✅ 用户注册功能
- ✅ 用户登录功能
- ✅ 专辑创建功能
- ✅ 照片上传功能
- ✅ 管理员后台访问

### 3. 测试数据库连接

访问 API 端点测试:
```
GET https://your-domain.vercel.app/api/albums
GET https://your-domain.vercel.app/api/categories
```

### 4. 测试管理员账户

使用种子数据中的管理员账户登录:
```
Email: john@example.com
Password: password123
```

访问: `https://your-domain.vercel.app/admin`

---

## 🔧 配置优化

### 1. 自定义域名

1. 在 Vercel 项目设置中,进入 **"Domains"**
2. 点击 **"Add"**
3. 输入你的域名
4. 按照提示配置 DNS 记录

### 2. 性能优化

#### 启用 Edge Runtime (可选)

在 API 路由中添加:
```typescript
export const runtime = 'edge';
```

#### 配置图片优化

在 `next.config.js` 中:
```javascript
module.exports = {
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};
```

### 3. 安全配置

#### 添加环境保护

在 **Settings** → **Deployment Protection**:
- 启用 **Vercel Authentication**
- 或添加密码保护(用于预览环境)

#### 配置 CORS (如果需要)

在 API 路由中:
```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  response.headers.set('Access-Control-Allow-Origin', 'https://your-domain.com');
  return response;
}
```

---

## 📊 监控和日志

### 1. 查看实时日志

在 Vercel Dashboard:
1. 进入项目
2. 点击 **"Functions"** 标签
3. 点击具体的函数查看日志

### 2. 配置错误追踪 (可选)

使用 Sentry:
```bash
npm install @sentry/nextjs
```

在 `.env` 添加:
```
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

### 3. 分析性能

在 Vercel Dashboard:
- **Analytics** - 查看访问统计
- **Speed Insights** - 查看性能指标

---

## 🐛 常见问题

### 问题 1: 数据库连接失败

**错误:** `P1001: Can't reach database server`

**解决方法:**
1. 检查 `DATABASE_URL` 是否正确引用 `${POSTGRES_PRISMA_URL}`
2. 确认数据库已创建且在同一区域
3. 检查 Vercel Postgres 状态

### 问题 2: NextAuth 认证错误

**错误:** `[next-auth][error][CALLBACK_CREDENTIALS_HANDLER_ERROR]`

**解决方法:**
1. 确保 `NEXTAUTH_SECRET` 已设置
2. 确认 `NEXTAUTH_URL` 与实际部署 URL 一致
3. 检查数据库是否有 users 表

### 问题 3: 图片上传失败

**错误:** `Cloudinary upload failed`

**解决方法:**
1. 检查 Cloudinary 环境变量是否正确
2. 确认 Cloudinary 账户配额未超限
3. 查看 Functions 日志获取详细错误

### 问题 4: 构建失败

**错误:** `Prisma schema validation failed`

**解决方法:**
1. 确保 `prisma/schema.prisma` 中的 provider 为 `postgresql`
2. 运行 `npx prisma generate` 本地测试
3. 检查依赖版本是否兼容

### 问题 5: 环境变量未生效

**解决方法:**
1. 确认已为 Production 环境添加变量
2. 在添加变量后重新部署
3. 检查变量名拼写是否正确

---

## 🔄 持续部署

### 自动部署

Vercel 会自动监听 Git 仓库的变更:
- **Main 分支** → 生产环境部署
- **其他分支** → 预览环境部署

### 手动部署

使用 Vercel CLI:
```bash
# 部署到生产环境
vercel --prod

# 部署到预览环境
vercel
```

---

## 📝 部署清单

完成部署前,确保以下项目已完成:

- [ ] 代码已推送到 Git 仓库
- [ ] 在 Vercel 中导入项目
- [ ] 创建 Vercel Postgres 数据库
- [ ] 配置所有必需的环境变量:
  - [ ] `DATABASE_URL`
  - [ ] `DIRECT_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] 运行数据库迁移 (`prisma migrate deploy`)
- [ ] (可选) 导入种子数据 (`prisma db seed`)
- [ ] 重新部署项目
- [ ] 测试所有核心功能:
  - [ ] 用户注册/登录
  - [ ] 专辑创建
  - [ ] 照片上传
  - [ ] 管理员后台
- [ ] (可选) 配置自定义域名
- [ ] (可选) 启用分析和监控

---

## 🎯 下一步

部署完成后,你可以:

1. **配置 CI/CD**
   - 添加测试流程
   - 配置预览环境自动测试

2. **性能优化**
   - 启用 Redis 缓存
   - 配置 CDN
   - 优化图片加载

3. **安全增强**
   - 添加速率限制
   - 启用 HTTPS only
   - 配置 CSP 头部

4. **监控和分析**
   - 集成 Sentry 错误追踪
   - 配置性能监控
   - 启用用户分析

---

## 📞 支持和资源

- **Vercel 文档:** https://vercel.com/docs
- **Prisma 文档:** https://www.prisma.io/docs
- **Next.js 文档:** https://nextjs.org/docs
- **Vercel Postgres 文档:** https://vercel.com/docs/storage/vercel-postgres

---

**部署指南版本：** V1.5
**最后更新：** 2025-10-09
**项目版本：** PhotoAlbum V1.4

🎉 **祝你部署顺利!**
