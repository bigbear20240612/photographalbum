# Vercel 配置说明 - PhotoAlbum 项目

## 项目架构

PhotoAlbum 是一个 **Next.js 14 全栈应用**,采用现代化的单一仓库架构:

```
┌─────────────────────────────────────────┐
│         PhotoAlbum 项目结构              │
├─────────────────────────────────────────┤
│                                          │
│  前端 (Frontend)                         │
│  ├─ src/app/              页面路由       │
│  ├─ src/components/       React 组件     │
│  └─ public/               静态资源       │
│                                          │
│  后端 (Backend)                          │
│  ├─ src/app/api/          API 路由       │
│  ├─ src/lib/              工具函数       │
│  └─ prisma/               数据库 ORM     │
│                                          │
│  数据库 (Database)                       │
│  └─ Vercel Postgres       云端数据库     │
│                                          │
└─────────────────────────────────────────┘
```

## ✅ 前后端已集成

### 为什么不需要分离配置?

在 Next.js 14 中:

1. **前端和后端在同一个项目中**
   - 前端: React 组件 + 页面路由
   - 后端: API Routes (Serverless Functions)

2. **统一的部署流程**
   - 一次部署,前后端同时上线
   - 共享环境变量
   - 统一的域名和 HTTPS

3. **自动路由处理**
   - `/` → 前端页面
   - `/api/*` → 后端 API
   - Vercel 自动识别和路由

## 📁 vercel.json 配置详解

### 基本配置

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 区域配置

```json
{
  "regions": ["sin1"]
}
```

**可用区域:**
- `sin1` - 新加坡 (亚太推荐)
- `hnd1` - 东京
- `iad1` - 华盛顿特区 (美东)
- `sfo1` - 旧金山 (美西)
- `lhr1` - 伦敦 (欧洲)

### Serverless Functions 配置

```json
{
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    },
    "api/photos/upload.ts": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

**说明:**
- 大部分 API: 1GB 内存, 10 秒超时
- 照片上传 API: 3GB 内存, 60 秒超时 (处理大文件)

### 安全头部配置

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

**安全头部说明:**
- `X-Content-Type-Options: nosniff` - 防止 MIME 类型嗅探
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-XSS-Protection: 1; mode=block` - 启用 XSS 过滤
- `Referrer-Policy` - 控制 Referrer 信息
- `Permissions-Policy` - 限制浏览器功能访问

### CORS 配置 (如果需要)

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

> ⚠️ 生产环境建议将 `*` 改为具体的域名

## 🚀 部署流程

### 自动部署

```
Git Push → Vercel 检测 → 自动构建 → 自动部署
```

**触发条件:**
- `main` 分支推送 → 生产环境
- 其他分支推送 → 预览环境
- Pull Request → 预览部署

### 部署过程

```bash
# 1. 安装依赖
npm install

# 2. 生成 Prisma Client
npx prisma generate

# 3. 构建 Next.js
npm run build

# 4. 部署到 Vercel Edge Network
# 前端: 静态资源 → CDN
# 后端: API Routes → Serverless Functions
```

## 📊 路由和请求流程

### 前端页面请求

```
用户访问: https://your-domain.vercel.app/discover

1. 请求到达 Vercel Edge Network
2. 返回预渲染的 HTML (如果有)
3. 加载 React 组件
4. 客户端水合 (Hydration)
5. 页面交互就绪
```

### 后端 API 请求

```
客户端调用: fetch('/api/albums')

1. 请求到达 Vercel Edge Network
2. 路由到对应的 Serverless Function
3. Function 执行:
   - 连接数据库 (Vercel Postgres)
   - 处理业务逻辑
   - 返回 JSON 数据
4. 响应返回客户端
```

### 完整的数据流

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│ Browser │─────>│   Vercel    │─────>│   Next.js    │
│         │      │Edge Network │      │  Serverless  │
└─────────┘      └─────────────┘      └──────────────┘
                                              │
                                              ↓
                                       ┌──────────────┐
                                       │   Postgres   │
                                       │   Database   │
                                       └──────────────┘
```

## 🔧 环境变量管理

### 在 Vercel Dashboard 配置

所有环境变量在 Vercel Dashboard 统一管理,自动注入到:
- ✅ 前端构建时
- ✅ 后端 API 运行时

### 环境变量作用域

```
Production Environment
├─ DATABASE_URL
├─ NEXTAUTH_SECRET
└─ CLOUDINARY_*

Preview Environment
├─ 继承 Production 变量
└─ 可覆盖特定变量

Development Environment
└─ 本地 .env 文件
```

## 📁 项目文件结构

```
photographalbum/
├─ src/
│  ├─ app/                    # Next.js App Router
│  │  ├─ (routes)/           # 前端页面路由
│  │  ├─ api/                # 后端 API 路由
│  │  ├─ layout.tsx          # 根布局
│  │  └─ page.tsx            # 首页
│  ├─ components/            # React 组件
│  ├─ lib/                   # 工具函数
│  └─ types/                 # TypeScript 类型
├─ prisma/
│  ├─ schema.prisma          # 数据库模型
│  └─ migrations/            # 数据库迁移
├─ public/                   # 静态资源
├─ next.config.js            # Next.js 配置
├─ vercel.json              # Vercel 配置
├─ package.json             # 依赖管理
└─ tsconfig.json            # TypeScript 配置
```

## 🎯 API 路由示例

### 目录结构

```
src/app/api/
├─ auth/                     # 认证相关
│  └─ [...nextauth]/
│     └─ route.ts            # NextAuth API
├─ albums/                   # 专辑管理
│  ├─ route.ts              # GET /api/albums, POST /api/albums
│  └─ [id]/
│     └─ route.ts           # GET/PUT/DELETE /api/albums/:id
├─ photos/                   # 照片管理
│  ├─ upload.ts             # POST /api/photos/upload
│  └─ [id]/
│     └─ route.ts           # GET/PUT/DELETE /api/photos/:id
└─ admin/                    # 管理员 API
   ├─ users/
   │  └─ route.ts           # GET /api/admin/users
   └─ stats/
      └─ route.ts           # GET /api/admin/stats
