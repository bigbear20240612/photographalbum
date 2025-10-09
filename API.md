# API 文档

## 概述

本文档描述了摄影作品展示平台的所有API端点。所有API均基于RESTful设计，使用JSON格式进行数据交换。

**Base URL**: `http://localhost:3001/api` (开发环境)

**认证方式**: NextAuth.js Session (Cookie-based)

---

## 认证相关API

### 1. 用户注册

**端点**: `POST /api/auth/register`

**描述**: 创建新用户账户

**请求体**:
```json
{
  "email": "user@example.com",
  "username": "john_photographer",
  "password": "password123",
  "displayName": "John Doe" // 可选
}
```

**成功响应** (201):
```json
{
  "message": "注册成功",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "username": "john_photographer",
    "displayName": "John Doe",
    "avatarUrl": null,
    "createdAt": "2025-10-09T00:00:00.000Z"
  }
}
```

**错误响应**:
- `400`: 参数验证失败
- `409`: 邮箱或用户名已被使用
- `500`: 服务器错误

---

### 2. 用户登录

**端点**: `POST /api/auth/signin`

**描述**: 使用NextAuth提供的登录端点

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### 3. 用户登出

**端点**: `POST /api/auth/signout`

**描述**: 登出当前用户

---

## 用户相关API

### 4. 获取当前用户信息

**端点**: `GET /api/users/me`

**描述**: 获取当前登录用户的完整信息

**认证**: 必需

**成功响应** (200):
```json
{
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "username": "john_photographer",
    "displayName": "John Doe",
    "avatarUrl": "https://...",
    "bio": "摄影师简介",
    "location": "北京",
    "websiteUrl": "https://...",
    "instagramUrl": "https://...",
    "weiboUrl": "https://...",
    "photographyTags": ["人像摄影", "风光摄影"],
    "emailVerified": false,
    "status": "ACTIVE",
    "createdAt": "2025-10-09T00:00:00.000Z",
    "updatedAt": "2025-10-09T00:00:00.000Z",
    "_count": {
      "albums": 5,
      "photos": 120
    }
  }
}
```

---

### 5. 更新用户信息

**端点**: `PUT /api/users/me`

**描述**: 更新当前用户的个人资料

**认证**: 必需

**请求体**:
```json
{
  "displayName": "John Photographer",
  "bio": "专业人像摄影师",
  "location": "上海",
  "websiteUrl": "https://johnphoto.com",
  "instagramUrl": "https://instagram.com/john",
  "weiboUrl": "https://weibo.com/john",
  "photographyTags": ["人像摄影", "风光摄影", "街拍摄影"]
}
```

---

### 6. 获取用户公开信息

**端点**: `GET /api/users/[username]`

**描述**: 根据用户名获取用户公开资料

**URL参数**:
- `username`: 用户名

**成功响应** (200):
```json
{
  "user": {
    "id": "clxxx...",
    "username": "john_photographer",
    "displayName": "John Doe",
    "avatarUrl": "https://...",
    "bio": "摄影师简介",
    "location": "北京",
    "websiteUrl": "https://...",
    "instagramUrl": "https://...",
    "weiboUrl": "https://...",
    "photographyTags": ["人像摄影", "风光摄影"],
    "createdAt": "2025-10-09T00:00:00.000Z",
    "_count": {
      "albums": 5,
      "photos": 120
    }
  }
}
```

---

## 专辑相关API

### 7. 获取专辑列表

**端点**: `GET /api/albums`

**描述**: 获取专辑列表，支持分页和筛选

**查询参数**:
- `username` (可选): 按用户名筛选
- `status` (可选): 按状态筛选 (DRAFT | PUBLISHED)
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认12

**示例**: `/api/albums?username=john_photographer&status=PUBLISHED&page=1&limit=12`

**成功响应** (200):
```json
{
  "albums": [
    {
      "id": "clxxx...",
      "userId": "clxxx...",
      "title": "北京街拍",
      "description": "2025年春季北京街拍作品集",
      "coverPhotoId": "clxxx...",
      "shootDate": null,
      "shootDateRangeStart": "2025-03-01",
      "shootDateRangeEnd": "2025-03-31",
      "categoryTags": ["街拍摄影"],
      "photoCount": 24,
      "sortOrder": 0,
      "status": "PUBLISHED",
      "createdAt": "2025-10-09T00:00:00.000Z",
      "updatedAt": "2025-10-09T00:00:00.000Z",
      "user": {
        "id": "clxxx...",
        "username": "john_photographer",
        "displayName": "John Doe",
        "avatarUrl": "https://..."
      },
      "coverPhoto": {
        "thumbnailUrl": "https://...",
        "mediumUrl": "https://..."
      },
      "_count": {
        "photos": 24
      }
    }
  ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4
  }
}
```

