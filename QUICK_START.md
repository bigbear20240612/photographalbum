# 后端部署快速启动指南

> 本文档是 DEPLOYMENT.md 的精简版，提供最快速的部署路径。

## 前置准备（15分钟）

### 1. 注册第三方服务账户

**Vercel Postgres**
- 在Vercel项目中：Storage → Create Database → Postgres
- 选择区域：Hong Kong (hkg1)

**Cloudinary**（图片CDN）
- 注册：https://cloudinary.com/users/register/free
- 获取：Cloud Name、API Key、API Secret

**Pusher**（实时通知）
- 注册：https://dashboard.pusher.com/accounts/sign_up
- 创建Channels应用
- 获取：App ID、Key、Secret、Cluster

## 快速部署（5步骤，30分钟）

### 步骤1：配置环境变量（5分钟）

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填写以下必需变量：
# - POSTGRES_URL（从Vercel Postgres获取）
# - NEXTAUTH_SECRET（运行：openssl rand -base64 32）
# - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER
# - NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER
```

### 步骤2：安装依赖（2分钟）

```bash
# 安装后端依赖
npm install @prisma/client prisma next-auth@beta bcryptjs cloudinary pusher pusher-js exif-parser

# 安装类型定义
npm install -D @types/bcryptjs
```

### 步骤3：初始化数据库（5分钟）

```bash
# 生成Prisma Client
npx prisma generate

# 创建数据库表
npx prisma migrate dev --name init

# 填充种子数据（分类、测试用户）
npx tsx prisma/seed.ts
# 或
npm install -D tsx && npm run db:seed

# 在 package.json 中添加：
# "scripts": {
#   "db:seed": "tsx prisma/seed.ts"
# }
```

### 步骤4：创建API路由（10分钟）

创建以下目录和文件结构：

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts      # 用户注册
│   │   ├── login/route.ts         # 用户登录
│   │   └── me/route.ts            # 获取当前用户
│   ├── users/
│   │   ├── [username]/route.ts    # 获取用户信息
│   │   └── profile/route.ts       # 更新资料
│   ├── albums/
│   │   ├── route.ts               # 获取/创建专辑
│   │   └── [id]/route.ts          # 专辑CRUD
│   └── photos/
│       ├── upload/route.ts        # 上传照片
│       └── [id]/route.ts          # 照片CRUD
lib/
├── prisma.ts                      # Prisma Client实例
├── auth.ts                        # NextAuth配置
└── cloudinary.ts                  # Cloudinary配置
```

**核心文件示例见 DEPLOYMENT.md 第3-6节**

### 步骤5：部署到Vercel（8分钟）

```bash
# 1. 推送代码到GitHub
git add .
git commit -m "Add backend implementation"
git push origin main

# 2. 在Vercel Dashboard中配置环境变量
# Settings → Environment Variables → 添加所有 .env 中的变量

# 3. 配置构建命令（Settings → Build & Development）
# Build Command: prisma generate && next build
# Install Command: npm install

# 4. 添加部署后命令（可选）
# npx prisma migrate deploy

# 5. 触发部署
# 推送代码自动触发，或手动点击 "Redeploy"
```

## 测试验证（10分钟）

### 本地测试

```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问
# http://localhost:3000
```

### API测试（使用curl）

**1. 注册用户**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456!",
    "confirmPassword": "Test123456!"
  }'
```

**2. 登录**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

**3. 获取用户信息（需要token）**
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**4. 创建专辑**
```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试专辑",
    "description": "这是一个测试专辑",
    "status": "published"
  }'
```

### 使用种子数据测试

数据库种子脚本创建了2个测试账户：

**账户1：专业摄影师**
- 邮箱：`photographer@example.com`
- 密码：`Test123456!`
- 已有2个专辑和3张照片

**账户2：业余爱好者**
- 邮箱：`hobbyist@example.com`
- 密码：`Test123456!`
- 已有1个草稿专辑

## 核心配置文件速查

### 1. `lib/prisma.ts`
```typescript
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

### 2. `lib/cloudinary.ts`
```typescript
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
})

export { cloudinary }
```

### 3. `lib/auth.ts`（NextAuth.js v5）
```typescript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) throw new Error("邮箱或密码错误")

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) throw new Error("邮箱或密码错误")

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  }
})
```

## 常用命令速查

```bash
# 开发
npm run dev                    # 启动开发服务器

# 数据库
npx prisma studio              # 打开数据库管理界面
npx prisma migrate dev         # 创建并应用迁移
npx prisma migrate deploy      # 生产环境应用迁移
npx prisma generate            # 生成Prisma Client
npx prisma db seed             # 运行种子数据

# 构建
npm run build                  # 构建生产版本
npm start                      # 启动生产服务器

# 部署
vercel                         # 部署到预览环境
vercel --prod                  # 部署到生产环境
```

## 故障排查

**问题1：数据库连接失败**
```bash
# 检查环境变量
echo $POSTGRES_URL

# 测试连接
npx prisma db pull
```

**问题2：Prisma Client未生成**
```bash
# 重新生成
npx prisma generate
```

**问题3：迁移失败**
```bash
# 重置数据库（开发环境）
npx prisma migrate reset

# 查看迁移状态
npx prisma migrate status
```

**问题4：NextAuth不工作**
```bash
# 确认环境变量
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL

# 生成新的secret
openssl rand -base64 32
```

## 下一步

完成后端部署后，建议：

1. 📖 **阅读完整文档**：`DEPLOYMENT.md` 了解详细配置
2. 🧪 **编写测试**：为关键API添加单元测试
3. 📊 **配置监控**：集成Sentry错误追踪
4. 🔒 **安全加固**：启用CSRF保护、速率限制
5. 🚀 **性能优化**：配置缓存策略、CDN

## 获取帮助

- 完整文档：`DEPLOYMENT.md`
- API设计：`DEPLOYMENT.md` 第3节
- 数据库Schema：`prisma/schema.prisma`
- 环境变量：`.env.example`

---

**祝部署顺利！** 🎉