```

### API Route 示例

```typescript
// src/app/api/albums/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/albums
export async function GET(request: NextRequest) {
  const albums = await prisma.album.findMany({
    where: { status: 'PUBLISHED' },
    include: { user: true },
  });

  return NextResponse.json({ albums });
}

// POST /api/albums
export async function POST(request: NextRequest) {
  const body = await request.json();
  const album = await prisma.album.create({
    data: body,
  });

  return NextResponse.json({ album }, { status: 201 });
}
```

## 🔄 前后端通信

### 客户端调用 API

```typescript
// 前端组件
'use client';

export default function AlbumList() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // 调用同域名下的 API
    fetch('/api/albums')
      .then(res => res.json())
      .then(data => setAlbums(data.albums));
  }, []);

  return (
    <div>
      {albums.map(album => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
```

### 使用 API 服务层

```typescript
// src/lib/apiService.ts
export const albumApi = {
  getAlbums: () => fetch('/api/albums').then(r => r.json()),
  createAlbum: (data) => fetch('/api/albums', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json()),
};

// 组件中使用
const albums = await albumApi.getAlbums();
```

## 🚀 性能优化

### 1. 静态生成 (SSG)

```typescript
// 前端页面
export default async function HomePage() {
  const albums = await prisma.album.findMany();
  return <AlbumGrid albums={albums} />;
}
```

**优势:**
- 构建时生成 HTML
- CDN 边缘缓存
- 极快的首屏加载

### 2. 服务端渲染 (SSR)

```typescript
// 动态页面
export const dynamic = 'force-dynamic';

export default async function AlbumPage({ params }) {
  const album = await prisma.album.findUnique({
    where: { id: params.id },
  });
  return <AlbumDetail album={album} />;
}
```

### 3. API 响应缓存

```typescript
// API Route
export async function GET() {
  const albums = await prisma.album.findMany();

  return NextResponse.json(
    { albums },
    {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    }
  );
}
```

### 4. Edge Runtime (可选)

```typescript
export const runtime = 'edge';

export async function GET() {
  // 在 Edge 运行,更低延迟
}
```

## 🔒 安全最佳实践

### 1. 环境变量保护

```typescript
// ✅ 正确: 仅在服务端使用
const secret = process.env.NEXTAUTH_SECRET;

// ❌ 错误: 不要在客户端使用敏感信息
// 客户端使用必须加 NEXT_PUBLIC_ 前缀
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

### 2. API 权限验证

```typescript
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  // 验证用户登录
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  // 执行操作
}
```

### 3. 输入验证

```typescript
import { z } from 'zod';

const createAlbumSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  // 验证输入
  const result = createAlbumSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors },
      { status: 400 }
    );
  }

  // 继续处理
}
```

## 📊 监控和调试

### 查看实时日志

```bash
# 使用 Vercel CLI
vercel logs --follow

# 过滤特定函数
vercel logs --follow api/albums
```

### 在 Dashboard 查看

1. Vercel Dashboard → 项目
2. **Functions** 标签 → 选择具体的 API
3. 查看调用次数、延迟、错误

### 性能监控

- **Analytics** - 页面访问统计
- **Speed Insights** - Core Web Vitals
- **Error Tracking** - 错误日志

## ❓ 常见问题

### Q1: 为什么不需要单独的后端服务器?

**A:** Next.js API Routes 就是后端! 它们是 Serverless Functions,自动扩展,无需管理服务器。

### Q2: 如何调用后端 API?

**A:** 直接使用相对路径 `/api/xxx`,因为前后端在同一域名下。

### Q3: 数据库连接如何管理?

**A:** Prisma 自动管理连接池,Vercel Postgres 提供优化的连接。

### Q4: 如何处理大文件上传?

**A:**
- 使用 Cloudinary 等第三方服务
- 或配置更大的 Function 内存和超时
- `vercel.json` 中已配置上传 API 为 60 秒超时

### Q5: 前端可以直接访问数据库吗?

**A:**
- ❌ **不能**! 数据库只能在服务端访问
- ✅ 前端通过 API Routes 间接访问

## 📚 参考资源

- **Next.js 文档**: https://nextjs.org/docs
- **Vercel 文档**: https://vercel.com/docs
- **API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Serverless Functions**: https://vercel.com/docs/functions

---

## 🎯 总结

PhotoAlbum 项目采用 **Next.js 全栈架构**:

✅ **优势:**
- 单一仓库,代码管理简单
- 统一部署,一次上线
- 类型安全,TypeScript 全覆盖
- 自动扩展,无需运维
- 边缘优化,全球加速

✅ **特点:**
- 前端: React Server Components + Client Components
- 后端: API Routes (Serverless Functions)
- 数据库: Vercel Postgres (连接池)
- 部署: Vercel (自动化 CI/CD)

✅ **配置:**
- `next.config.js` - Next.js 配置
- `vercel.json` - Vercel 优化配置
- 环境变量 - Vercel Dashboard 统一管理

**不需要分离的前后端配置,一切都已集成! 🚀**

---

**文档版本:** V1.0
**更新时间:** 2025-10-09
