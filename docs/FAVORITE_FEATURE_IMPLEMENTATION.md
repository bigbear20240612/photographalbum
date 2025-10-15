# 收藏功能实现计划

**创建时间**: 2025-10-15
**优先级**: 高
**预计工时**: 4-6小时
**实现范围**: 照片收藏 + 专辑收藏 + 收藏列表页面

---

## 1. 数据库模型设计

### Prisma Schema 修改

在 `prisma/schema.prisma` 文件末尾添加:

```prisma
model Favorite {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  photoId   String?  @map("photo_id")
  albumId   String?  @map("album_id")
  createdAt DateTime @default(now())

  user  User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  photo Photo? @relation(fields: [photoId], references: [id], onDelete: Cascade)
  album Album? @relation(fields: [albumId], references: [id], onDelete: Cascade)

  @@unique([userId, photoId], name: "unique_user_photo_favorite")
  @@unique([userId, albumId], name: "unique_user_album_favorite")
  @@index([userId])
  @@index([photoId])
  @@index([albumId])
  @@map("favorites")
}
```

### User模型需要添加的关系

```prisma
model User {
  // ... 现有字段 ...
  favorites     Favorite[]
}
```

### Photo模型需要添加的关系

```prisma
model Photo {
  // ... 现有字段 ...
  favorites     Favorite[]
}
```

### Album模型需要添加的关系

```prisma
model Album {
  // ... 现有字段 ...
  favorites     Favorite[]
}
```

### 数据库迁移命令

```bash
# 创建迁移文件
npx prisma migrate dev --name add_favorite_feature

# 生成Prisma Client
npx prisma generate
```

---

## 2. 后端API实现

### 2.1 照片收藏API

**文件**: `src/app/api/photos/[id]/favorite/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - 检查是否已收藏
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const photoId = params.id;
    const userId = session.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        unique_user_photo_favorite: {
          userId,
          photoId
        }
      }
    });

    return NextResponse.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json(
      { success: false, error: '检查收藏状态失败' },
      { status: 500 }
    );
  }
}

// POST - 收藏/取消收藏照片
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const photoId = params.id;
    const userId = session.user.id;

    // 检查照片是否存在
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });

    if (!photo) {
      return NextResponse.json(
        { success: false, error: '照片不存在' },
        { status: 404 }
      );
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        unique_user_photo_favorite: {
          userId,
          photoId
        }
      }
    });

    if (existingFavorite) {
      // 取消收藏
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      return NextResponse.json({
        success: true,
        isFavorited: false,
        message: '已取消收藏'
      });
    } else {
      // 添加收藏
      await prisma.favorite.create({
        data: {
          userId,
          photoId
        }
      });

      return NextResponse.json({
        success: true,
        isFavorited: true,
        message: '已收藏'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { success: false, error: '收藏操作失败' },
      { status: 500 }
    );
  }
}
```

---

### 2.2 专辑收藏API

**文件**: `src/app/api/albums/[id]/favorite/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - 检查是否已收藏
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const albumId = params.id;
    const userId = session.user.id;

    const favorite = await prisma.favorite.findUnique({
      where: {
        unique_user_album_favorite: {
          userId,
          albumId
        }
      }
    });

    return NextResponse.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json(
      { success: false, error: '检查收藏状态失败' },
      { status: 500 }
    );
  }
}

// POST - 收藏/取消收藏专辑
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const albumId = params.id;
    const userId = session.user.id;

    // 检查专辑是否存在
    const album = await prisma.album.findUnique({
      where: { id: albumId }
    });

    if (!album) {
      return NextResponse.json(
        { success: false, error: '专辑不存在' },
        { status: 404 }
      );
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        unique_user_album_favorite: {
          userId,
          albumId
        }
      }
    });

    if (existingFavorite) {
      // 取消收藏
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      return NextResponse.json({
        success: true,
        isFavorited: false,
        message: '已取消收藏'
      });
    } else {
      // 添加收藏
      await prisma.favorite.create({
        data: {
          userId,
          albumId
        }
      });

      return NextResponse.json({
        success: true,
        isFavorited: true,
        message: '已收藏'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { success: false, error: '收藏操作失败' },
      { status: 500 }
    );
  }
}
```

---

### 2.3 收藏列表API

