# Vercel 快速配置指南

**用于快速复制粘贴的配置信息**

---

## 📋 Vercel 项目配置

### Framework Preset
```
Next.js
```

### Root Directory
```
./
```

### Build Command
```bash
npm run build
```

### Install Command
```bash
npm install
```

---

## 🔐 必需的环境变量

### 1. 数据库配置 (Vercel Postgres)

```bash
# 在创建 Vercel Postgres 后,添加以下变量:
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}
```

### 2. NextAuth 配置

```bash
# 生成 SECRET: openssl rand -base64 32
NEXTAUTH_SECRET=<生成的32字节密钥>

# 部署后的域名
NEXTAUTH_URL=https://your-project.vercel.app
```

### 3. Cloudinary 配置

```bash
CLOUDINARY_CLOUD_NAME=<你的cloud-name>
CLOUDINARY_API_KEY=<你的api-key>
CLOUDINARY_API_SECRET=<你的api-secret>
```

---

## ⚡ 快速部署步骤

### 步骤 1: 在 Vercel 导入项目
1. https://vercel.com/new
2. 选择 GitHub 仓库
3. **暂不点击 Deploy**

### 步骤 2: 创建数据库
1. 点击 "Storage" 标签
2. "Create Database" → "Postgres"
3. 选择区域: **ap-southeast-1** (新加坡)
4. 点击 "Create"

### 步骤 3: 配置环境变量
在 "Environment Variables" 中添加上面的所有变量

### 步骤 4: 部署
点击 "Deploy"

### 步骤 5: 运行数据库迁移

```bash
# 安装 CLI
npm i -g vercel

# 登录并链接
vercel login
vercel link

# 拉取环境变量
vercel env pull .env.production

# 运行迁移
npx prisma migrate deploy

# (可选) 导入测试数据
npx prisma db seed
```

### 步骤 6: 重新部署
在 Vercel Dashboard → Deployments → Redeploy

---

## 📝 生成 NEXTAUTH_SECRET

### 方法 1: OpenSSL
```bash
openssl rand -base64 32
```

### 方法 2: Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 方法 3: 在线生成
https://generate-secret.vercel.app/32

---

## 🧪 测试部署

### 测试 API
```bash
curl https://your-domain.vercel.app/api/categories
```

### 测试管理员登录
```
Email: john@example.com
Password: password123
URL: https://your-domain.vercel.app/admin
```

---

## 🔧 可选配置

### 添加构建后自动迁移

在 `package.json`:
```json
{
  "scripts": {
    "postbuild": "prisma generate && prisma migrate deploy"
  }
}
```

### 自定义域名
Vercel Dashboard → Settings → Domains → Add Domain

---

## ❗ 常见错误

### 错误: 数据库连接失败
✅ 检查 `DATABASE_URL` 是否为 `${POSTGRES_PRISMA_URL}`

### 错误: NextAuth 认证失败
✅ 确保 `NEXTAUTH_URL` 与实际 URL 一致

### 错误: Prisma 表不存在
✅ 运行 `npx prisma migrate deploy`

---

## 📞 文档链接

- 完整部署指南: `docs/VERCEL_DEPLOYMENT_GUIDE.md`
- Vercel 官方文档: https://vercel.com/docs
- Vercel Postgres 文档: https://vercel.com/docs/storage/vercel-postgres

---

**快速配置版本:** V1.0
**更新时间:** 2025-10-09
