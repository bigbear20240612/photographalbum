# 摄影作品展示平台 - 开发文档

## 项目概览

这是一个基于 Next.js 14 的摄影作品展示平台，采用玻璃拟态设计风格和非洲大地色系，为摄影师提供专业的在线作品集展示服务。

## 技术栈

### 前端核心
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **数据请求**: TanStack Query (React Query)
- **动画**: Framer Motion
- **布局**: react-masonry-css (瀑布流)

### 设计系统
- **色彩**: 非洲大地色系（Terra Cotta主色）
- **字体**: Inter + Playfair Display + 思源字体
- **风格**: 玻璃拟态 (Glassmorphism)

## 项目结构

```
photographalbum/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 首页
│   │   ├── login/                    # 登录页
│   │   ├── register/                 # 注册页
│   │   ├── photographer/[username]/  # 摄影师个人主页
│   │   │   └── album/[albumId]/      # 专辑详情页
│   │   └── globals.css               # 全局样式
│   ├── components/
│   │   ├── ui/                       # 基础UI组件
│   │   │   ├── Button.tsx            # 按钮组件
│   │   │   ├── Input.tsx             # 输入框组件
│   │   │   ├── Card.tsx              # 卡片组件
│   │   │   └── Modal.tsx             # 模态框组件
│   │   ├── layout/                   # 布局组件
│   │   │   ├── Navbar.tsx            # 导航栏
│   │   │   ├── Footer.tsx            # 页脚
│   │   │   └── Container.tsx         # 容器组件
│   │   └── features/                 # 业务组件
│   │       ├── AlbumGrid.tsx         # 专辑瀑布流网格
│   │       ├── PhotoGrid.tsx         # 作品瀑布流网格
│   │       └── Lightbox.tsx          # 大图浏览组件
│   ├── lib/                          # 工具函数
│   │   ├── utils.ts                  # 通用工具函数
│   │   ├── constants.ts              # 常量定义
│   │   └── mockData.ts               # 模拟数据
│   └── types/                        # TypeScript类型定义
│       └── index.ts
├── public/                           # 静态资源
├── tailwind.config.ts                # Tailwind配置
├── tsconfig.json                     # TypeScript配置
├── next.config.js                    # Next.js配置
├── package.json                      # 依赖管理
├── PRD.md                            # 产品需求文档
├── DESIGN_SPEC.md                    # 设计规范文档
└── TECH_SPEC.md                      # 技术方案文档
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 核心功能

### ✅ 已实现功能

1. **首页**
   - Hero区域展示
   - 功能特性介绍
   - 精选作品展示（瀑布流）
   - CTA区域

2. **用户界面**
   - 登录页面
   - 注册页面

3. **个人主页**
   - 个人信息展示
   - 专辑瀑布流展示
   - 响应式布局

4. **专辑详情页**
   - 专辑信息展示
   - 作品瀑布流展示
   - 点击作品打开Lightbox

5. **基础组件库**
   - Button (Primary/Secondary/Text/Danger)
   - Input (Text/Textarea)
   - Card (Album/Photo/Info)
   - Modal (对话框)

6. **布局组件**
   - Navbar (桌面端+移动端)
   - Footer
   - Container

7. **业务组件**
   - AlbumGrid (专辑瀑布流)
   - PhotoGrid (作品瀑布流)
   - Lightbox (大图浏览)

8. **设计系统**
   - 完整的玻璃拟态效果
   - 非洲大地色系配色
   - 流畅的动画效果
   - 响应式设计

### 🚧 待实现功能 (后续迭代)

1. **后端集成**
   - NextAuth.js 认证
   - Prisma + PostgreSQL 数据库
   - API Routes 实现
   - Cloudinary 图片上传

2. **专辑管理**
   - 创建专辑
   - 编辑专辑
   - 删除专辑
   - 拖拽排序

3. **作品管理**
   - 批量上传
   - 编辑信息
   - EXIF提取
   - 照片排序

4. **社交功能**
   - 点赞
   - 评论
   - 关注
   - 收藏

5. **搜索功能**
   - 全局搜索
   - 分类筛选
   - 标签系统

## 设计规范

### 色彩系统

**主色调:**
- Terra Cotta (热土赤陶): `#D4773C`
- Desert Gold (沙漠金): `#C9984C`

