# PhotoAlbum - 画廊级摄影作品展示平台

一个专为摄影师打造的现代化作品展示平台，采用 Next.js 14 + TypeScript + Tailwind CSS 构建，结合玻璃拟态设计和非洲大地色系，提供画廊级的沉浸式浏览体验。

![PhotoAlbum](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## 特性

- ✨ **现代设计**: 玻璃拟态(Glassmorphism) + 非洲大地色系
- 🖼️ **画廊级展示**: 高质量图片展示,无压缩损失
- 📱 **完全响应式**: 桌面、平板、移动端全面适配
- 🎯 **瀑布流布局**: 优雅的作品展示方式
- 🔍 **Lightbox大图浏览**: 沉浸式作品欣赏体验
- ⚡ **性能优化**: 图片懒加载、代码分割
- 🎨 **专业设计系统**: 完整的色彩、字体、间距规范
- 🌐 **SEO友好**: Next.js SSR/ISR 支持

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.6
- **样式**: Tailwind CSS 3.4
- **状态管理**: Zustand
- **数据请求**: TanStack Query (React Query)
- **动画**: Framer Motion
- **布局**: react-masonry-css

### 后端
- **API**: Next.js API Routes (Serverless Functions)
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js v5
- **图片存储**: Cloudinary CDN
- **实时通信**: Pusher

### 核心依赖
```json
{
  "next": "^14.2.18",
  "react": "^18.3.1",
  "typescript": "^5.6.3",
  "tailwindcss": "^3.4.17",
  "zustand": "^5.0.8",
  "@tanstack/react-query": "^5.90.2",
  "framer-motion": "^12.23.22",
  "react-masonry-css": "^1.0.16",
  "@prisma/client": "^6.17.0",
  "next-auth": "^5.0.0-beta.29",
  "bcryptjs": "^3.0.2",
  "cloudinary": "^2.7.0",
  "pusher": "^5.2.0"
}
```

## 项目结构

```
photographalbum/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 首页
│   │   ├── login/                    # 登录页
│   │   ├── register/                 # 注册页
│   │   └── photographer/             # 摄影师页面
│   │       └── [username]/           # 个人主页
│   │           └── album/            # 专辑详情
│   │               └── [albumId]/
│   ├── components/                   # React组件
│   │   ├── ui/                       # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/                   # 布局组件
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   └── features/                 # 业务组件
│   │       ├── AlbumGrid.tsx
│   │       ├── PhotoGrid.tsx
│   │       └── Lightbox.tsx
│   ├── lib/                          # 工具函数
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── mockData.ts               # 模拟数据
│   ├── types/                        # TypeScript类型
│   │   └── index.ts
│   └── hooks/                        # 自定义Hooks
├── public/                           # 静态资源
├── PRD.md                            # 产品需求文档
├── DESIGN_SPEC.md                    # 设计规范文档
├── TECH_SPEC.md                      # 技术方案文档
└── README.md                         # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 核心功能

### 1. 首页 (`/`)
- Hero区域展示平台特色
- 特性介绍(画廊级展示、专辑管理、个人品牌)
- 精选作品展示
- CTA注册引导

### 2. 发现页 (`/discover`) ⭐新增
- 所有作品浏览
- 分类筛选（人像、风光、街拍等）
- 瀑布流布局展示

### 3. 用户认证
- **登录页** (`/login`): 邮箱+密码登录
- **注册页** (`/register`): 用户注册表单

### 4. 个人主页 (`/photographer/[username]`)
- 个人信息展示(头像、昵称、简介、社交链接)
- 拍摄领域标签
- 作品统计(专辑数、作品数)
- 专辑瀑布流展示

### 5. 专辑详情页 (`/photographer/[username]/album/[albumId]`)
- 专辑信息(标题、描述、标签)
- 作品瀑布流展示
- 点击作品打开Lightbox

### 6. 工作台 (`/dashboard`) ⭐新增
- 专辑列表管理
- 快速操作按钮（编辑/上传）
- 标签页切换（专辑/照片）
- 空状态提示

### 7. 创建专辑 (`/dashboard/albums/create`) ⭐新增
- 专辑标题、描述
- 12个分类选择（人像、风光、街拍等）
- 表单验证
- 提示信息

### 8. 编辑专辑 (`/dashboard/albums/[id]/edit`) ⭐新增
- 更新专辑信息
- 删除专辑（带确认对话框）
- 危险操作警告

### 9. 上传照片 (`/dashboard/albums/[id]/upload`) ⭐新增
- **拖拽上传**：拖放文件到上传区
- **批量上传**：一次最多50张
- **照片预览**：实时缩略图
- **编辑信息**：标题、描述
- **移除照片**：单张删除

### 10. Lightbox大图浏览
- 全屏沉浸式浏览
- 左右键/点击按钮切换照片
- 信息面板(可折叠)
  - 作品标题和描述
  - 拍摄参数(相机、镜头、ISO、光圈、快门、焦距)
  - 拍摄地点
  - 图片尺寸
- 键盘快捷键支持(Esc关闭、左右箭头切换、I切换信息)

## 设计系统

### 色彩系统

#### 主色调
- **Terra Cotta** (热土赤陶): `#D4773C`
- **Desert Gold** (沙漠金): `#C9984C`

#### 辅助色
- **Earth Brown** (大地棕): `#8B6F47`
- **Savanna Green** (草原绿): `#7A9B76`
- **Sunset Orange** (日落橙): `#E8956C`

#### 中性色
- **Charcoal** (炭黑): `#2C2C2C`
- **Warm Gray** (暖灰): `#5C5C5C`
- **Soft White** (柔白): `#FAFAF8`

### 字体系统
- **英文**: Inter (无衬线), Playfair Display (衬线)
- **中文**: Noto Sans SC (无衬线), Noto Serif SC (衬线)

### 玻璃拟态效果
```css
.glass-light {
  background: rgba(250, 250, 248, 0.75);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(224, 221, 214, 0.4);
  box-shadow: 0 4px 16px rgba(139, 111, 71, 0.08);
}
```

## 响应式设计

### 断点
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 布局适配
- **专辑/作品瀑布流**:
  - 桌面: 3列
  - 平板: 2列
  - 手机: 1列
- **导航**:
  - 桌面: 顶部固定导航栏
  - 移动: 底部固定导航栏

## 数据与API

### 前端Mock数据 (`src/lib/mockData.ts`)
当前前端使用模拟数据进行演示：
- 2个示例用户
- 4个示例专辑
- 8张示例照片
- 图片使用 Picsum Photos 占位图服务

### 后端API (已实现) ✅
完整的RESTful API已开发完成，包含：

**认证相关** (3个端点):
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/signin` - 用户登录
- `POST /api/auth/signout` - 用户登出

**用户管理** (3个端点):
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户资料
- `GET /api/users/[username]` - 获取用户公开信息

**专辑管理** (5个端点):
- `GET /api/albums` - 获取专辑列表（支持分页和筛选）
- `POST /api/albums` - 创建专辑
- `GET /api/albums/[id]` - 获取专辑详情
- `PUT /api/albums/[id]` - 更新专辑
- `DELETE /api/albums/[id]` - 删除专辑

**照片管理** (4个端点):
- `POST /api/photos/upload` - 批量上传照片（集成Cloudinary）
- `GET /api/photos/[id]` - 获取照片详情
- `PUT /api/photos/[id]` - 更新照片信息
- `DELETE /api/photos/[id]` - 删除照片

**分类管理** (1个端点):
- `GET /api/categories` - 获取所有摄影分类

**完整API文档**: 请查看 [docs/API.md](./docs/API.md)
**前后端集成文档**: 请查看 [docs/INTEGRATION.md](./docs/INTEGRATION.md)

### 数据库设计
使用Prisma ORM + PostgreSQL，包含5个核心表：
- `User` - 用户表（认证、个人资料、社交链接）
- `Album` - 专辑表（标题、描述、分类、状态）
- `Photo` - 照片表（多尺寸URL、完整EXIF信息、位置标签）
- `Category` - 分类表（12个摄影分类预设）
- NextAuth表 - Session、Account、VerificationToken

**Schema文件**: `prisma/schema.prisma`

### 生产环境部署要求
需要配置以下服务：
- **数据库**: Vercel Postgres（推荐）或其他PostgreSQL数据库
- **图片CDN**: Cloudinary（免费25GB存储+带宽）
- **实时通信**: Pusher（可选，用于通知功能）

配置环境变量后即可使用完整后端功能。参考 `.env.example` 获取所需环境变量列表。

## 性能优化

- ✅ 图片懒加载 (Next.js Image组件)
- ✅ 代码分割 (Next.js自动处理)
- ✅ 响应式图片 (srcset)
- ✅ 玻璃拟态移动端降级
- ✅ CSS按需生成 (Tailwind CSS JIT)

## 开发计划

### MVP V1.0 (已完成) ✅
**前端开发**:
- [x] 项目初始化和配置
- [x] 基础UI组件库（Button、Input、Card、Modal）
- [x] 布局组件（Navbar、Footer、Container）
- [x] 首页（Hero + 功能展示 + 精选作品）
- [x] 登录/注册页面
- [x] 发现页面（作品浏览 + 分类筛选）
- [x] 个人主页（专辑瀑布流）
- [x] 专辑详情页（作品瀑布流）
- [x] Lightbox大图浏览
- [x] 工作台（专辑管理中心）
- [x] 创建专辑（表单 + 分类选择）
- [x] 编辑专辑（更新信息 + 删除确认）
- [x] 上传照片（批量上传 + 拖拽上传 + 照片信息编辑）
- [x] 完全响应式设计

**后端开发**:
- [x] Prisma ORM + PostgreSQL配置
- [x] NextAuth.js v5认证系统
- [x] 用户注册/登录API
- [x] 用户资料管理API
- [x] 专辑CRUD API（创建、读取、更新、删除）
- [x] 照片上传API（Cloudinary集成）
- [x] 照片管理API（更新、删除）
- [x] 分类查询API
- [x] 完整的API文档

**设计与文档**:
- [x] 完整的设计系统文档（2076行）
- [x] 完整的后端部署方案（Vercel全栈）
- [x] API接口文档
- [x] 环境变量配置模板

### V1.1 (部分完成) ✅
- [x] API工具层集成（api.ts + apiService.ts）
- [x] Toast通知系统
- [x] NextAuth会话管理（SessionProvider）
- [x] 用户注册页面集成（真实API）
- [x] 用户登录页面集成（NextAuth）
- [x] 导航栏用户状态显示
- [ ] 仪表板功能集成
- [ ] 专辑管理功能集成
- [ ] 照片上传功能集成
- [ ] 连接真实数据库（Vercel Postgres）
- [ ] Prisma数据库迁移
- [ ] 种子数据导入
- [ ] Cloudinary图片上传测试
- [ ] 社交功能（点赞、评论、关注）
- [ ] 搜索功能（全局搜索 + 分类筛选）

### V1.2 (未来功能)
- [ ] 版权保护（水印 + 右键禁用）
- [ ] 画廊模式展示
- [ ] 幻灯片播放
- [ ] 管理后台
- [ ] 数据统计分析

## 浏览器兼容

- Chrome (最近2个版本)
- Firefox (最近2个版本)
- Safari (最近2个版本)
- Edge (最近2个版本)
- iOS Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## 📚 完整文档

### 核心文档
- [PRD.md](./PRD.md) - 产品需求文档
- [DESIGN_SPEC.md](./DESIGN_SPEC.md) - UI/UX设计规范（2076行）
- [TECH_SPEC.md](./TECH_SPEC.md) - 技术方案文档
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Vercel部署方案（55KB）
- [API.md](./API.md) - **完整API接口文档** ⭐新增

### 开发文档
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发文档
- [QUICK_START.md](./QUICK_START.md) - 快速启动指南（15分钟环境 + 30分钟部署）
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - 项目总结
- [PROGRESS.md](./PROGRESS.md) - **项目进度报告** ⭐新增

### 完成报告
- [BACKEND_COMPLETED.md](./BACKEND_COMPLETED.md) - **后端开发完成报告** ⭐新增

### 配置文件
- `.env.example` - 环境变量模板（完整配置说明）
- `.env.local` - 本地开发环境变量 ⭐新增
- `prisma/schema.prisma` - 数据库Schema（5个核心表）
- `prisma/seed.ts` - 种子数据

## 🌐 在线访问

**本地开发**: http://localhost:3001

**可访问页面**:
- 首页: http://localhost:3001
- 发现: http://localhost:3001/discover
- 登录: http://localhost:3001/login
- 注册: http://localhost:3001/register
- 示例主页: http://localhost:3001/photographer/john_photographer
- 工作台: http://localhost:3001/dashboard
- 创建专辑: http://localhost:3001/dashboard/albums/create

## 许可

本项目仅用于学习和演示目的。

## 联系方式

如有问题或建议,欢迎提issue或联系开发团队。

---

**Made with ❤️ using Next.js 14 + TypeScript + Tailwind CSS**
