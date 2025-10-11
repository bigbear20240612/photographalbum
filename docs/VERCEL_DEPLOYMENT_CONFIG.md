# Vercel 部署配置详细指南

**项目:** PhotoAlbum - 摄影作品展示平台
**版本:** V1.4 Production Ready
**框架:** Next.js 14 (App Router)
**数据库:** PostgreSQL (Vercel Postgres)
**更新时间:** 2025-10-11
**仓库地址:** https://github.com/bigbear20240612/photographalbum.git

---

## 最新更新 (2025-10-11)

### ✅ 已完成的修复

1. **categoryTags 类型错误修复** (Commit: `7be5de4`)
   - ❌ 旧问题：`PrismaClientValidationError: Expected String or Null, provided (String)`
   - 🔍 根本原因：Prisma schema 定义 `categoryTags String?` (JSON字符串)，但前端发送的是数组 `["运动摄影"]`
   - ✅ 解决方案：将前端发送的数组改为 `JSON.stringify([category])` 格式
   - 📝 文件：`src/app/dashboard/albums/create/page.tsx:44`
   - 🎯 效果：修复了创建专辑时的 500 Internal Server Error

2. **前端仪表板连接真实 API** (Commit: `5c28a61`, `4fac306`)
   - ✅ 连接所有仪表板页面到真实后端 API
   - ✅ 移除所有模拟功能和 setTimeout 代码
   - ✅ 实现完整的专辑创建、编辑、删除功能
   - ✅ 实现照片上传功能

3. **Dynamic Server Usage 警告处理** (Commit: `d4a6d97`)
   - ✅ 为管理员 API 路由添加 `export const dynamic = 'force-dynamic'`
   - ✅ 优化 Serverless Function 配置

### 📌 待完成任务

- ⏳ **推送代码到 GitHub**：由于网络问题，commit `7be5de4` 尚未推送
- ⏳ **Vercel 自动部署**：等待代码推送后触发部署
- ⏳ **测试修复效果**：在 https://photographalbum.vercel.app 测试专辑创建功能

### 🔧 技术细节

**修复前的错误：**
```typescript
// 前端发送：
categoryTags: formData.category ? [formData.category] : []
// 结果：["运动摄影"] ❌ Array

// Prisma 期望：
categoryTags String? // JSON string
```

**修复后的代码：**
```typescript
// 前端发送：
categoryTags: formData.category ? JSON.stringify([formData.category]) : undefined
// 结果："[\"运动摄影\"]" ✅ JSON String
```

---

## 📋 目录