---

### 8. 创建专辑

**端点**: `POST /api/albums`

**描述**: 创建新专辑

**认证**: 必需

**请求体**:
```json
{
  "title": "北京街拍",
  "description": "2025年春季北京街拍作品集",
  "categoryTags": ["街拍摄影"],
  "shootDateRangeStart": "2025-03-01",
  "shootDateRangeEnd": "2025-03-31",
  "status": "DRAFT"
}
```

**成功响应** (201):
```json
{
  "message": "创建成功",
  "album": { /* 专辑对象 */ }
}
```

---

### 9. 获取专辑详情

**端点**: `GET /api/albums/[id]`

**描述**: 获取指定专辑的详细信息，包含所有照片

**URL参数**:
- `id`: 专辑ID

**成功响应** (200):
```json
{
  "album": {
    "id": "clxxx...",
    "title": "北京街拍",
    "description": "...",
    "user": { /* 用户信息 */ },
    "photos": [
      {
        "id": "clxxx...",
        "title": "午后的街道",
        "description": "...",
        "thumbnailUrl": "https://...",
        "mediumUrl": "https://...",
        "largeUrl": "https://...",
        "originalUrl": "https://...",
        "width": 4000,
        "height": 3000,
        "cameraModel": "Canon EOS R5",
        "lensModel": "RF 50mm f/1.2L",
        "iso": 400,
        "aperture": "f/1.8",
        "shutterSpeed": "1/500",
        "focalLength": "50mm",
        "shootDate": "2025-03-15T14:30:00.000Z",
        "location": "北京三里屯",
        "createdAt": "2025-10-09T00:00:00.000Z"
      }
    ],
    "_count": {
      "photos": 24
    }
  }
}
```

---

### 10. 更新专辑

**端点**: `PUT /api/albums/[id]`

**描述**: 更新专辑信息

**认证**: 必需

**权限**: 仅专辑所有者

**请求体**:
```json
{
  "title": "新标题",
  "description": "新描述",
  "categoryTags": ["人像摄影"],
  "status": "PUBLISHED",
  "coverPhotoId": "clxxx..."
}
```

---

### 11. 删除专辑

**端点**: `DELETE /api/albums/[id]`

**描述**: 删除专辑（会级联删除所有照片）

**认证**: 必需

**权限**: 仅专辑所有者

**成功响应** (200):
```json
{
  "message": "删除成功"
}
```

---

## 照片相关API

### 12. 上传照片

**端点**: `POST /api/photos/upload`

**描述**: 批量上传照片到指定专辑

**认证**: 必需

**Content-Type**: `multipart/form-data`

**表单字段**:
- `albumId`: 专辑ID (string)
- `files`: 照片文件数组 (File[])
- `metadata_0`, `metadata_1`, ... : 每张照片的元数据 (JSON string)

**元数据格式**:
```json
{
  "title": "照片标题",
  "description": "照片描述",
  "cameraModel": "Canon EOS R5",
  "lensModel": "RF 50mm f/1.2L",
  "iso": "400",
  "aperture": "f/1.8",
  "shutterSpeed": "1/500",
  "focalLength": "50mm",
  "shootDate": "2025-03-15T14:30:00.000Z",
  "location": "北京",
  "categoryTag": "街拍摄影"
}
```

**成功响应** (201):
```json
{
  "message": "成功上传 5 张照片",
  "results": [
    {
      "success": true,
      "photo": { /* 照片对象 */ }
    }
  ]
}
```

---

### 13. 获取照片详情

**端点**: `GET /api/photos/[id]`

**描述**: 获取照片详细信息

**URL参数**:
- `id`: 照片ID

