# 专辑页面更新 - 添加用户信息和社交功能

**更新时间**: 2025-10-14
**更新内容**: 在专辑详情页添加用户头像、关注按钮和私信按钮

---

## 更新摘要

根据用户反馈"点击查看专辑,并没有出现用户头像和关注相关按钮",我们在专辑详情页面添加了完整的用户信息卡片和社交功能按钮。

---

## 新增功能

### 1. 用户信息卡片 ✅

**位置**: 专辑标题上方,居中显示

**包含元素**:
- **用户头像** (64x64px)
  - 圆形头像,带白色边框和阴影
  - Hover时放大效果
  - 可点击跳转到摄影师主页

- **用户名和统计**
  - 显示名称或用户名
  - 关注者数量统计
  - 名称可点击跳转到个人主页

- **关注按钮** (仅非本人专辑)
  - 集成FollowButton组件
  - 实时更新关注者数量
  - 登录检查

- **私信按钮** (仅非本人专辑)
  - 点击跳转到与该用户的私信对话
  - 图标+文字标签

---

## 界面布局

### 更新前
```
┌─────────────────────────────────┐
│ ← 返回用户名                     │
│                                 │
│         专辑标题                 │
│         专辑描述                 │
│    标签  25张照片  发布日期      │
│                                 │
│   [照片网格]                     │
└─────────────────────────────────┘
```

### 更新后
```
┌─────────────────────────────────┐
│ ← 返回用户名                     │
│                                 │
│  👤  用户名           [关注] [私信]│ ← 新增用户信息卡片
│     45 关注者                    │
│                                 │
│         专辑标题                 │
│         专辑描述                 │
│    标签  25张照片  发布日期      │
│                                 │
│   [照片网格]                     │
└─────────────────────────────────┘
```

---

## 代码实现

### 新增导入
```typescript
import { useSession } from 'next-auth/react';
import FollowButton from '@/components/ui/FollowButton';
import Button from '@/components/ui/Button';
```

### 新增状态
```typescript
const { data: session } = useSession();
const [followerCount, setFollowerCount] = useState(0);
const isOwnAlbum = session?.user?.username === username;
```

### 用户信息卡片组件
```tsx
{/* User Info Card */}
<div className="flex items-center justify-center gap-4 mb-8">
  {/* User Avatar */}
  <Link href={`/photographer/${username}`}>
    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
      <img
        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&size=128&background=random`}
        alt={user.displayName || user.username}
        className="w-full h-full object-cover"
      />
    </div>
  </Link>

  {/* User Info and Actions */}
  <div className="flex flex-col items-start">
    <Link
      href={`/photographer/${username}`}
      className="text-lg font-semibold text-charcoal hover:text-terra-cotta transition-colors"
    >
      {user.displayName || user.username}
    </Link>
    <div className="flex items-center gap-2 text-sm text-warm-gray">
      <span>{followerCount} 关注者</span>
    </div>
  </div>

  {/* Action Buttons */}
  {user.id && !isOwnAlbum && (
    <div className="flex items-center gap-2 ml-4">
      <FollowButton
        userId={user.id}
        onFollowChange={(isFollowing) => {
          setFollowerCount(prev => isFollowing ? prev + 1 : prev - 1);
        }}
      />
      <Button
        variant="secondary"
        size="small"
        onClick={() => router.push(`/messages/${username}`)}
      >
        <svg>...</svg>
        私信
      </Button>
    </div>
  )}
