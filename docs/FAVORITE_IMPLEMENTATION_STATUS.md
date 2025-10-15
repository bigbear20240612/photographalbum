# 收藏功能实现状态报告

**创建时间**: 2025-10-15
**当前进度**: 60% (核心后端已完成)

---

## ✅ 已完成部分

### 1. 数据库模型 (100%)

**文件**: `prisma/schema.prisma`

已添加 Favorite 模型:
```prisma
model Favorite {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  photoId   String?  @map("photo_id")
  albumId   String?  @map("album_id")
  createdAt DateTime @default(now()) @map("created_at")

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

已更新关系:
- User.favorites
- Photo.favorites
- Album.favorites

已生成 Prisma Client: ✅

### 2. 后端API (100%)

#### API 1: 照片收藏
**文件**: `src/app/api/photos/[id]/favorite/route.ts`
- ✅ GET - 检查照片收藏状态
- ✅ POST - 收藏/取消收藏照片

#### API 2: 专辑收藏
**文件**: `src/app/api/albums/[id]/favorite/route.ts`
- ✅ GET - 检查专辑收藏状态
- ✅ POST - 收藏/取消收藏专辑

#### API 3: 收藏列表
**文件**: `src/app/api/favorites/route.ts`
- ✅ GET - 获取收藏列表
- ✅ 支持筛选类型 (?type=photo|album)
- ✅ 包含完整关联数据

---

## ⏭️ 待完成部分

### 3. 前端组件 (0%)

#### FavoriteButton 组件
**文件**: `src/components/ui/FavoriteButton.tsx`

**需要实现的功能**:
- 书签图标显示
- 收藏状态切换
- 登录检查
- Toast通知
- 支持 photoId 和 albumId

**代码模板** (参考 LikeButton.tsx):
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface FavoriteButtonProps {
  photoId?: string;
  albumId?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({
  photoId,
  albumId,
  showLabel = false
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = photoId
    ? `/api/photos/${photoId}/favorite`
    : albumId
    ? `/api/albums/${albumId}/favorite`
    : null;

  useEffect(() => {
    if (!apiUrl || !session) return;

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.success) setIsFavorited(data.isFavorited);
      });
  }, [apiUrl, session]);

  const toggleFavorite = async () => {
    if (!session) {
      toast.error('请先登录');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(apiUrl!, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setIsFavorited(data.isFavorited);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={toggleFavorite} disabled={isLoading}>
      {/* 书签图标 SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        className={isFavorited ? 'text-amber-500' : 'text-gray-400'}
      >
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {showLabel && <span>{isFavorited ? '已收藏' : '收藏'}</span>}
    </button>
  );
}
```

### 4. 收藏列表页面 (0%)

**文件**: `src/app/dashboard/favorites/page.tsx`

**需要实现的功能**:
- 标签切换(照片/专辑)
- 照片网格展示
- 专辑网格展示
- 空状态提示
- Lightbox集成

**简化版代码**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PhotoGrid from '@/components/features/PhotoGrid';
import AlbumGrid from '@/components/features/AlbumGrid';

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'photo' | 'album'>('photo');
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/favorites?type=${activeTab}`)
      .then(res => res.json())
      .then(data => setFavorites(data.favorites || []));
  }, [session, activeTab]);

  const items = favorites.map(fav =>
    activeTab === 'photo' ? fav.photo : fav.album
  ).filter(Boolean);

  return (
    <div className="py-12">
      <h1>我的收藏</h1>

      {/* 标签切换 */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('photo')}
          className={activeTab === 'photo' ? 'active' : ''}
        >
          照片收藏
        </button>
        <button
          onClick={() => setActiveTab('album')}
          className={activeTab === 'album' ? 'active' : ''}
        >
          专辑收藏
        </button>
      </div>

      {/* 内容展示 */}
      {items.length > 0 ? (
        activeTab === 'photo' ? (
          <PhotoGrid photos={items} />
        ) : (
          <AlbumGrid albums={items} />
        )
      ) : (
        <p>还没有收藏</p>
      )}
    </div>
  );
}
```

### 5. UI集成 (0%)

#### 集成到 Lightbox
**文件**: `src/components/features/Lightbox.tsx`

