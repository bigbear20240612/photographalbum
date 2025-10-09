# 摄影作品展示平台 - 技术方案文档（TECH_SPEC）

**文档版本：** V1.0
**创建日期：** 2025-10-08
**技术负责人：** 技术团队
**目标版本：** MVP V1.0

---

## 1. 技术架构设计

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端层（Next.js）                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  App Router  │  React Components  │  Tailwind CSS  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Zustand    │  React Query  │  Framer Motion       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ ↑ (HTTPS/REST API)
┌─────────────────────────────────────────────────────────────┐
│                      后端层（Next.js API Routes）              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes  │  Middleware  │  Authentication       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      数据层（PostgreSQL）                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  User  │  Album  │  Photo  │  Category              │   │
│  └─────────────────────────────────────────────────────┘   │
│  Vercel Postgres / Supabase / Neon                         │
└─────────────────────────────────────────────────────────────┘
                              ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                   云存储层（Cloudinary）                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  原图存储  │  多尺寸生成  │  CDN分发  │  图片优化   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈清单及选择理由

#### 前端技术栈

| 技术 | 版本 | 选择理由 |
|-----|------|---------|
| **Next.js** | 14.x (App Router) | • SEO友好（SSR/SSG）<br>• Vercel原生支持<br>• 完整的全栈框架<br>• 强大的路由系统 |
| **React** | 18.x | • 组件化开发<br>• 丰富的生态系统<br>• Next.js基础 |
| **TypeScript** | 5.x | • 类型安全<br>• 更好的开发体验<br>• 降低错误率 |
| **Tailwind CSS** | 3.x | • 快速开发<br>• 玻璃拟态易实现<br>• 响应式友好<br>• 按需生成 |
| **Zustand** | 4.x | • 轻量级状态管理<br>• 简单易用<br>• TypeScript支持好 |
| **React Query** | 5.x (TanStack Query) | • 服务器状态管理<br>• 自动缓存<br>• 后台刷新<br>• 乐观更新 |
| **Framer Motion** | 11.x | • 流畅的动画<br>• 声明式API<br>• 性能优秀 |

#### 后端技术栈

| 技术 | 版本 | 选择理由 |
|-----|------|---------|
| **Next.js API Routes** | 14.x | • 与前端统一<br>• 部署简单<br>• Serverless支持 |
| **NextAuth.js** | 5.x (Auth.js) | • 完整的认证解决方案<br>• JWT支持<br>• 多种登录方式 |
| **Prisma** | 5.x | • 类型安全的ORM<br>• 数据库迁移<br>• 优秀的开发体验 |
| **Zod** | 3.x | • 运行时类型验证<br>• 与TypeScript集成<br>• API数据验证 |

#### 数据库

| 技术 | 选择理由 |
|-----|---------|
| **PostgreSQL** | • 关系型数据库<br>• JSON支持（EXIF数据）<br>• 成熟稳定<br>• Vercel Postgres支持 |
| **Vercel Postgres** | • 无缝集成Vercel<br>• 自动扩展<br>• 免费额度充足 |

#### 云存储

| 技术 | 选择理由 |
|-----|---------|
| **Cloudinary** | • 专业的图片CDN<br>• 自动多尺寸生成<br>• 图片优化<br>• 免费额度25GB |

---

## 2. 前端技术方案

### 2.1 Next.js配置

#### App Router路由设计

```
app/
├── layout.tsx                 # 根布局
├── page.tsx                   # 首页
├── (auth)/                    # 认证路由组
│   ├── login/
│   │   └── page.tsx          # 登录页
│   └── register/
│       └── page.tsx          # 注册页
├── (dashboard)/              # 用户后台路由组（需要认证）
│   ├── layout.tsx            # 后台布局
│   ├── settings/
│   │   └── page.tsx          # 个人设置
│   ├── albums/
│   │   ├── page.tsx          # 专辑列表
│   │   ├── new/
│   │   │   └── page.tsx      # 创建专辑
│   │   └── [id]/
│   │       ├── page.tsx      # 专辑编辑
│   │       └── edit/
│   │           └── page.tsx  # 编辑专辑信息
│   └── photos/
│       └── [id]/
│           └── edit/
│               └── page.tsx  # 编辑照片信息
├── photographer/             # 公开展示路由
│   └── [username]/
│       ├── page.tsx          # 个人主页
│       └── album/
│           └── [albumId]/
│               └── page.tsx  # 专辑详情页
└── api/                      # API路由
    ├── auth/                 # 认证API
    ├── users/                # 用户API
    ├── albums/               # 专辑API
    ├── photos/               # 照片API
    └── upload/               # 上传API
```