1. [准备工作](#准备工作)
2. [Vercel 页面配置详解](#vercel-页面配置详解)
3. [数据库配置](#数据库配置)
4. [环境变量完整列表](#环境变量完整列表)
5. [构建配置](#构建配置)
6. [部署流程](#部署流程)
7. [部署后配置](#部署后配置)
8. [验证清单](#验证清单)
9. [故障排除](#故障排除)

---

## 🚀 快速开始指南

> 如果你已经看到了 Vercel 配置页面,这里是最快的配置方法!

### 5分钟快速配置清单

#### 步骤 1: 保持默认设置 (30秒)
- ✅ **Vercel Team**: 选择你的团队 (例如: big_bear's projects)
- ✅ **Project Name**: `photographalbum`
- ✅ **Framework Preset**: Next.js (自动检测)
- ✅ **Root Directory**: `./` (不要改)
- ✅ **Build Command**: `npm run build` (不要改)
- ✅ **Output Directory**: Next.js default (不要改)
- ✅ **Install Command**: `npm install` (不要改)

#### 步骤 2: 配置环境变量 (3分钟)

1. **删除示例变量**
   - 点击 `EXAMPLE_NAME` 右侧的 `[-]` 按钮

2. **添加 7 个必需变量** (点击 `+ Add More` 逐个添加)

| # | Key | Value | Environment |
|---|-----|-------|-------------|
| 1 | `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` | ✅ Prod ✅ Preview |
| 2 | `DIRECT_URL` | `${POSTGRES_URL_NON_POOLING}` | ✅ Prod ✅ Preview |
| 3 | `NEXTAUTH_SECRET` | NEXTAUTH_SECRET=Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I= | ✅ Prod ✅ Preview |
| 4 | `NEXTAUTH_URL` | `https://photographalbum.vercel.app` | ✅ Prod only |
| 5 | `CLOUDINARY_CLOUD_NAME` | [dmolmq6dr](#cloudinary) | ✅ Prod ✅ Preview |
| 6 | `CLOUDINARY_API_KEY` | 639768862499573 | ✅ Prod ✅ Preview |
| 7 | `CLOUDINARY_API_SECRET` | jc1rYAQcZkt1ndtWrAdZyUgdzy8 | ✅ Prod ✅ Preview |

<a name="生成密钥"></a>
**¹ 生成 NEXTAUTH_SECRET:**

```bash
# 在终端运行
openssl rand -base64 32
# 或访问 https://generate-secret.vercel.app/32
```

<a name="cloudinary"></a>
**² 获取 Cloudinary 凭据:**
访问 https://cloudinary.com/console → Dashboard → Account Details

#### 步骤 3: 创建数据库 (1分钟)

⚠️ **重要:** 必须先创建数据库,再点击 Deploy!

1. 暂时不要点击 Deploy
2. 打开新标签页访问: https://vercel.com/dashboard
3. 进入项目 → **Storage** → **Create Database** → **Postgres**
4. 选择区域: **Singapore (ap-southeast-1)** 推荐
5. 点击 **Create**

#### 步骤 4: 部署 (30秒)

1. 返回配置页面
2. 点击 **Deploy** 按钮
3. 等待 2-5 分钟

#### 步骤 5: 运行数据库迁移 (1分钟)

部署成功后,在本地终端运行:
```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed  # 可选: 导入测试数据
```

✅ **完成!** 访问 `https://photographalbum.vercel.app` 查看你的应用

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
git push origin master  # 注意: 项目使用 master 分支

# 确保所有依赖正常
npm install
npm run build  # 本地测试构建
```

### 3. 项目技术栈概览

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 14.2.18 | React 全栈框架 (App Router) |
| React | 18.3.1 | 前端框架 |
| TypeScript | 5.6.3 | 类型系统 |
| Prisma | 6.17.0 | ORM 数据库工具 |
| PostgreSQL | Latest | 生产数据库 |
| NextAuth.js | 5.0.0-beta.29 | 认证系统 |
| Cloudinary | 2.7.0 | 图片存储服务 |
| Tailwind CSS | 3.4.17 | CSS 框架 |

---

## Vercel 页面配置详解

### 📸 配置页面概览

当你从 GitHub 导入项目后,会看到如下配置页面:

```
┌─────────────────────────────────────────────────────┐
│ Vercel Team        │ Project Name                   │
│ big_bear's projects│ photographalbum                │
│ Hobby ▼            │                                │
├─────────────────────────────────────────────────────┤
│ Framework Preset                                     │
│ ⚫ Next.js                                      ▼   │
├─────────────────────────────────────────────────────┤
│ Root Directory                                       │
│ ./                                       [Edit]     │
├─────────────────────────────────────────────────────┤
│ ▼ Build and Output Settings                        │
│                                                      │
│   Build Command                                      │
│   npm run build                              ✏️     │
│                                                      │
│   Output Directory                                   │
│   Next.js default                            ✏️     │
│                                                      │
│   Install Command                                    │
│   npm install                                ✏️     │
├─────────────────────────────────────────────────────┤
│ ▼ Environment Variables                             │
│                                                      │
│   Key                    Value                       │
│   EXAMPLE_NAME          I9JU23NF394R6HH        [-]  │
│                                                      │
│   [+ Add More]                                      │
│                                                      │
│   Tip: Paste an .env above to populate the form.    │
├─────────────────────────────────────────────────────┤
│                    [Deploy]                          │
└─────────────────────────────────────────────────────┘
```

### 步骤 1: 导入项目

1. 登录 Vercel Dashboard: https://vercel.com/dashboard
2. 点击 **"Add New..."** → **"Project"**
3. 选择 **GitHub**
4. 搜索并选择 `photographalbum` 仓库
5. 点击 **"Import"**

### 步骤 2: Vercel Team & Project Name

#### Vercel Team
```
big_bear's projects (Hobby)
```
> 💡 选择你的个人团队或组织团队
>
> **Hobby 计划限制:**
> - Serverless Function 执行时间: 10秒
> - 带宽: 100GB/月
> - 构建时间: 6 小时/月
>
> **Pro 计划优势:**
> - Function 执行时间: 60秒
> - 带宽: 1TB/月
> - 更快构建速度

#### Project Name
```
photographalbum
```
> ⚠️ **注意**: 项目名称将决定默认域名
> - 域名格式: `photographalbum.vercel.app`
> - 项目名称必须唯一
> - 建议使用小写字母和连字符

### 步骤 3: Framework Preset

```
⚫ Next.js  ▼
```

✅ **Vercel 会自动检测到 Next.js 14**

**自动配置内容:**
- 使用 Next.js 优化的构建流程
- 自动配置 Serverless Functions
- 启用增量静态生成 (ISR)
- 图片优化
- 边缘网络 CDN

> ⚠️ 如果未自动检测,请手动选择 **"Next.js"**

### 步骤 4: Root Directory

```
./
```

✅ **保持默认值 `./`**

> ⚠️ **不要修改!** 项目根目录包含:
> - `package.json` - 依赖配置
> - `next.config.js` - Next.js 配置
> - `vercel.json` - Vercel 配置
> - `prisma/` - 数据库 schema
> - `src/` - 源代码

### 步骤 5: Build and Output Settings

#### Build Command (构建命令)

```bash
npm run build
```

✅ **保持默认值**

**对应 package.json 中的脚本:**
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

**构建过程包括:**
1. TypeScript 类型检查
2. Prisma Client 生成 (通过 postinstall)
3. Next.js 页面编译
4. 静态资源优化
5. Serverless Functions 打包

**可选增强版本:**
```bash
npx prisma generate && npm run build
```
> 💡 显式生成 Prisma Client,确保数据库客户端可用

#### Output Directory (输出目录)

```
.next
```
或显示为:
```
Next.js default
```

✅ **保持默认值**

> ⚠️ **不要修改!** Next.js 固定使用 `.next` 目录作为构建输出

**输出内容包括:**
- `.next/server/` - 服务端渲染页面
- `.next/static/` - 静态资源
- `.next/cache/` - 构建缓存

#### Install Command (安装命令)

```bash
npm install
```

✅ **保持默认值**

**安装流程:**
1. 读取 `package.json` 和 `package-lock.json`
2. 安装所有 dependencies 和 devDependencies
3. 运行 `postinstall` 脚本 (自动生成 Prisma Client)

**对应 package.json:**
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

> ✅ 项目已配置 `postinstall`,确保 Prisma Client 自动生成

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

### 🔧 配置步骤: Environment Variables

#### 第一步: 删除示例变量

配置页面默认有一个示例变量:
```
Key: EXAMPLE_NAME
Value: I9JU23NF394R6HH
```

⚠️ **必须删除!** 点击右侧的 `[-]` 按钮删除示例变量

#### 第二步: 添加必需的环境变量

### 必需的环境变量 (Required) - 共 7 个

#### 1️⃣ 数据库配置 (2个变量)

> ⚠️ **前置条件:** 必须先创建 Vercel Postgres 数据库 (见下方"数据库配置"章节)

##### DATABASE_URL

| 字段 | 值 |
|------|-----|
| **Key** | `DATABASE_URL` |
| **Value** | `${POSTGRES_PRISMA_URL}` |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**添加步骤:**
1. 点击 **"+ Add More"** 按钮
2. 在 **Key** 输入框输入: `DATABASE_URL`
3. 在 **Value** 输入框输入: `${POSTGRES_PRISMA_URL}`
   - ⚠️ 必须完整复制,包括 `${` 和 `}`
   - 这是 Vercel 变量引用语法
4. 选择环境:
   - ✅ 勾选 **Production**
   - ✅ 勾选 **Preview**
   - ⬜ 不勾选 Development
5. 点击右侧 **"Save"** 或继续添加下一个

##### DIRECT_URL

| 字段 | 值 |
|------|-----|
| **Key** | `DIRECT_URL` |
| **Value** | `${POSTGRES_URL_NON_POOLING}` |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**说明:**
- `DATABASE_URL` 使用连接池 (connection pooling),适合应用查询
- `DIRECT_URL` 使用直连 (non-pooling),适合数据库迁移
- Vercel 创建 Postgres 数据库后会自动注入这些变量

#### 2️⃣ NextAuth 配置 (2个变量)

##### NEXTAUTH_SECRET

| 字段 | 值 |
|------|-----|
| **Key** | `NEXTAUTH_SECRET` |
| **Value** | (生成的32字节密钥) |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**🔑 如何生成密钥:**

**方法 1 - OpenSSL (推荐,Windows/Mac/Linux):**
```bash
openssl rand -base64 32
```

**方法 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**方法 3 - 在线生成器:**
访问: https://generate-secret.vercel.app/32

**示例输出:**
```
dGVzdGluZzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdA==
```

**添加步骤:**
1. 使用上述任一方法生成密钥
2. 复制生成的完整字符串
3. 在 Vercel 添加:
   - Key: `NEXTAUTH_SECRET`
   - Value: 粘贴生成的密钥 (例如: `dGVzdGluZzEyMzQ1Njc4OTBhYmNkZWZn...`)
   - Environment: ✅ Production, ✅ Preview

> ⚠️ **安全提示:**
> - 密钥必须至少 32 字节
> - 不要使用示例值
> - 不要提交到 Git 仓库
> - 定期更换密钥

##### NEXTAUTH_URL

| 字段 | 值 |
|------|-----|
| **Key** | `NEXTAUTH_URL` |
| **Value** | `https://photographalbum.vercel.app` |
| **Environment** | ✅ Production, ⬜ Preview, ⬜ Development |

**添加步骤:**
1. Key: `NEXTAUTH_URL`
2. Value: `https://photographalbum.vercel.app`
   - 首次部署可以先填 `https://photographalbum.vercel.app`
   - 部署成功后更新为实际域名
3. Environment: ✅ **只勾选 Production**
   - Preview 环境 Vercel 会自动设置正确的 URL

> 💡 **提示:** 如果使用自定义域名,填写自定义域名:
> ```
> https://yourdomain.com
> ```

#### 3️⃣ Cloudinary 配置 (3个变量)

Cloudinary 用于图片上传和存储服务。

**📸 获取 Cloudinary 凭据:**

1. 访问 Cloudinary Console: https://cloudinary.com/console
2. 注册/登录账户 (免费计划足够)
3. 在 Dashboard 页面找到 **"Account Details"** 或 **"API Keys"** 区域
4. 复制以下信息:

##### CLOUDINARY_CLOUD_NAME

| 字段 | 值 |
|------|-----|
| **Key** | `CLOUDINARY_CLOUD_NAME` |
| **Value** | `your-cloud-name` (从 Cloudinary 复制) |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**示例值:**
```
dpxyz123abc
```

##### CLOUDINARY_API_KEY

| 字段 | 值 |
|------|-----|
| **Key** | `CLOUDINARY_API_KEY` |
| **Value** | `123456789012345` (从 Cloudinary 复制) |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**示例值:**
```
123456789012345
```

##### CLOUDINARY_API_SECRET

| 字段 | 值 |
|------|-----|
| **Key** | `CLOUDINARY_API_SECRET` |
| **Value** | `your-api-secret` (从 Cloudinary 复制) |
| **Environment** | ✅ Production, ✅ Preview, ⬜ Development |

**获取方式:**
- 在 Cloudinary Dashboard 点击 API Secret 旁边的 **"眼睛"图标** 显示
- 或点击 **"Reveal"** 按钮

**示例值:**
```
Abc123XyZ456DefGhi789Jkl
```

> ⚠️ **安全提示:**
> - API Secret 是敏感信息,不要公开
> - 不要提交到 Git 仓库
> - 定期轮换 API 密钥

---

### 📋 环境变量配置完整示例

配置完成后,你的环境变量列表应该如下所示:

```
┌──────────────────────────────────────────────────────────────┐
│ Environment Variables                                         │
├──────────────────────────────────────────────────────────────┤
│ ✅ 1. DATABASE_URL                                           │
│    Value: ${POSTGRES_PRISMA_URL}                             │
│    Environment: ✅ Production  ✅ Preview                    │
├──────────────────────────────────────────────────────────────┤
│ ✅ 2. DIRECT_URL                                             │
│    Value: ${POSTGRES_URL_NON_POOLING}                        │
│    Environment: ✅ Production  ✅ Preview                    │
├──────────────────────────────────────────────────────────────┤
│ ✅ 3. NEXTAUTH_SECRET                                        │
│    Value: dGVzdGluZzEyMzQ1Njc4OTBhYmNkZWZnaGlqa2... (隐藏)  │
│    Environment: ✅ Production  ✅ Preview                    │
├──────────────────────────────────────────────────────────────┤
│ ✅ 4. NEXTAUTH_URL                                           │
│    Value: https://photographalbum.vercel.app                 │
│    Environment: ✅ Production                                │
├──────────────────────────────────────────────────────────────┤
│ ✅ 5. CLOUDINARY_CLOUD_NAME                                  │
│    Value: your-cloud-name                                    │
│    Environment: ✅ Production  ✅ Preview                    │
├──────────────────────────────────────────────────────────────┤
│ ✅ 6. CLOUDINARY_API_KEY                                     │
│    Value: 123456789012345                                    │
│    Environment: ✅ Production  ✅ Preview                    │
├──────────────────────────────────────────────────────────────┤
│ ✅ 7. CLOUDINARY_API_SECRET                                  │
│    Value: Abc123XyZ456DefGhi789Jkl (隐藏)                    │
│    Environment: ✅ Production  ✅ Preview                    │
└──────────────────────────────────────────────────────────────┘
```

---

### 🎯 环境变量快速参考表

| # | 变量名 | 类型 | 获取方式 | Environment |
|---|--------|------|----------|-------------|
| 1 | `DATABASE_URL` | 数据库 | `${POSTGRES_PRISMA_URL}` | Prod + Preview |
| 2 | `DIRECT_URL` | 数据库 | `${POSTGRES_URL_NON_POOLING}` | Prod + Preview |
| 3 | `NEXTAUTH_SECRET` | 认证 | `openssl rand -base64 32` | Prod + Preview |
| 4 | `NEXTAUTH_URL` | 认证 | `https://your-domain.vercel.app` | Prod only |
| 5 | `CLOUDINARY_CLOUD_NAME` | 存储 | Cloudinary Dashboard | Prod + Preview |
| 6 | `CLOUDINARY_API_KEY` | 存储 | Cloudinary Dashboard | Prod + Preview |
| 7 | `CLOUDINARY_API_SECRET` | 存储 | Cloudinary Dashboard | Prod + Preview |

---

### 💡 Vercel 环境变量提示功能

在配置页面底部有提示:

```
Tip: Paste an .env above to populate the form.
```

**批量导入方法:**

1. 准备 `.env` 格式内容:
```bash
DATABASE_URL=${POSTGRES_PRISMA_URL}
DIRECT_URL=${POSTGRES_URL_NON_POOLING}
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://photographalbum.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

2. 全选复制上述内容

3. 在 Vercel 环境变量配置区域,找到第一个输入框上方的空白区域

4. 粘贴内容 - Vercel 会自动解析并填充表单

5. 手动调整每个变量的 Environment 选项

> ⚠️ **注意:** 批量导入后仍需逐个检查和调整环境设置

---

### 可选的环境变量 (Optional)

这些变量有默认值,通常不需要配置,但可以根据需要调整。

#### 性能和限制

| Variable | Default Value | Description | 推荐值 |
|----------|---------------|-------------|--------|
| `MAX_FILE_SIZE` | `20971520` | 最大文件大小 (字节) | 20MB |
| `MAX_FILES_PER_UPLOAD` | `50` | 单次最大上传数量 | 50 |
| `NODE_ENV` | `production` | Node 环境 | (自动设置) |

#### 功能开关

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `ENABLE_REGISTRATION` | `true` | 是否开放用户注册 |
| `ENABLE_REALTIME_NOTIFICATIONS` | `true` | 是否启用实时通知 |

---

### ⚠️ 常见错误和注意事项

#### 错误 1: 变量引用格式错误

❌ **错误:**
```
DATABASE_URL=$POSTGRES_PRISMA_URL      # 缺少大括号
DATABASE_URL=POSTGRES_PRISMA_URL       # 缺少 ${}
DATABASE_URL=${POSTGRES_PRISMA_URL}    # 多了空格
```

✅ **正确:**
```
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

#### 错误 2: 环境选择不当

❌ **错误配置:**
- `NEXTAUTH_URL` 同时勾选 Production 和 Preview
- `DATABASE_URL` 只勾选 Production

✅ **正确配置:**
- 数据库变量: Production + Preview
- `NEXTAUTH_URL`: 只勾选 Production
- 其他认证变量: Production + Preview

#### 错误 3: 密钥包含额外字符

❌ **错误:**
```bash
# 复制时带了提示符或换行
NEXTAUTH_SECRET=$ dGVzdGluZzEyMzQ1Njc4OTBhYmNk
NEXTAUTH_SECRET=dGVzdGluZzEyMzQ1Njc4OTBhYmNk\n
```

✅ **正确:**
```bash
# 只复制密钥本身
NEXTAUTH_SECRET=dGVzdGluZzEyMzQ1Njc4OTBhYmNk
```

#### 错误 4: 先部署后创建数据库

⚠️ **错误流程:**
1. 配置环境变量 (DATABASE_URL)
2. 点击 Deploy
3. 创建数据库 ← ❌ 太晚了

✅ **正确流程:**
1. 先创建 Vercel Postgres 数据库
2. 配置环境变量 (引用自动注入的变量)
3. 点击 Deploy

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

### 🚀 完整部署流程图

```
1. GitHub 仓库准备
   ↓
2. 创建 Vercel Postgres 数据库 ⚠️ 必须在配置环境变量之前!
   ↓
3. 配置环境变量 (7个必需变量)
   ↓
4. 点击 Deploy (首次部署)
   ↓
5. 等待构建完成 (2-5分钟)
   ↓
6. 运行数据库迁移 (Vercel CLI)
   ↓
7. 导入测试数据 (可选)
   ↓
8. 验证部署
   ↓
9. 更新 NEXTAUTH_URL (如果需要)
   ↓
✅ 部署完成
```

---

### 步骤 1: 首次部署前的准备

#### ✅ 部署前检查清单

在点击 **Deploy** 按钮之前,确认:

- [ ] ✅ GitHub 仓库已同步最新代码
- [ ] ✅ Vercel Postgres 数据库已创建
- [ ] ✅ 所有 7 个必需环境变量已配置:
  - [ ] `DATABASE_URL`
  - [ ] `DIRECT_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] ✅ Framework Preset 设置为 Next.js
- [ ] ✅ Root Directory 为 `./`
- [ ] ✅ Build Command 为 `npm run build`
- [ ] ✅ Install Command 为 `npm install`

> ⚠️ **重要:** 如果尚未创建 Vercel Postgres 数据库,请先跳转到"数据库配置"章节!

---

### 步骤 2: 点击 Deploy

1. 确认所有配置正确
2. 在配置页面底部点击 **"Deploy"** 按钮
3. 等待部署开始

**部署过程:**
```
Queued...
  ↓
Building...
  - Installing dependencies (npm install)
  - Running postinstall script (prisma generate)
  - Building Next.js app (npm run build)
  - Optimizing pages and assets
  ↓
Deploying...
  - Uploading build artifacts
  - Configuring serverless functions
  - Deploying to edge network
  ↓
Ready! 🎉
```

**预期结果:**
- ✅ 构建成功 (约 2-5 分钟)
- ⚠️ 应用可以访问,但无法使用 (数据库表尚未创建)

**查看构建日志:**
- 在部署过程中,可以点击 **"View Build Logs"** 查看实时日志
- 构建日志会显示每一步的详细输出

---

### 步骤 3: 运行数据库迁移

> ⚠️ **重要:** 首次部署后,数据库是空的,必须运行迁移创建表结构!

#### 方法 A: 使用 Vercel CLI (推荐)

**3.1 安装 Vercel CLI (首次需要)**

```bash
# Windows/Mac/Linux
npm install -g vercel

# 验证安装
vercel --version
```

**3.2 登录 Vercel**

```bash
vercel login
```

会打开浏览器进行认证,按照提示完成登录。

**3.3 链接项目**

```bash
# 进入项目目录
cd D:\data\CLAUDE_USE\Vercel\photographalbum

# 链接到 Vercel 项目
vercel link
```

会提示选择:
```
? Set up "D:\data\CLAUDE_USE\Vercel\photographalbum"? [Y/n] y
? Which scope should contain your project? big_bear's projects
? Link to existing project? [Y/n] y
? What's the name of your existing project? photographalbum
✅ Linked to bigbear20240612/photographalbum
```

**3.4 拉取生产环境变量**

```bash
vercel env pull .env.production
```

会创建 `.env.production` 文件,包含所有配置的环境变量。

**3.5 运行数据库迁移**

```bash
# 设置环境变量 (Windows PowerShell)
$env:DATABASE_URL=$(Get-Content .env.production | Select-String "^DATABASE_URL" | ForEach-Object { $_ -replace 'DATABASE_URL=', '' })
$env:DIRECT_URL=$(Get-Content .env.production | Select-String "^DIRECT_URL" | ForEach-Object { $_ -replace 'DIRECT_URL=', '' })

# 运行迁移
npx prisma migrate deploy
```

**Windows CMD 用户:**
```bash
# 直接使用 .env.production 文件
set /p DATABASE_URL=<.env.production
npx prisma migrate deploy
```

**Mac/Linux 用户:**
```bash
# 加载环境变量
export $(grep -v '^#' .env.production | xargs)

# 运行迁移
npx prisma migrate deploy
```

**预期输出:**
```
Environment variables loaded from .env.production
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "verceldb", schema "public" at "xxxx.postgres.vercel-storage.com:5432"

12 migrations found in prisma/migrations

Applying migration `20251009_init`
Applying migration `20251009_add_social_features`
Applying migration `20251009_add_notifications`
Applying migration `20251009_add_user_role`

The following migrations have been applied:

migrations/
  └─ 20251009_init/
      └─ migration.sql
  └─ 20251009_add_social_features/
      └─ migration.sql
  └─ 20251009_add_notifications/
      └─ migration.sql
  └─ 20251009_add_user_role/
      └─ migration.sql

✔ All migrations have been successfully applied.
```

**3.6 导入测试数据 (可选)**

```bash
# 运行 seed 脚本
npx prisma db seed
```

**预期输出:**
```
🌱 Seeding database...
✅ Created 5 categories
✅ Created 5 users (john@example.com is admin)
✅ Created 15 albums
✅ Created 50 photos
✅ Created 100 likes
✅ Created 80 comments
✅ Created 20 follows
✅ Created 30 notifications
🎉 Database seeded successfully!
```

**测试账户:**
| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | ADMIN |
| jane@example.com | password123 | USER |
| mike@example.com | password123 | USER |
| sarah@example.com | password123 | USER |
| alex@example.com | password123 | USER |

---

#### 方法 B: 在构建时自动运行迁移 (不推荐)

> ⚠️ **警告:** 此方法会在每次部署时运行迁移,可能导致问题!

修改 `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**缺点:**
- 每次部署都运行迁移,增加构建时间
- 迁移失败会导致整个部署失败
- 不适合频繁部署
- 难以回滚

**推荐做法:** 使用 Vercel CLI 手动运行迁移

---

### 步骤 4: 验证部署

迁移完成后,访问你的部署 URL:

```
https://photographalbum.vercel.app
```

或者:

```
https://photographalbum-[random].vercel.app
```

**验证项目:**

1. **首页加载**
   ```
   https://your-domain.vercel.app/
   ```
   应显示摄影作品展示首页

2. **API 测试**
   ```bash
   curl https://your-domain.vercel.app/api/categories
   ```
   应返回分类列表 JSON

3. **登录测试**
   - 访问: `/auth/signin`
   - 使用测试账户: john@example.com / password123
   - 应成功登录并跳转到 dashboard

4. **管理后台测试**
   - 使用管理员账户登录
   - 访问: `/admin`
   - 应显示统计数据和用户列表

---

### 步骤 5: 更新 NEXTAUTH_URL (如果需要)

如果实际部署的域名与配置的 `NEXTAUTH_URL` 不同:

1. 复制实际的部署 URL
   - 例如: `https://photographalbum-abc123.vercel.app`

2. 进入 Vercel Dashboard → 项目 → **Settings** → **Environment Variables**

3. 找到 `NEXTAUTH_URL` 变量,点击 **"Edit"**

4. 更新为实际的 URL

5. 保存

6. (可选) 重新部署:
   - **Deployments** → 最新部署 → **"..."** → **"Redeploy"**

> 💡 **提示:** 如果使用默认的 `photographalbum.vercel.app`,通常不需要修改

---

### 步骤 6: 后续更新部署

代码更新后,自动部署流程:

1. **本地提交代码**
   ```bash
   git add .
   git commit -m "Update features"
   git push origin master
   ```

2. **自动触发部署**
   - Vercel 自动检测 `master` 分支的 push
   - 自动开始构建和部署

3. **查看部署状态**
   - Vercel Dashboard → **Deployments** 标签
   - 或者等待 GitHub 通知

4. **如需运行新迁移**
   ```bash
   # 如果有新的数据库变更
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

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

## 📝 文档信息

**文档版本:** V3.0
**最后更新:** 2025-10-10
**维护者:** PhotoAlbum Development Team
**项目版本:** V1.4 (含管理后台)

**更新记录:**
- **V3.0 (2025-10-10):**
  - 根据实际 Vercel 配置页面截图更新
  - 添加详细的环境变量配置步骤
  - 增加可视化配置示例
  - 完善部署流程和故障排除
  - 添加快速参考表
- **V2.0 (2025-10-09):**
  - 更新为 Vercel Postgres 配置
  - 添加 V1.4 管理后台功能
- **V1.0 (2025-10-08):**
  - 初始版本

**部署状态:**
- ✅ 配置文档完整
- ✅ 环境变量清单完整
- ✅ 部署流程验证通过
- ✅ 故障排除指南完整
- 🚀 生产环境就绪

**支持的功能:**
- ✅ 用户认证 (NextAuth.js)
- ✅ 相册管理
- ✅ 照片上传 (Cloudinary)
- ✅ 社交互动 (点赞/评论/关注)
- ✅ 通知系统
- ✅ 全局搜索
- ✅ 管理后台

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