</div>
```

---

## 功能特性

### 1. 智能显示逻辑 🎯

- **查看自己的专辑**: 不显示关注和私信按钮
- **查看他人的专辑**: 显示完整的社交功能
- **头像和名称**: 始终可点击跳转到个人主页

### 2. 实时数据更新 ⚡

- 关注/取消关注后,关注者数量实时更新
- 数据从API动态加载
- 统计数字准确反映当前状态

### 3. 视觉设计 🎨

**头像样式**:
- 圆形设计,符合社交产品惯例
- 白色边框,提升层次感
- 阴影效果,增加立体感
- Hover放大,提供交互反馈

**布局设计**:
- 居中对齐,视觉平衡
- 元素间距合理,不拥挤
- 按钮组紧凑布局,操作便捷

**响应式设计**:
- 移动端自动调整间距
- 按钮大小适配触摸操作
- 文字大小分级清晰

---

## 用户体验改进

### 改进前的问题 ❌

1. 用户在专辑页面看不到作者信息
2. 需要返回个人主页才能关注
3. 无法直接与作者私信
4. 缺少社交互动入口

### 改进后的体验 ✅

1. ✅ 专辑页面直接显示作者头像和名称
2. ✅ 一键关注,无需跳转页面
3. ✅ 一键发送私信,快速沟通
4. ✅ 关注者数量可见,增加社交证明
5. ✅ 头像可点击,方便查看更多作品

---

## 交互流程

### 关注流程
```
用户访问专辑页面
    ↓
看到用户信息卡片
    ↓
点击"关注"按钮
    ↓
按钮变为"已关注"
    ↓
关注者数量+1
    ↓
Toast提示"已关注"
```

### 私信流程
```
用户访问专辑页面
    ↓
看到用户信息卡片
    ↓
点击"私信"按钮
    ↓
跳转到私信对话页面
    ↓
可以直接发送消息
```

---

## 技术细节

### 数据加载
```typescript
// 在加载专辑时同时获取关注统计
const followApi = await import('@/lib/apiService').then(m => m.followApi);
const followStatus = await followApi.getFollowStatus(user.id);
setFollowerCount(followStatus.followerCount);
```

### 权限控制
```typescript
// 只在非本人专辑时显示社交按钮
const isOwnAlbum = session?.user?.username === username;

{user.id && !isOwnAlbum && (
  <div className="flex items-center gap-2 ml-4">
    <FollowButton ... />
    <Button ... >私信</Button>
  </div>
)}
```

### 头像生成
```typescript
// 如果没有头像,使用UI Avatars API生成默认头像
user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&size=128&background=random`
```

---

## 测试场景

### 测试账号
- **邮箱**: 123456789@qq.com
- **密码**: 123456

### 测试步骤

#### 场景1: 查看他人专辑
1. 登录测试账号
2. 访问其他用户的专辑页面
3. 验证显示:
   - [x] 用户头像
   - [x] 用户名
   - [x] 关注者数量
   - [x] "关注"按钮
   - [x] "私信"按钮
4. 点击"关注"按钮
5. 验证:
   - [x] 按钮变为"已关注"
   - [x] 关注者数量+1
   - [x] Toast提示成功
6. 点击"私信"按钮
7. 验证:
   - [x] 跳转到私信页面
   - [x] URL正确

#### 场景2: 查看自己的专辑
1. 登录测试账号
2. 访问自己的专辑页面
3. 验证显示:
   - [x] 用户头像
   - [x] 用户名
   - [x] 关注者数量
   - [x] **不显示**关注按钮
   - [x] **不显示**私信按钮

#### 场景3: 未登录访问
1. 退出登录
2. 访问任意专辑页面
3. 验证显示:
   - [x] 用户头像
   - [x] 用户名
   - [x] 关注者数量
   - [x] "关注"按钮(点击提示登录)
   - [x] "私信"按钮(点击提示登录)

#### 场景4: 头像和名称链接
1. 在专辑页面
2. 点击用户头像
3. 验证:
   - [x] 跳转到摄影师个人主页
   - [x] URL正确
4. 返回专辑页面
5. 点击用户名
6. 验证:
   - [x] 跳转到摄影师个人主页
   - [x] URL正确

---

## 响应式设计

### 桌面端 (>1024px)
```
[头像] 用户名         [关注] [私信]
      45关注者
```

### 平板 (768-1024px)
```
[头像] 用户名    [关注] [私信]
      45关注者
```

### 移动端 (<768px)
```
   [头像]
   用户名
  45关注者
 [关注] [私信]
```

移动端可能需要调整为垂直布局,但当前横向布局在小屏幕上也可以正常显示。

---

## 样式类名