#### SSR/SSG/ISR策略

```typescript
// 个人主页 - ISR（增量静态再生）
export const revalidate = 3600; // 1小时重新验证

export async function generateStaticParams() {
  // 预生成热门摄影师页面
  const photographers = await getTopPhotographers();
  return photographers.map((p) => ({
    username: p.username,
  }));
}

// 专辑详情页 - ISR
export const revalidate = 1800; // 30分钟

// 用户后台 - SSR（需要实时数据）
export const dynamic = 'force-dynamic';

// 首页 - SSG（静态生成）
export default async function HomePage() {
  // 静态内容
}
```

### 2.2 状态管理方案

#### Zustand全局状态

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// stores/useUIStore.ts
interface UIState {
  isLightboxOpen: boolean;
  currentPhotoIndex: number;
  isInfoPanelOpen: boolean;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  toggleInfoPanel: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLightboxOpen: false,
  currentPhotoIndex: 0,
  isInfoPanelOpen: false,
  openLightbox: (index) => set({ isLightboxOpen: true, currentPhotoIndex: index }),
  closeLightbox: () => set({ isLightboxOpen: false }),
  toggleInfoPanel: () => set((state) => ({ isInfoPanelOpen: !state.isInfoPanelOpen })),
}));
```

#### React Query数据管理

```typescript
// hooks/useAlbums.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAlbums(userId: string) {
  return useQuery({
    queryKey: ['albums', userId],
    queryFn: () => fetchAlbums(userId),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlbum,
    onSuccess: (data) => {
      // 乐观更新
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });
}

export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlbum,
    onMutate: async (albumId) => {
      // 乐观删除
      await queryClient.cancelQueries({ queryKey: ['albums'] });
      const previousAlbums = queryClient.getQueryData(['albums']);

      queryClient.setQueryData(['albums'], (old: Album[]) =>
        old?.filter((album) => album.id !== albumId)
      );

      return { previousAlbums };
    },
    onError: (err, albumId, context) => {
      // 回滚
      queryClient.setQueryData(['albums'], context?.previousAlbums);
    },
  });
}
```

### 2.3 样式方案（Tailwind CSS + 玻璃拟态）

#### Tailwind配置

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 非洲大地色系
        'terra-cotta': '#D4773C',
        'desert-gold': '#C9984C',
        'earth-brown': '#8B6F47',
        'savanna-green': '#7A9B76',
        'sunset-orange': '#E8956C',
        'amber-gold': '#F4A460',
        // 中性色
        'charcoal': '#2C2C2C',
        'warm-gray': '#5C5C5C',
        'light-gray': '#9C9C9C',
        'soft-white': '#FAFAF8',
        'warm-beige': '#F5F3EF',
        'border-light': '#E0DDD6',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif SC', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(139, 111, 71, 0.06)',
        'glass-md': '0 4px 16px rgba(139, 111, 71, 0.08), 0 2px 8px rgba(139, 111, 71, 0.05)',
        'glass-lg': '0 8px 32px rgba(139, 111, 71, 0.12), 0 4px 16px rgba(139, 111, 71, 0.08)',
        'brand': '0 4px 12px rgba(212, 119, 60, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
      },
    },
  },
  plugins: [],
};
```

#### 玻璃拟态组件

```typescript
// components/ui/GlassCard.tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'warm';
}

export function GlassCard({ children, className, variant = 'light' }: GlassCardProps) {
  const variants = {
    light: 'bg-soft-white/75 border-border-light/40',
    dark: 'bg-charcoal/60 border-white/10',
    warm: 'bg-warm-beige/80 border-terra-cotta/20',
  };

  return (
    <div
      className={cn(
        'backdrop-blur-xl backdrop-saturate-150',
        'rounded-2xl border',
        'shadow-glass-md',
        'transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 2.4 组件架构

```
components/
├── ui/                        # 基础UI组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── GlassCard.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── layout/                    # 布局组件
│   ├── Navbar.tsx
│   ├── MobileNav.tsx
│   └── Footer.tsx
├── auth/                      # 认证组件
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── album/                     # 专辑组件
│   ├── AlbumCard.tsx
│   ├── AlbumGrid.tsx
│   ├── CreateAlbumForm.tsx
│   └── EditAlbumForm.tsx
├── photo/                     # 照片组件
│   ├── PhotoCard.tsx
│   ├── PhotoMasonry.tsx      # 瀑布流
│   ├── Lightbox.tsx          # 大图浏览
│   ├── UploadArea.tsx
│   └── EditPhotoForm.tsx
└── user/                      # 用户组件
    ├── UserProfile.tsx
    ├── ProfileHeader.tsx
    └── EditProfileForm.tsx
