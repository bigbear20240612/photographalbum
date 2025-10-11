# 测试专辑创建功能

## ✅ 已修复的问题

1. **环境变量配置**：`.env.local` 已更新为连接到 Vercel Postgres 生产数据库
2. **前端连接**：所有仪表板页面已连接到真实后端 API
3. **数据库连接**：本地开发环境现在使用 Prisma Accelerate 连接到生产数据库

## 🧪 测试步骤

### 1. 启动本地开发服务器

```bash
cd D:\data\CLAUDE_USE\Vercel\photographalbum
npm run dev
```

服务器将在 `http://localhost:3000` 启动

### 2. 注册新用户（如果还没有账号）

1. 访问：http://localhost:3000/register
2. 填写注册表单：
   - 邮箱：例如 `test@example.com`
   - 用户名：例如 `testuser`
   - 显示名称：例如 `测试用户`
   - 密码：至少 6 位
3. 点击"注册"按钮
4. 如果成功，会看到成功提示并自动跳转到登录页

### 3. 登录

1. 访问：http://localhost:3000/login
2. 输入刚才注册的邮箱和密码
3. 点击"登录"按钮
4. 登录成功后会跳转到首页

### 4. 访问仪表板

1. 点击页面右上角的用户头像或用户名
2. 选择"工作台"菜单项
3. 或直接访问：http://localhost:3000/dashboard

### 5. 创建专辑

1. 在仪表板页面，点击"创建专辑"按钮
2. 填写专辑信息：
   - **专辑标题**：例如"云南旅拍"
   - **专辑描述**：例如"2024年春季云南旅行拍摄的风光作品"
   - **专辑分类**：选择一个分类，例如"风光摄影"
3. 点击"创建专辑"按钮

### 6. 预期结果

**✅ 成功的情况：**
- 看到绿色的成功提示："专辑创建成功！"
- 自动跳转到照片上传页面：`/dashboard/albums/{album-id}/upload`
- 可以在这个页面上传照片

**❌ 失败的情况：**
- 看到红色的错误提示
- 打开浏览器开发者工具 (F12) → Console 标签查看错误信息
- 打开 Network 标签查看 API 请求详情

### 7. 验证数据库

专辑创建成功后，可以在仪表板看到新创建的专辑卡片。

也可以使用 Prisma Studio 查看数据库：

```bash
npx prisma studio
```

访问 http://localhost:5555，查看 `Album` 表，应该能看到新创建的专辑记录。

## 🔍 调试技巧

### 查看浏览器控制台

1. 按 F12 打开开发者工具
2. 切换到 **Console** 标签查看 JavaScript 错误
3. 切换到 **Network** 标签查看 API 请求：
   - 找到 `/api/albums` 的 POST 请求
   - 点击查看请求详情
   - 查看 **Payload**（发送的数据）
   - 查看 **Response**（返回的数据）

### 查看服务器日志

在运行 `npm run dev` 的终端窗口中查看服务器日志：
- 查看是否有错误信息
- 查看 `console.log` 输出

### 常见问题

#### 1. 401 Unauthorized 错误

**原因**：用户未登录或 session 过期

**解决**：
- 重新登录
- 检查浏览器 Cookie 中是否有 `next-auth.session-token`

#### 2. 500 Internal Server Error

**原因**：后端服务器错误

**解决**：
- 查看服务器终端的错误日志
- 检查数据库连接是否正常
- 确认 `.env.local` 中的 `DATABASE_URL` 配置正确

#### 3. 网络请求失败

**原因**：无法连接到后端 API

**解决**：
- 确认开发服务器正在运行（http://localhost:3000）
- 检查浏览器控制台的 Network 错误
- 尝试刷新页面

## 📊 API 请求详情

### 创建专辑 API

**请求**：
```
POST /api/albums
Content-Type: application/json

{
  "title": "云南旅拍",
  "description": "2024年春季云南旅行拍摄的风光作品",
  "categoryTags": ["风光摄影"],
  "status": "PUBLISHED"
}
```

**成功响应**（201 Created）：
```json
{
  "message": "创建成功",
  "album": {
    "id": "cm2...",
    "userId": "cm2...",
    "title": "云南旅拍",
    "description": "2024年春季云南旅行拍摄的风光作品",
    "categoryTags": ["风光摄影"],
    "status": "PUBLISHED",
    "coverPhotoId": null,
    "sortOrder": 0,
    "createdAt": "2025-10-11T...",
    "updatedAt": "2025-10-11T...",
    "user": {
      "id": "cm2...",
      "username": "testuser",
      "displayName": "测试用户",
      "avatarUrl": null
    }
  }
}
```

**失败响应**（401 Unauthorized）：
```json
{
  "error": "未登录"
}
```

**失败响应**（400 Bad Request）：
```json
{
  "error": "专辑标题不能为空"
}
```

## 🚀 完整工作流程测试

测试完整的专辑创建和照片上传流程：

1. ✅ 注册用户
2. ✅ 登录
3. ✅ 访问仪表板
4. ✅ 创建专辑
5. ✅ 上传照片到专辑
6. ✅ 在仪表板查看创建的专辑
7. ✅ 编辑专辑信息
8. ✅ 查看专辑详情页

## 💡 提示

- 本地开发环境现在连接到**生产数据库**，创建的数据会真实保存
- 如果需要隔离的开发环境，可以考虑创建单独的测试数据库
- Cloudinary 照片上传功能已配置，上传的照片会保存到你的 Cloudinary 账户

## 📝 测试记录

测试日期：2025-10-11

| 功能 | 状态 | 备注 |
|------|------|------|
| 用户注册 | ⏳ 待测试 | |
| 用户登录 | ⏳ 待测试 | |
| 创建专辑 | ⏳ 待测试 | |
| 编辑专辑 | ⏳ 待测试 | |
| 删除专辑 | ⏳ 待测试 | |
| 上传照片 | ⏳ 待测试 | |

---

**如果遇到任何问题，请提供：**
1. 浏览器控制台的完整错误信息
2. Network 标签中失败请求的详细信息
3. 服务器终端的错误日志