**成功响应** (200):
```json
{
  "photo": {
    "id": "clxxx...",
    "title": "午后的街道",
    "description": "...",
    "originalUrl": "https://...",
    "largeUrl": "https://...",
    "mediumUrl": "https://...",
    "thumbnailUrl": "https://...",
    "width": 4000,
    "height": 3000,
    "fileSize": 5242880,
    "mimeType": "image/jpeg",
    "exifData": { /* EXIF数据 */ },
    "cameraModel": "Canon EOS R5",
    "lensModel": "RF 50mm f/1.2L",
    "iso": 400,
    "aperture": "f/1.8",
    "shutterSpeed": "1/500",
    "focalLength": "50mm",
    "shootDate": "2025-03-15T14:30:00.000Z",
    "location": "北京三里屯",
    "categoryTag": "街拍摄影",
    "sortOrder": 0,
    "createdAt": "2025-10-09T00:00:00.000Z",
    "user": { /* 用户信息 */ },
    "album": { /* 专辑信息 */ }
  }
}
```

---

### 14. 更新照片信息

**端点**: `PUT /api/photos/[id]`

**描述**: 更新照片的元数据信息

**认证**: 必需

**权限**: 仅照片所有者

**请求体**:
```json
{
  "title": "新标题",
  "description": "新描述",
  "cameraModel": "Canon EOS R5",
  "lensModel": "RF 50mm f/1.2L",
  "iso": 400,
  "aperture": "f/1.8",
  "shutterSpeed": "1/500",
  "focalLength": "50mm",
  "shootDate": "2025-03-15T14:30:00.000Z",
  "location": "北京",
  "categoryTag": "街拍摄影",
  "sortOrder": 1
}
```

---

### 15. 删除照片

**端点**: `DELETE /api/photos/[id]`

**描述**: 删除照片

**认证**: 必需

**权限**: 仅照片所有者

**成功响应** (200):
```json
{
  "message": "删除成功"
}
```

---

## 分类相关API

### 16. 获取所有分类

**端点**: `GET /api/categories`

**描述**: 获取所有摄影分类

**成功响应** (200):
```json
{
  "categories": [
    {
      "id": 1,
      "nameZh": "人像摄影",
      "nameEn": "Portrait",
      "slug": "portrait",
      "icon": "user",
      "sortOrder": 1
    },
    {
      "id": 2,
      "nameZh": "风光摄影",
      "nameEn": "Landscape",
      "slug": "landscape",
      "icon": "mountain",
      "sortOrder": 2
    }
  ]
}
```

---

## 错误响应格式

所有API错误都遵循统一格式：

```json
{
  "error": "错误信息描述"
}
```

**常见HTTP状态码**:
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `409`: 资源冲突（如用户名已存在）
- `500`: 服务器内部错误

---

## 认证说明

大部分API需要用户登录才能访问。认证通过NextAuth.js的Session机制实现：

1. 用户通过 `/api/auth/register` 注册账户
2. 用户通过 `/api/auth/signin` 登录，获得Session Cookie
3. 后续请求自动携带Cookie进行认证
4. 前端可以使用 `useSession()` Hook获取当前用户信息

**公开API（无需认证）**:
- `GET /api/albums` (仅显示已发布专辑)
- `GET /api/albums/[id]`
- `GET /api/photos/[id]`
- `GET /api/users/[username]`
- `GET /api/categories`
- `POST /api/auth/register`

---

## 使用示例

### JavaScript/TypeScript

```typescript
// 注册用户
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'john_photographer',
    password: 'password123',
    displayName: 'John Doe',
  }),
});

const data = await response.json();

// 获取专辑列表
const albumsResponse = await fetch('/api/albums?username=john_photographer&page=1');
const albumsData = await albumsResponse.json();

// 上传照片
const formData = new FormData();
formData.append('albumId', 'album-id');
formData.append('files', file1);
formData.append('files', file2);
formData.append('metadata_0', JSON.stringify({ title: 'Photo 1' }));
formData.append('metadata_1', JSON.stringify({ title: 'Photo 2' }));

const uploadResponse = await fetch('/api/photos/upload', {
  method: 'POST',
  body: formData,
});
```

---

## 注意事项

1. **图片上传**: 需要配置Cloudinary环境变量才能使用上传功能
2. **数据库**: 需要配置PostgreSQL数据库并运行Prisma迁移
3. **环境变量**: 参考 `.env.example` 配置所有必需的环境变量
4. **速率限制**: 生产环境建议添加速率限制中间件
5. **CORS**: 如果前后端分离部署，需要配置CORS

---

## 更新日志

- **2025-10-09**: API v1.0 完成
  - 完整的用户认证系统
  - 专辑CRUD操作
  - 照片批量上传
  - 分类查询