```

### 2.5 图片优化方案

#### Cloudinary集成

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPhoto(file: File, albumId: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `photographalbum/album_${albumId}`,
        transformation: [
          // 生成多个尺寸
          { width: 2000, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }, // 大图
          { width: 1000, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }, // 中图
          { width: 300, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },  // 缩略图
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}

// 获取不同尺寸的URL
export function getPhotoUrl(publicId: string, size: 'original' | 'large' | 'medium' | 'thumb') {
  const transformations = {
    original: '',
    large: 'w_2000,c_limit,q_auto:good,f_auto',
    medium: 'w_1000,c_limit,q_auto:good,f_auto',
    thumb: 'w_300,c_limit,q_auto:good,f_auto',
  };

  return cloudinary.url(publicId, {
    transformation: transformations[size],
  });
}
```

#### Next.js Image组件

```typescript
// components/photo/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, priority, className }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..." // 低质量占位图
    />
  );
}
```

---

## 3. 后端技术方案

### 3.1 后端技术栈

**推荐：Next.js API Routes（Serverless）**

优势：
- 与前端统一技术栈
- Vercel无缝部署
- 自动扩展
- 开发简单

### 3.2 数据库设计（PostgreSQL + Prisma）

#### Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  username          String    @unique
  passwordHash      String
  avatarUrl         String?
  displayName       String?
  bio               String?
  location          String?
  websiteUrl        String?
  instagramUrl      String?
  weiboUrl          String?
  photographyTags   Json?     // String[]
  emailVerified     Boolean   @default(false)
  status            UserStatus @default(ACTIVE)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  albums            Album[]
  photos            Photo[]

  @@index([email, username, createdAt])
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

model Album {
  id                  String    @id @default(uuid())
  userId              String
  title               String
  description         String?
  coverPhotoId        String?
  shootDate           DateTime?
  shootDateRangeStart DateTime?
  shootDateRangeEnd   DateTime?
  categoryTags        Json?     // String[]
  photoCount          Int       @default(0)
  sortOrder           Int       @default(0)
  status              AlbumStatus @default(DRAFT)
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  photos              Photo[]
  coverPhoto          Photo?    @relation("AlbumCover", fields: [coverPhotoId], references: [id])

  @@index([userId, createdAt, sortOrder, status])
}

enum AlbumStatus {
  DRAFT
  PUBLISHED
}

model Photo {
  id              String    @id @default(uuid())
  albumId         String
  userId          String
  title           String?
  description     String?
  originalUrl     String
  largeUrl        String
  mediumUrl       String
  thumbnailUrl    String
  width           Int
  height          Int
  fileSize        Int
  mimeType        String
  exifData        Json?
  cameraModel     String?
  lensModel       String?
  iso             Int?
  aperture        String?
  shutterSpeed    String?
  focalLength     String?
  shootDate       DateTime?
  location        String?
  categoryTag     String?
  sortOrder       Int       @default(0)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  album           Album     @relation(fields: [albumId], references: [id], onDelete: Cascade)
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  albumCovers     Album[]   @relation("AlbumCover")

  @@index([albumId, userId, createdAt, sortOrder])
}