**文件**: `src/app/api/favorites/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - 获取当前用户的所有收藏
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'photo' | 'album' | null

    let favorites;

    if (type === 'photo') {
      // 只获取照片收藏
      favorites = await prisma.favorite.findMany({
        where: {
          userId,
          photoId: { not: null }
        },
        include: {
          photo: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              album: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (type === 'album') {
      // 只获取专辑收藏
      favorites = await prisma.favorite.findMany({
        where: {
          userId,
          albumId: { not: null }
        },
        include: {
          album: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              _count: {
                select: {
                  photos: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // 获取所有收藏
      favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          photo: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              album: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          },
          album: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              _count: {
                select: {
                  photos: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取收藏列表失败' },
      { status: 500 }
    );
  }
}
```

---

## 3. 前端组件实现

### 3.1 FavoriteButton组件

**文件**: `src/components/ui/FavoriteButton.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  photoId?: string;
  albumId?: string;
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  photoId,
  albumId,
  showLabel = false,
  className = ''
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 构建API URL
  const apiUrl = photoId
    ? `/api/photos/${photoId}/favorite`
    : albumId
    ? `/api/albums/${albumId}/favorite`
    : null;

  // 检查收藏状态
  useEffect(() => {
    if (!apiUrl || !session) return;

    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success) {
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error('检查收藏状态失败:', error);
      }
    };

    checkFavoriteStatus();
  }, [apiUrl, session]);

  // 切换收藏状态
  const toggleFavorite = async () => {
    if (!session) {
      toast.error('请先登录');
      return;
    }

    if (!apiUrl) {
      toast.error('参数错误');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsFavorited(data.isFavorited);
        toast.success(data.message);
      } else {
        toast.error(data.error || '操作失败');
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast.error('操作失败,请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      title={isFavorited ? '取消收藏' : '收藏'}
    >
      {/* 书签图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all ${
          isFavorited ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
        }`}
      >
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>

      {showLabel && (
        <span className={isFavorited ? 'text-amber-500' : 'text-gray-600'}>
          {isFavorited ? '已收藏' : '收藏'}
        </span>
      )}
    </button>
  );
}
```

---

### 3.2 收藏列表页面

**文件**: `src/app/dashboard/favorites/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import PhotoGrid from '@/components/features/PhotoGrid';
import AlbumGrid from '@/components/features/AlbumGrid';
import Lightbox from '@/components/features/Lightbox';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photo' | 'album'>('photo');
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载收藏列表
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/favorites?type=${activeTab}`);
        const data = await response.json();

        if (data.success) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error('加载收藏列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      loadFavorites();
    }
  }, [session, activeTab]);

  // 提取照片或专辑数据
  const items = favorites.map(fav =>
    activeTab === 'photo' ? fav.photo : fav.album
  ).filter(Boolean);

  if (status === 'loading' || isLoading) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-warm-gray">加载中...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="min-h-screen py-12">
        <Container>
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold text-charcoal mb-4">
              我的收藏
            </h1>
            <p className="text-warm-gray">
              {activeTab === 'photo' ? '收藏的照片' : '收藏的专辑'}
            </p>
          </div>

          {/* 标签切换 */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('photo')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === 'photo'
                  ? 'bg-terra-cotta text-white'
                  : 'bg-light-gray text-charcoal hover:bg-warm-gray'
              }`}
            >
              照片收藏
            </button>
            <button
              onClick={() => setActiveTab('album')}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === 'album'
                  ? 'bg-terra-cotta text-white'
                  : 'bg-light-gray text-charcoal hover:bg-warm-gray'
              }`}
            >
              专辑收藏
            </button>
          </div>

          {/* 内容区域 */}
          {items.length > 0 ? (
            activeTab === 'photo' ? (
              <PhotoGrid
                photos={items}
                onPhotoClick={(index) => {
                  setLightboxIndex(index);
                  setIsLightboxOpen(true);
                }}
              />
            ) : (
              <AlbumGrid albums={items} />
            )
          ) : (
            <div className="text-center py-16">
              <p className="text-warm-gray text-lg mb-4">
                {activeTab === 'photo' ? '还没有收藏照片' : '还没有收藏专辑'}
              </p>
              <p className="text-light-gray">
                {activeTab === 'photo'
                  ? '在照片详情页点击收藏按钮添加收藏'
                  : '在专辑页面点击收藏按钮添加收藏'}
              </p>
            </div>
          )}
        </Container>
      </div>

      {/* Lightbox */}
      {activeTab === 'photo' && (
        <Lightbox
          photos={items}
          initialIndex={lightboxIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </>
  );
}
```