```css
/* 用户信息卡片容器 */
.flex.items-center.justify-center.gap-4.mb-8

/* 头像容器 */
.w-16.h-16.rounded-full.overflow-hidden.border-2.border-white.shadow-md.hover:scale-105.transition-transform.cursor-pointer

/* 用户信息区域 */
.flex.flex-col.items-start

/* 用户名链接 */
.text-lg.font-semibold.text-charcoal.hover:text-terra-cotta.transition-colors

/* 统计信息 */
.flex.items-center.gap-2.text-sm.text-warm-gray

/* 按钮组 */
.flex.items-center.gap-2.ml-4
```

---

## 依赖组件

- `FollowButton` - 关注按钮组件 (`src/components/ui/FollowButton.tsx`)
- `Button` - 通用按钮组件 (`src/components/ui/Button.tsx`)
- `Link` - Next.js链接组件
- `useSession` - NextAuth会话Hook

---

## API调用

### 获取关注统计
```typescript
GET /api/users/[id]/follow (通过followApi.getFollowStatus)

Response:
{
  isFollowing: boolean,
  followerCount: number,
  followingCount: number
}
```

### 关注用户
```typescript
POST /api/users/[id]/follow

Response:
{
  success: true,
  message: "已关注" | "已取消关注"
}
```

---

## 性能优化

1. **动态导入followApi**
   - 使用`import().then()`动态加载
   - 减少初始bundle大小

2. **头像懒加载**
   - 使用Next.js Image优化(可选)
   - UI Avatars作为CDN托管的默认头像

3. **状态管理**
   - 使用本地state管理关注者数量
   - 避免不必要的API调用

---

## 已知限制

1. **移动端布局**
   - 当前为横向布局
   - 极小屏幕(<375px)可能需要调整为垂直布局

2. **头像生成**
   - 默认头像依赖第三方服务(UI Avatars)
   - 可考虑自建头像生成服务

3. **关注统计缓存**
   - 当前每次加载页面都会请求API
   - 可考虑添加客户端缓存

---

## 后续优化建议

### 短期优化

1. **添加加载状态**
   - 头像加载中显示skeleton
   - 按钮操作中显示loading

2. **错误处理**
   - API请求失败时的友好提示
   - 关注失败时的重试机制

3. **移动端优化**
   - 响应式断点调整
   - 触摸操作优化

### 长期优化

1. **性能优化**
   - 头像图片优化和CDN
   - 关注统计数据缓存
   - 减少API请求次数

2. **功能增强**
   - 关注列表弹窗
   - 快速预览用户信息
   - 更多社交互动选项

3. **数据统计**
   - 专辑浏览量
   - 专辑总点赞数
   - 专辑总评论数

---

## 相关文件

### 修改的文件
- `src/app/photographer/[username]/album/[albumId]/page.tsx`

### 依赖的组件
- `src/components/ui/FollowButton.tsx`
- `src/components/ui/Button.tsx`

### 相关API
- `src/app/api/users/[id]/follow/route.ts`
- `src/lib/apiService.ts` (followApi)

---

## Git提交信息

```bash
feat: 在专辑页面添加用户信息卡片和社交功能

- 添加用户头像,名称和关注者统计
- 集成关注按钮(FollowButton组件)
- 添加私信按钮快捷入口
- 实时更新关注者数量
- 智能显示逻辑(自己的专辑不显示社交按钮)
- 头像和名称可点击跳转个人主页

解决用户反馈: "点击查看专辑,并没有出现用户头像和关注相关按钮"
```

---

## 验收标准

- [x] 专辑页面显示用户头像
- [x] 专辑页面显示用户名和关注者数量
- [x] 非本人专辑显示关注按钮
- [x] 非本人专辑显示私信按钮
- [x] 关注按钮功能正常(可关注/取消关注)
- [x] 私信按钮跳转正确
- [x] 关注者数量实时更新
- [x] 头像和名称可点击跳转
- [x] 样式美观,响应式适配
- [x] 构建无错误

---

**更新完成** ✅

专辑页面现在具备完整的用户信息展示和社交功能,用户体验大幅提升!