model Category {
  id          Int       @id @default(autoincrement())
  nameZh      String
  nameEn      String
  slug        String    @unique
  icon        String?
  sortOrder   Int       @default(0)
}
```

### 3.3 API接口设计（RESTful）

#### API路由结构

```
/api
├── /auth
│   ├── POST   /register          # 注册
│   ├── POST   /login             # 登录
│   ├── POST   /logout            # 登出
│   └── GET    /me                # 获取当前用户信息
├── /users
│   ├── GET    /:username         # 获取用户公开信息
│   ├── PATCH  /:id               # 更新用户信息
│   └── POST   /:id/avatar        # 上传头像
├── /albums
│   ├── GET    /                  # 获取专辑列表（带筛选）
│   ├── POST   /                  # 创建专辑
│   ├── GET    /:id               # 获取专辑详情
│   ├── PATCH  /:id               # 更新专辑信息
│   ├── DELETE /:id               # 删除专辑
│   └── PATCH  /:id/reorder       # 调整专辑顺序
├── /photos
│   ├── GET    /                  # 获取照片列表
│   ├── POST   /                  # 上传照片
│   ├── GET    /:id               # 获取照片详情
│   ├── PATCH  /:id               # 更新照片信息
│   ├── DELETE /:id               # 删除照片
│   └── PATCH  /batch/reorder     # 批量调整照片顺序
└── /upload
    └── POST   /                  # 通用上传接口
```

#### API示例

```typescript
// app/api/albums/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createAlbumSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  categoryTags: z.array(z.string()).max(3).optional(),
  shootDate: z.string().datetime().optional(),
});