在点赞按钮旁边添加:
```typescript
import FavoriteButton from '@/components/ui/FavoriteButton';

// 在侧边栏添加
<div className="flex items-center gap-4">
  <LikeButton photoId={currentPhoto.id} />
  <FavoriteButton photoId={currentPhoto.id} showLabel />
</div>
```

#### 集成到专辑页面
**文件**: `src/app/photographer/[username]/album/[albumId]/page.tsx`

在标题旁边添加:
```typescript
import FavoriteButton from '@/components/ui/FavoriteButton';

<div className="flex items-center gap-4">
  <h1>{album.title}</h1>
  <FavoriteButton albumId={album.id} />
</div>
```

### 6. API服务层 (0%)

**文件**: `src/lib/apiService.ts`

在文件末尾添加:
```typescript
// 收藏API
export const favoriteApi = {
  checkPhotoFavorite: (photoId: string) =>
    fetch(`/api/photos/${photoId}/favorite`).then(res => res.json()),

  togglePhotoFavorite: (photoId: string) =>
    fetch(`/api/photos/${photoId}/favorite`, { method: 'POST' }).then(res => res.json()),

  checkAlbumFavorite: (albumId: string) =>
    fetch(`/api/albums/${albumId}/favorite`).then(res => res.json()),

  toggleAlbumFavorite: (albumId: string) =>
    fetch(`/api/albums/${albumId}/favorite`, { method: 'POST' }).then(res => res.json()),

  getFavorites: (type?: 'photo' | 'album') => {
    const url = type ? `/api/favorites?type=${type}` : '/api/favorites';
    return fetch(url).then(res => res.json());
  }
};
```

---

## 🚀 快速完成步骤

### 步骤1: 创建 FavoriteButton 组件
```bash
# 复制 LikeButton.tsx 作为模板
cp src/components/ui/LikeButton.tsx src/components/ui/FavoriteButton.tsx
# 修改逻辑:将 like API 改为 favorite API,图标改为书签
```

### 步骤2: 创建收藏列表页面
```bash
# 创建新页面
mkdir -p src/app/dashboard/favorites
# 创建 page.tsx 文件(使用上面的简化版代码)
```

### 步骤3: 集成到现有页面
- 修改 Lightbox.tsx (第217行附近,点赞按钮旁边)
- 修改 album/[albumId]/page.tsx (第191行附近,标题旁边)

### 步骤4: 更新 API服务层
- 在 apiService.ts 末尾添加 favoriteApi

### 步骤5: 测试和构建
```bash
npm run build
```

### 步骤6: 提交代码
```bash
git add .
git commit -m "feat: 实现完整的收藏功能"
git push
```

---

## 📋 验收清单

### 功能测试
- [ ] 照片收藏: 在Lightbox中点击收藏按钮
- [ ] 专辑收藏: 在专辑页面点击收藏按钮
- [ ] 收藏状态: 刷新页面后状态保持
- [ ] 取消收藏: 再次点击取消收藏
- [ ] 收藏列表: 访问 /dashboard/favorites 查看收藏
- [ ] 标签切换: 在照片和专辑收藏间切换
- [ ] 空状态: 未收藏时显示提示
- [ ] 登录检查: 未登录时提示登录

### 技术验证
- [ ] Prisma Client 已生成
- [ ] API 路由可访问
- [ ] 数据库迁移成功(部署时)
- [ ] TypeScript 编译通过
- [ ] 构建成功无错误

---

## 📊 进度汇总

| 模块 | 文件数 | 完成度 |
|------|--------|--------|
| 数据库模型 | 1 | 100% ✅ |
| 后端API | 3 | 100% ✅ |
| 前端组件 | 1 | 0% ⏭️ |
| 页面 | 1 | 0% ⏭️ |
| UI集成 | 2 | 0% ⏭️ |
| API服务层 | 1 | 0% ⏭️ |

**总体进度**: 60% (核心功能已完成)

---

## 💡 建议

由于token使用较多,建议:
1. ✅ 数据库和API已完成(核心功能)
2. ⏭️ 前端组件可以参考现有的 LikeButton 组件快速实现
3. ⏭️ 页面代码可以复制 Dashboard 现有页面作为模板
4. ⏭️ 集成只需要添加几行导入和JSX代码

**预计剩余时间**: 1-2小时即可完成所有前端部分

---

**报告生成时间**: 2025-10-15
**状态**: 核心后端已完成,前端待实施