**辅助色:**
- Earth Brown (大地棕): `#8B6F47`
- Savanna Green (热带绿): `#7A9B76`
- Sunset Orange (日落橙): `#E8956C`

**中性色:**
- Charcoal (炭灰): `#2C2C2C`
- Warm Gray (暖灰): `#5C5C5C`
- Soft White (柔白): `#FAFAF8`
- Warm Beige (暖米): `#F5F3EF`

### 玻璃拟态效果

```css
/* 浅色玻璃 */
.glass-light {
  background: rgba(250, 250, 248, 0.75);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(224, 221, 214, 0.4);
}

/* 深色玻璃 */
.glass-dark {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 导航栏玻璃 */
.glass-navbar {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  border-bottom: 1px solid rgba(224, 221, 214, 0.3);
}
```

### 响应式断点

- **xs**: < 480px (小屏手机)
- **sm**: 480px - 767px (手机)
- **md**: 768px - 1023px (平板)
- **lg**: 1024px - 1439px (小桌面)
- **xl**: 1440px - 1919px (桌面)
- **2xl**: ≥ 1920px (大屏桌面)

### 瀑布流布局

- **桌面端**: 3列
- **平板**: 2列
- **移动端**: 1列

## 性能优化

### 已实现优化

1. **图片优化**
   - Next.js Image组件
   - 自动WebP格式
   - 懒加载

2. **代码分割**
   - 动态导入
   - 路由级别分割

3. **样式优化**
   - Tailwind CSS JIT
   - CSS压缩

4. **移动端优化**
   - 玻璃效果降级
   - 触摸操作优化

### 建议的优化 (后续)

1. **图片CDN**
   - Cloudinary集成
   - 多尺寸图片
   - 自动压缩

2. **缓存策略**
   - ISR (增量静态再生)
   - SWR数据缓存
   - Service Worker

3. **性能监控**
   - Lighthouse CI
   - Web Vitals
   - 性能指标追踪

## 模拟数据

当前使用模拟数据进行开发，数据定义在 `src/lib/mockData.ts`：

- **用户数据**: 3个示例用户
- **专辑数据**: 12个示例专辑
- **作品数据**: 每个专辑6-12张作品

占位图片使用 `https://picsum.photos/` 服务。

## 开发规范

### 组件命名

- 文件名使用 PascalCase: `Button.tsx`
- 组件名使用 PascalCase: `export default function Button()`
- Props接口命名: `ButtonProps`

### 样式规范

- 优先使用 Tailwind 类名
- 复杂样式使用 CSS Modules 或 `@layer components`
- 遵循设计规范的颜色、字体、间距

### TypeScript规范

- 所有组件定义 Props类型
- 避免使用 `any`
- 使用类型推导

### Git工作流

```bash
# 功能开发
git checkout -b feature/功能名称
git commit -m "feat: 功能描述"

# Bug修复
git checkout -b fix/bug名称
git commit -m "fix: 修复描述"

# 文档更新
git commit -m "docs: 文档描述"
```

## 部署指南

### Vercel部署

1. **连接GitHub仓库**
   - 登录 Vercel
   - Import Git Repository
   - 选择项目仓库

2. **配置环境变量**
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

3. **自动部署**
   - 推送到 `main` 分支自动部署到生产环境
   - 推送到其他分支自动部署预览环境

### 手动部署

```bash
# 构建
npm run build

# 启动
npm start
```

## 故障排查

### 常见问题

**1. 玻璃效果不显示**
- 检查浏览器是否支持 `backdrop-filter`
- 查看 CSS降级方案

**2. 瀑布流布局错乱**
- 检查图片是否加载完成
- 确认 react-masonry-css 配置

**3. 开发服务器启动失败**
```bash
# 清理缓存
rm -rf .next
npm run dev
```

**4. TypeScript错误**
```bash
# 重新生成类型
npm run build
```

## 相关文档

- [PRD.md](./PRD.md) - 产品需求文档
- [DESIGN_SPEC.md](./DESIGN_SPEC.md) - 设计规范文档
- [TECH_SPEC.md](./TECH_SPEC.md) - 技术方案文档
- [README.md](./README.md) - 项目说明

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 推送到分支
5. 创建 Pull Request

## 联系方式

- 项目地址: https://github.com/your-username/photographalbum
- 问题反馈: https://github.com/your-username/photographalbum/issues

## 许可证

MIT License

---

**文档更新日期**: 2025-10-08
**项目版本**: MVP V1.0