// GET /api/albums?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const albums = await prisma.album.findMany({
      where: {
        userId: userId || undefined,
        status: status as AlbumStatus || 'PUBLISHED',
      },
      include: {
        coverPhoto: true,
        _count: {
          select: { photos: true },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

// POST /api/albums
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAlbumSchema.parse(body);

    const album = await prisma.album.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        sortOrder: Date.now(),
      },
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
```

### 3.4 认证方案（NextAuth.js + JWT）

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.status !== 'ACTIVE') {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 4. 云存储方案

### 4.1 Cloudinary配置

**免费额度：**
- 存储空间：25GB
- 带宽：25GB/月
- 转换次数：25,000次/月

**功能：**
- 自动图片优化
- 智能格式转换（WebP/AVIF）
- 多尺寸生成
- CDN加速
- EXIF数据提取

### 4.2 图片上传流程

```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { uploadPhoto, extractExif } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const albumId = formData.get('albumId') as string;

    if (!file || !albumId) {
      return NextResponse.json({ error: 'Missing file or albumId' }, { status: 400 });
    }

    // 验证文件类型和大小
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // 上传到Cloudinary
    const uploadResult = await uploadPhoto(file, albumId);

    // 提取EXIF
    const exifData = await extractExif(uploadResult.public_id);

    // 保存到数据库
    const photo = await prisma.photo.create({
      data: {
        albumId,
        userId: session.user.id,
        originalUrl: uploadResult.secure_url,
        largeUrl: uploadResult.eager[0].secure_url,
        mediumUrl: uploadResult.eager[1].secure_url,
        thumbnailUrl: uploadResult.eager[2].secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        fileSize: uploadResult.bytes,
        mimeType: file.type,
        exifData: exifData,
        cameraModel: exifData?.Model,
        lensModel: exifData?.LensModel,
        iso: exifData?.ISO,
        aperture: exifData?.FNumber,
        shutterSpeed: exifData?.ExposureTime,
        focalLength: exifData?.FocalLength,
        shootDate: exifData?.DateTimeOriginal,
        sortOrder: Date.now(),
      },
    });

    // 更新专辑照片计数
    await prisma.album.update({
      where: { id: albumId },
      data: {
        photoCount: { increment: 1 },
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

---

## 5. SEO优化方案

### 5.1 元信息优化

```typescript
// app/photographer/[username]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await getUser(params.username);

  return {
    title: `${user.displayName || user.username} - 摄影作品展示平台`,
    description: user.bio || `浏览 ${user.displayName} 的摄影作品集`,
    keywords: ['摄影', '作品集', user.username, ...(user.photographyTags || [])],
    authors: [{ name: user.displayName || user.username }],
    openGraph: {
      title: `${user.displayName || user.username} - 摄影作品展示平台`,
      description: user.bio,
      images: [user.avatarUrl || '/default-avatar.jpg'],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.displayName || user.username}`,
      description: user.bio,
      images: [user.avatarUrl],
    },
  };
}
```

### 5.2 结构化数据（JSON-LD）

```typescript
// components/seo/PhotographerStructuredData.tsx
export function PhotographerStructuredData({ user, albums }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.displayName || user.username,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/photographer/${user.username}`,
    image: user.avatarUrl,
    description: user.bio,
    jobTitle: 'Photographer',
    sameAs: [
      user.websiteUrl,
      user.instagramUrl,
      user.weiboUrl,
    ].filter(Boolean),
    workExample: albums.map(album => ({
      '@type': 'ImageGallery',
      name: album.title,
      description: album.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/photographer/${user.username}/album/${album.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 5.3 Sitemap生成

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://photographalbum.vercel.app';

  // 获取所有公开用户和专辑
  const users = await prisma.user.findMany({
    where: { status: 'ACTIVE' },
    select: { username: true, updatedAt: true },
  });

  const albums = await prisma.album.findMany({
    where: { status: 'PUBLISHED' },
    include: { user: true },
    select: { id: true, updatedAt: true, user: { select: { username: true } } },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...users.map(user => ({
      url: `${baseUrl}/photographer/${user.username}`,
      lastModified: user.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...albums.map(album => ({
      url: `${baseUrl}/photographer/${album.user.username}/album/${album.id}`,
      lastModified: album.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
```

---

## 6. 性能优化方案

### 6.1 代码分割与懒加载

```typescript
// 动态导入重型组件
import dynamic from 'next/dynamic';

const Lightbox = dynamic(() => import('@/components/photo/Lightbox'), {
  loading: () => <LightboxSkeleton />,
  ssr: false, // 大图浏览无需SSR
});

const UploadArea = dynamic(() => import('@/components/photo/UploadArea'), {
  loading: () => <div>Loading...</div>,
});

// 路由级别的代码分割（Next.js自动处理）
```

### 6.2 图片懒加载

```typescript
// components/photo/PhotoMasonry.tsx
'use client';

import { useEffect, useRef } from 'react';

export function PhotoMasonry({ photos }) {
  const observerRef = useRef<IntersectionObserver>();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset.src!;
            observerRef.current?.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' } // 提前200px加载
    );

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="masonry-grid">
      {photos.map(photo => (
        <img
          key={photo.id}
          data-src={photo.mediumUrl}
          alt={photo.title}
          loading="lazy"
        />
      ))}
    </div>
  );
}
```

### 6.3 玻璃拟态性能优化

```css
/* 使用will-change提示浏览器 */
.glass-card {
  backdrop-filter: blur(12px);
  will-change: backdrop-filter;
}

/* 移动端降级 */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: none;
    background: rgba(250, 250, 248, 0.98);
  }
}

/* 低性能设备降级 */
@media (prefers-reduced-motion: reduce) {
  .glass-card {
    backdrop-filter: none;
  }
}
```

---

## 7. 部署方案

### 7.1 Vercel部署配置

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["sin1", "hkg1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name",
    "CLOUDINARY_API_KEY": "@cloudinary-api-key",
    "CLOUDINARY_API_SECRET": "@cloudinary-api-secret"
  }
}
```

### 7.2 环境变量管理

```bash
# .env.example
# 数据库
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 应用
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 7.3 CI/CD流程

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
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 8. 项目目录结构

```
photographalbum/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证路由组
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # 用户后台
│   │   ├── layout.tsx
│   │   ├── settings/
│   │   ├── albums/
│   │   └── photos/
│   ├── photographer/             # 公开展示
│   │   └── [username]/
│   ├── api/                      # API路由
│   │   ├── auth/
│   │   ├── users/
│   │   ├── albums/
│   │   ├── photos/
│   │   └── upload/
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   ├── globals.css               # 全局样式
│   └── sitemap.ts                # Sitemap
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   ├── layout/                   # 布局组件
│   ├── auth/                     # 认证组件
│   ├── album/                    # 专辑组件
│   ├── photo/                    # 照片组件
│   └── user/                     # 用户组件
├── lib/                          # 工具库
│   ├── prisma.ts                 # Prisma客户端
│   ├── cloudinary.ts             # Cloudinary工具
│   ├── auth.ts                   # 认证工具
│   └── utils.ts                  # 通用工具
├── hooks/                        # 自定义Hooks
│   ├── useAlbums.ts
│   ├── usePhotos.ts
│   └── useAuth.ts
├── stores/                       # Zustand状态
│   ├── useAuthStore.ts
│   └── useUIStore.ts
├── types/                        # TypeScript类型
│   ├── index.ts
│   └── api.ts
├── prisma/                       # Prisma
│   ├── schema.prisma             # 数据库模型
│   ├── migrations/               # 迁移文件
│   └── seed.ts                   # 种子数据
├── public/                       # 静态资源
│   ├── images/
│   └── icons/
├── .env.example                  # 环境变量示例
├── .gitignore
├── next.config.js                # Next.js配置
├── tailwind.config.js            # Tailwind配置
├── tsconfig.json                 # TypeScript配置
├── package.json
└── README.md
```

---

## 9. 开发路线图

### 阶段1：基础架构搭建（1周）
- [x] 初始化Next.js项目
- [x] 配置Tailwind CSS
- [x] 搭建Prisma + PostgreSQL
- [x] 集成Cloudinary
- [x] 搭建基础组件库（Button、Input、Card等）
- [x] 实现玻璃拟态设计系统

### 阶段2：用户系统开发（1周）
- [ ] 实现注册/登录功能（NextAuth.js）
- [ ] 个人资料编辑页面
- [ ] 头像上传功能
- [ ] 个人主页展示（公开）
- [ ] 用户认证中间件

### 阶段3：专辑和作品管理（2周）
- [ ] 创建专辑功能
- [ ] 编辑专辑信息
- [ ] 删除专辑（带确认）
- [ ] 专辑排序（拖拽）
- [ ] 批量上传照片
- [ ] 编辑照片信息（EXIF自动填充）
- [ ] 照片排序
- [ ] 删除照片

### 阶段4：展示页面开发（1.5周）
- [ ] 个人主页瀑布流展示
- [ ] 专辑详情页瀑布流
- [ ] 大图浏览模式（Lightbox）
- [ ] 信息面板（可折叠）
- [ ] 键盘导航支持
- [ ] 响应式适配（桌面+移动）

### 阶段5：优化和部署（0.5周）
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] SEO优化（Metadata、Sitemap）
- [ ] Vercel部署
- [ ] 配置CI/CD
- [ ] 测试和修复Bug

