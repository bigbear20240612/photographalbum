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

### 必需的环境变量

| Key | Value | Environments |
|-----|-------|--------------|
| `DATABASE_URL` | `${POSTGRES_PRISMA_URL}` | ✅ Production, ✅ Preview |
| `DIRECT_URL` | `${POSTGRES_URL_NON_POOLING}` | ✅ Production, ✅ Preview |
| `NEXTAUTH_SECRET` | `Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=` | ✅ Production, ✅ Preview |
| `NEXTAUTH_URL` | `https://photographalbum.vercel.app` | ✅ Production only |
| `CLOUDINARY_CLOUD_NAME` | `dmolmq6dr` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_KEY` | `639768862499573` | ✅ Production, ✅ Preview |
| `CLOUDINARY_API_SECRET` | `jc1rYAQcZkt1ndtWrAdZyUgdzy8` | ✅ Production, ✅ Preview |

### Preview 环境的 NEXTAUTH_URL

对于 Preview 部署，建议添加：
- Key: `NEXTAUTH_URL`
- Value: 留空或设置为 `https://${VERCEL_URL}`
- Environments: ✅ Preview only

## 📝 修复步骤

### 步骤 1: 修复 NEXTAUTH_SECRET

1. 进入 Vercel 项目设置: https://vercel.com/[你的用户名]/photographalbum/settings/environment-variables
2. 找到 `NEXTAUTH_SECRET` 变量
3. 点击 "Edit" (编辑)
4. 将 Value 改为: `Dl20scUf5VpRDBmxlqEPtlqv/+iJd8U5E+65qLqKf6I=`（不要包含 NEXTAUTH_SECRET= 前缀）
5. 点击 "Save"

### 步骤 2: 重新部署

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

### 步骤 3: 检查部署日志

1. 等待部署完成
2. 查看构建日志，确认以下内容：
   - ✅ Prisma 迁移成功执行
   - ✅ Prisma Client 生成成功
   - ✅ Next.js 构建成功

3. 查看运行时日志：
   - 进入 Vercel Dashboard
   - 点击 "Logs" 或 "Runtime Logs"
   - 检查是否有数据库连接错误或其他错误

### 步骤 4: 测试注册功能

1. 访问 https://photographalbum.vercel.app/register
2. 尝试注册新用户
3. 如果仍然失败，查看浏览器控制台的网络请求
4. 查看 Vercel 运行时日志获取详细错误信息

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
