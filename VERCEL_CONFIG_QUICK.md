# Vercel 配置快速参考

**项目:** PhotoAlbum V1.4
**仓库:** https://github.com/bigbear20240612/photographalbum.git
**详细文档:** [docs/VERCEL_DEPLOYMENT_CONFIG.md](docs/VERCEL_DEPLOYMENT_CONFIG.md)

---

## 📸 配置页面对照表

### 基本设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Vercel Team** | big_bear's projects | 你的团队 |
| **Project Name** | `photographalbum` | 项目名称 |
| **Framework Preset** | Next.js | 自动检测 |
| **Root Directory** | `./` | ✅ 保持默认 |

### 构建设置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **Build Command** | `npm run build` | ✅ 保持默认 |
| **Output Directory** | Next.js default | ✅ 保持默认 |
| **Install Command** | `npm install` | ✅ 保持默认 |

---

## 🔐 环境变量配置

### 必需的 7 个变量

```bash
# 1. 数据库连接 (连接池)
DATABASE_URL=${POSTGRES_PRISMA_URL}
# Environment: ✅ Production  ✅ Preview

# 2. 数据库连接 (直连,用于迁移)
DIRECT_URL=${POSTGRES_URL_NON_POOLING}
# Environment: ✅ Production  ✅ Preview

# 3. 认证密钥 (生成方法见下方)
NEXTAUTH_SECRET=your-generated-32-byte-secret
# Environment: ✅ Production  ✅ Preview

# 4. 应用URL
NEXTAUTH_URL=https://photographalbum.vercel.app
# Environment: ✅ Production  ⬜ Preview

# 5. Cloudinary 云存储名称
CLOUDINARY_CLOUD_NAME=your-cloud-name
# Environment: ✅ Production  ✅ Preview

# 6. Cloudinary API密钥
CLOUDINARY_API_KEY=123456789012345
# Environment: ✅ Production  ✅ Preview

# 7. Cloudinary API密钥
CLOUDINARY_API_SECRET=your-api-secret
# Environment: ✅ Production  ✅ Preview
```

### 🔑 生成 NEXTAUTH_SECRET

```bash
# Windows/Mac/Linux
openssl rand -base64 32

# 或访问在线生成器
https://generate-secret.vercel.app/32
```

### 📸 获取 Cloudinary 凭据

1. 访问: https://cloudinary.com/console
2. Dashboard → Account Details
3. 复制:
   - Cloud Name
   - API Key
   - API Secret (点击"眼睛"图标显示)

---

## 🗄️ 数据库配置

### 创建 Vercel Postgres

⚠️ **必须在配置环境变量之前创建!**

1. Vercel Dashboard → 项目 → **Storage**
2. **Create Database** → **Postgres**
3. 选择区域: **Singapore (ap-southeast-1)** 推荐
4. 点击 **Create**

数据库创建后,Vercel 会自动注入以下变量:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

这些变量在环境变量中通过 `${POSTGRES_PRISMA_URL}` 引用。

---

## 🚀 部署流程

### 1. 点击 Deploy

确认所有配置后,点击页面底部的 **Deploy** 按钮。

### 2. 运行数据库迁移

部署成功后,在本地终端运行:

```bash
# 安装 Vercel CLI (首次)
npm install -g vercel

# 登录
vercel login

# 链接项目
cd D:\data\CLAUDE_USE\Vercel\photographalbum
vercel link

# 拉取环境变量
vercel env pull .env.production

# 运行迁移
npx prisma migrate deploy

# (可选) 导入测试数据
npx prisma db seed
```

### 3. 验证部署

访问: `https://photographalbum.vercel.app`

**测试账户:**
- Email: `john@example.com`
- Password: `password123`
- Role: ADMIN

---

## ✅ 配置检查清单

### 部署前

- [ ] GitHub 仓库已同步
- [ ] Vercel Postgres 数据库已创建
- [ ] 7 个环境变量已配置
- [ ] 所有配置项保持默认值

### 部署后

- [ ] 构建成功
- [ ] 数据库迁移已运行
- [ ] 测试数据已导入
- [ ] 首页可访问
- [ ] 登录功能正常
- [ ] 管理后台可访问

---

## 🔗 相关链接

- **项目仓库:** https://github.com/bigbear20240612/photographalbum.git
- **详细文档:** [docs/VERCEL_DEPLOYMENT_CONFIG.md](docs/VERCEL_DEPLOYMENT_CONFIG.md)
- **Vercel 文档:** https://vercel.com/docs
- **Vercel Postgres:** https://vercel.com/docs/storage/vercel-postgres
- **Cloudinary:** https://cloudinary.com/console

---

## ⚠️ 常见错误

### 1. DATABASE_URL 格式错误

❌ 错误:
```
DATABASE_URL=$POSTGRES_PRISMA_URL
DATABASE_URL=POSTGRES_PRISMA_URL
```

✅ 正确:
```
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

### 2. 先部署后创建数据库

⚠️ 错误流程: 配置变量 → Deploy → 创建数据库

✅ 正确流程: 创建数据库 → 配置变量 → Deploy

### 3. NEXTAUTH_URL 环境错误

❌ 错误: 同时勾选 Production 和 Preview

✅ 正确: 只勾选 Production

### 4. 忘记运行数据库迁移

症状: 部署成功但应用无法使用

解决: 运行 `npx prisma migrate deploy`

---

**更新时间:** 2025-10-10
**文档版本:** V1.0