**总计：约6周**

---

## 10. 技术风险与应对

### 10.1 图片存储成本

**风险：**
Cloudinary免费额度（25GB存储 + 25GB带宽/月）可能不够用。

**应对：**
1. 启用图片优化和压缩，减少存储空间
2. 使用WebP/AVIF格式，减少带宽消耗
3. 监控使用量，提前预警
4. 考虑备用方案：Vercel Blob Storage / AWS S3

### 10.2 数据库性能

**风险：**
随着用户和作品增多，数据库查询可能变慢。

**应对：**
1. 为高频查询字段添加索引（userId、albumId、createdAt）
2. 使用连接池管理数据库连接
3. 实现分页加载（无限滚动）
4. 考虑Redis缓存热点数据

### 10.3 玻璃拟态性能

**风险：**
`backdrop-filter`在低端设备上性能差。

**应对：**
1. 移动端自动降级为实心背景
2. 限制同时使用的玻璃效果元素数量
3. 使用`will-change`提示浏览器优化
4. 提供性能模式切换选项

### 10.4 并发上传

**风险：**
批量上传大文件可能导致超时或内存溢出。

**应对：**
1. 限制单次上传数量（最多50张）
2. 使用队列逐个处理上传
3. 实现断点续传
4. 显示上传进度和错误提示

---

## 附录

### A. 推荐开发工具

- **代码编辑器：** VS Code + Prisma/Tailwind扩展
- **API测试：** Postman / Insomnia
- **数据库管理：** Prisma Studio
- **版本控制：** Git + GitHub
- **设计工具：** Figma

### B. 学习资源

- Next.js官方文档：https://nextjs.org/docs
- Prisma文档：https://www.prisma.io/docs
- Cloudinary文档：https://cloudinary.com/documentation
- Tailwind CSS：https://tailwindcss.com/docs
- NextAuth.js：https://next-auth.js.org

### C. 性能基准

| 指标 | 目标值 | 实际值 | 状态 |
|-----|-------|-------|------|
| 首屏加载时间（4G） | < 1.5s | TBD | ⏳ |
| 首屏加载时间（3G） | < 3s | TBD | ⏳ |
| Lighthouse性能分 | > 90 | TBD | ⏳ |
| 图片懒加载延迟 | < 200ms | TBD | ⏳ |
| API响应时间 | < 300ms | TBD | ⏳ |

---

**文档版本：** V1.0
**最后更新：** 2025-10-08

本技术方案文档涵盖了摄影作品展示平台的完整技术实现方案，包括前端、后端、数据库、云存储、SEO和部署等各个方面。下一步将按照开发路线图逐步实现各项功能。