---

## 4. API服务层

修改 `src/lib/apiService.ts`,添加收藏API:

```typescript
// 收藏API
export const favoriteApi = {
  // 照片收藏
  checkPhotoFavorite: (photoId: string) =>
    fetch(`/api/photos/${photoId}/favorite`).then(res => res.json()),

  togglePhotoFavorite: (photoId: string) =>
    fetch(`/api/photos/${photoId}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

  // 专辑收藏
  checkAlbumFavorite: (albumId: string) =>
    fetch(`/api/albums/${albumId}/favorite`).then(res => res.json()),

  toggleAlbumFavorite: (albumId: string) =>
    fetch(`/api/albums/${albumId}/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()),

  // 收藏列表
  getFavorites: (type?: 'photo' | 'album') => {
    const url = type ? `/api/favorites?type=${type}` : '/api/favorites';
    return fetch(url).then(res => res.json());
  }
};
```

---

## 5. UI集成位置

### 5.1 Lightbox侧边栏(照片收藏)

修改 `src/components/features/Lightbox.tsx`,在点赞按钮旁边添加收藏按钮:

```typescript
import FavoriteButton from '@/components/ui/FavoriteButton';

// 在点赞按钮同一行添加
<div className="flex items-center gap-4 mb-4">
  <LikeButton photoId={currentPhoto.id} />
  <FavoriteButton photoId={currentPhoto.id} showLabel />
</div>
```

### 5.2 专辑详情页(专辑收藏)

修改 `src/app/photographer/[username]/album/[albumId]/page.tsx`,在专辑标题旁边添加:

```typescript
import FavoriteButton from '@/components/ui/FavoriteButton';

// 在专辑标题行添加
<div className="flex items-center justify-center gap-4 mb-4">
  <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
    {album.title}
  </h1>
  <FavoriteButton albumId={album.id} />
</div>
```

### 5.3 Dashboard导航

修改Dashboard导航,添加"我的收藏"链接。

---

## 6. 实施步骤

### 第1步: 数据库迁移
1. 修改 `prisma/schema.prisma` 添加Favorite模型
2. 运行 `npx prisma migrate dev --name add_favorite_feature`
3. 运行 `npx prisma generate`

### 第2步: 后端API实现
1. 创建 `src/app/api/photos/[id]/favorite/route.ts`
2. 创建 `src/app/api/albums/[id]/favorite/route.ts`
3. 创建 `src/app/api/favorites/route.ts`

### 第3步: 前端组件实现
1. 创建 `src/components/ui/FavoriteButton.tsx`
2. 创建 `src/app/dashboard/favorites/page.tsx`

### 第4步: API服务层
1. 修改 `src/lib/apiService.ts` 添加favoriteApi

### 第5步: UI集成
1. 修改Lightbox添加收藏按钮
2. 修改专辑页面添加收藏按钮
3. 修改Dashboard导航添加收藏链接

### 第6步: 测试
1. 测试照片收藏/取消收藏
2. 测试专辑收藏/取消收藏
3. 测试收藏列表页面
4. 测试收藏状态持久化

### 第7步: 构建和部署
1. 运行 `npm run build` 检查编译
2. 提交代码到Git
3. 推送到GitHub自动部署

---

## 7. 预期效果

### 照片收藏
- 用户可以在Lightbox中收藏照片
- 收藏按钮显示书签图标
- 已收藏显示黄色实心图标
- 未收藏显示灰色空心图标

### 专辑收藏
- 用户可以在专辑页面收藏专辑
- 收藏按钮在标题旁边
- 图标和交互同照片收藏

### 收藏列表
- Dashboard新增"我的收藏"入口
- 支持查看收藏的照片和专辑
- 支持标签切换
- 空状态友好提示

---

## 8. 测试场景

### 测试账号
- 邮箱: 123456789@qq.com
- 密码: 123456

### 测试步骤
1. 登录测试账号
2. 访问专辑页面,点击照片进入Lightbox
3. 点击信息按钮,找到收藏按钮
4. 点击收藏,验证图标变化和Toast提示
5. 关闭Lightbox重新打开,验证状态保持
6. 访问Dashboard→我的收藏,验证照片显示
7. 切换到专辑收藏标签,测试专辑收藏
8. 取消收藏,验证从列表中移除

---

**实施计划完成**
**预计完成时间**: 4-6小时
**准备开始实施**: ✅

