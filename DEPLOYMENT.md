# 🚀 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/photographalbum)

## 部署要求

在部署之前,你需要:

1. ✅ 一个 Vercel 账户
2. ✅ 一个 Cloudinary 账户 (用于图片上传)

## 快速部署步骤

### 1️⃣ 点击上方 "Deploy with Vercel" 按钮

### 2️⃣ 创建 Vercel Postgres 数据库

在 Vercel 项目配置页面:
- 点击 **"Storage"** 标签
- 点击 **"Create Database"** → **"Postgres"**
- 选择区域 (推荐: **ap-southeast-1** 新加坡)
- 点击 **"Create"**

### 3️⃣ 配置环境变量

添加以下必需的环境变量:

```bash
# 数据库 (Vercel Postgres 自动注入)
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}

# NextAuth (生成密钥: openssl rand -base64 32)
NEXTAUTH_SECRET=<你生成的32字节密钥>
NEXTAUTH_URL=https://your-project.vercel.app

# Cloudinary (从 https://cloudinary.com/console 获取)
CLOUDINARY_CLOUD_NAME=<你的cloud-name>
CLOUDINARY_API_KEY=<你的api-key>
CLOUDINARY_API_SECRET=<你的api-secret>
```

### 4️⃣ 部署项目

点击 **"Deploy"** 按钮

### 5️⃣ 运行数据库迁移

首次部署后,运行以下命令:

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并链接项目
vercel login
vercel link

# 拉取环境变量
vercel env pull .env.production

# 运行数据库迁移
npx prisma migrate deploy

# 导入测试数据 (可选)
npx prisma db seed
```

### 6️⃣ 重新部署

在 Vercel Dashboard:
- 进入 "Deployments" 标签
- 点击最新部署的 "..." → "Redeploy"

---

## 📖 详细部署文档

- [完整部署指南](./docs/VERCEL_DEPLOYMENT_GUIDE.md)
- [快速配置指南](./docs/VERCEL_QUICK_CONFIG.md)

## 🧪 测试部署

### 测试管理员登录

```
URL: https://your-domain.vercel.app/admin
Email: john@example.com
Password: password123
```

### 测试 API

```bash
curl https://your-domain.vercel.app/api/categories
```

---

## 🛠️ 本地开发

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/photographalbum.git
cd photographalbum
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`:

```bash
cp .env.example .env
```

编辑 `.env` 文件,填写必需的配置。

### 4. 设置数据库

开发环境可以使用本地 PostgreSQL 或 SQLite:

**选项 A: PostgreSQL (推荐)**
```bash
# 启动本地 PostgreSQL
# 更新 .env 中的 DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/photographalbum"

# 运行迁移
npx prisma migrate dev

# 导入测试数据
npx prisma db seed
```

**选项 B: SQLite (快速测试)**
```bash
# 临时使用 SQLite
# 修改 prisma/schema.prisma 中的 provider 为 "sqlite"
# 更新 .env
DATABASE_URL="file:./dev.db"

# 运行迁移
npx prisma migrate dev

# 导入测试数据
npx prisma db seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3003

---

## 📚 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **数据库**: PostgreSQL (生产) / SQLite (开发)
- **ORM**: Prisma
- **认证**: NextAuth.js
- **样式**: Tailwind CSS
- **图片上传**: Cloudinary
- **部署**: Vercel

---

## 🎯 功能特性

- ✅ 用户注册和登录
- ✅ 专辑创建和管理
- ✅ 照片上传和展示
- ✅ 社交功能(点赞/评论/关注)
- ✅ 实时通知系统
- ✅ 全局搜索
- ✅ 高级筛选
- ✅ 管理员后台
- ✅ 响应式设计

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

---

## 📞 支持

如有问题,请查看:
- [部署指南](./docs/VERCEL_DEPLOYMENT_GUIDE.md)
- [快速配置](./docs/VERCEL_QUICK_CONFIG.md)
- [项目文档](./docs/)

---

**项目版本:** V1.4
**最后更新:** 2025-10-09
