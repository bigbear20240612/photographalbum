# 摄影作品展示平台 - UI/UX设计规范文档

**文档版本：** V1.0
**创建日期：** 2025-10-08
**设计负责人：** UI/UX设计团队
**目标版本：** MVP V1.0

---

## 1. 设计理念

### 1.1 核心设计原则

**设计哲学：**
本平台将玻璃拟态（Glassmorphism）的现代设计语言与非洲大地的自然色调相结合，创造出一种既具有科技感又温暖自然的视觉体验。玻璃拟态的透明感和模糊效果为界面带来轻盈的浮动感，而非洲大地色系则注入温暖和力量，两者结合形成独特的品牌视觉识别。

**核心原则：**

1. **作品至上（Content First）**
   - 极简的界面设计，让摄影作品成为视觉焦点
   - 玻璃拟态效果用于UI元素，不干扰作品展示
   - 大量留白，给予作品充足的呼吸空间

2. **沉浸式体验（Immersive Experience）**
   - 流畅的动画过渡，营造画廊般的浏览体验
   - 全屏大图模式，提供最佳的作品欣赏环境
   - 直觉化的交互，减少认知负担

3. **自然与科技的平衡（Nature Meets Technology）**
   - 非洲大地色系带来温暖、自然的情感连接
   - 玻璃拟态效果展现现代、专业的科技感
   - 柔和的模糊效果与清晰的作品形成对比

4. **响应式与适应性（Responsive & Adaptive）**
   - 设计系统适配所有设备尺寸
   - 触摸优先的移动端体验
   - 性能优化，确保流畅体验

### 1.2 设计目标

**用户体验目标：**
- **摄影师：** 感受到专业、高端、有品质的展示平台，激发创作热情
- **观众：** 享受画廊级的沉浸式浏览体验，专注于作品欣赏
- **整体：** 建立独特的品牌视觉识别，区别于竞品

**情感目标：**
- 温暖而专业
- 现代而自然
- 轻盈而有力量
- 简约而不简单

### 1.3 设计关键词

1. **轻盈（Light）** - 玻璃拟态的浮动感
2. **温暖（Warm）** - 非洲大地色系的温暖基调
3. **纯粹（Pure）** - 极简设计突出作品
4. **流畅（Fluid）** - 优雅的动效和过渡
5. **沉浸（Immersive）** - 画廊级的浏览体验

---

## 2. 色彩系统

### 2.1 主色调（Primary Colors）

#### 主色 1：热土赤陶（Terra Cotta）
- **名称：** Terra Cotta
- **HEX：** `#D4773C`
- **RGB：** `rgb(212, 119, 60)`
- **使用场景：**
  - 主要CTA按钮（上传、创建、保存）
  - 重要链接和高亮元素
  - 品牌标识和Logo
  - Hover状态的强调色

#### 主色 2：沙漠金（Desert Gold）
- **名称：** Desert Gold
- **HEX：** `#C9984C`
- **RGB：** `rgb(201, 152, 76)`
- **使用场景：**
  - 次要CTA按钮
  - 选中状态的标签和徽章
  - 装饰性图标
  - 进度指示器

### 2.2 辅助色（Secondary Colors）

#### 辅助色 1：大地棕（Earth Brown）
- **名称：** Earth Brown
- **HEX：** `#8B6F47`
- **RGB：** `rgb(139, 111, 71)`
- **使用场景：**
  - 卡片边框
  - 分隔线
  - 标签边框
  - 次要文字

#### 辅助色 2：热带绿（Savanna Green）
- **名称：** Savanna Green
- **HEX：** `#7A9B76`
- **RGB：** `rgb(122, 155, 118)`
- **使用场景：**
  - 成功状态提示
  - 完成状态徽章
  - 装饰性元素
  - 专辑分类标签

#### 辅助色 3：日落橙（Sunset Orange）
- **名称：** Sunset Orange
- **HEX：** `#E8956C`
- **RGB：** `rgb(232, 149, 108)`
- **使用场景：**
  - 警告提示
  - 未读消息标识
  - Hover状态的次要元素

### 2.3 强调色（Accent Color）

#### 强调色：琥珀金（Amber Gold）
- **名称：** Amber Gold
- **HEX：** `#F4A460`
- **RGB：** `rgb(244, 164, 96)`
- **使用场景：**
  - 主要CTA按钮的渐变辅助色
  - 重要提示和通知
  - 活跃状态指示
  - 链接Hover效果

### 2.4 中性色（Neutral Colors）

#### 文字色系

**主要文字色：**
- **名称：** Charcoal
- **HEX：** `#2C2C2C`
- **RGB：** `rgb(44, 44, 44)`
- **使用场景：** 标题、重要内容

**次要文字色：**
- **名称：** Warm Gray
- **HEX：** `#5C5C5C`
- **RGB：** `rgb(92, 92, 92)`
- **使用场景：** 正文、描述文字

**辅助文字色：**
- **名称：** Light Gray
- **HEX：** `#9C9C9C`
- **RGB：** `rgb(156, 156, 156)`
- **使用场景：** 占位符、次要信息

**禁用文字色：**
- **名称：** Disabled Gray
- **HEX：** `#BDBDBD`
- **RGB：** `rgb(189, 189, 189)`
- **使用场景：** 禁用状态文字

#### 背景色系

**主背景色：**
- **名称：** Soft White
- **HEX：** `#FAFAF8`
- **RGB：** `rgb(250, 250, 248)`
- **使用场景：** 页面主背景

**次背景色：**
- **名称：** Warm Beige
- **HEX：** `#F5F3EF`
- **RGB：** `rgb(245, 243, 239)`
- **使用场景：** 卡片背景、分区背景

**深色背景：**
- **名称：** Deep Charcoal
- **HEX：** `#1A1A1A`
- **RGB：** `rgb(26, 26, 26)`
- **使用场景：** 大图浏览模式背景、Modal遮罩

#### 边框和分隔线

**主边框色：**
- **名称：** Border Light
- **HEX：** `#E0DDD6`
- **RGB：** `rgb(224, 221, 214)`
- **使用场景：** 卡片边框、输入框边框

**次边框色：**
- **名称：** Border Medium
- **HEX：** `#D0CCC3`
- **RGB：** `rgb(208, 204, 195)`
- **使用场景：** 分隔线、表格边框

### 2.5 语义色（Semantic Colors）

#### 成功（Success）
- **名称：** Success Green
- **HEX：** `#7A9B76`
- **RGB：** `rgb(122, 155, 118)`
- **使用场景：** 成功提示、完成状态

#### 警告（Warning）
- **名称：** Warning Orange
- **HEX：** `#E8956C`
- **RGB：** `rgb(232, 149, 108)`
- **使用场景：** 警告提示、需要注意的信息

#### 错误（Error）
- **名称：** Error Red
- **HEX：** `#D4573C`
- **RGB：** `rgb(212, 87, 60)`
- **使用场景：** 错误提示、删除操作

#### 信息（Info）
- **名称：** Info Blue
- **HEX：** `#6B8FA3`
- **RGB：** `rgb(107, 143, 163)`
- **使用场景：** 信息提示、帮助说明

### 2.6 玻璃拟态配色

#### 浅色玻璃效果（用于浅色背景）
- **背景色：** `rgba(255, 255, 255, 0.7)` - 白色半透明
- **边框色：** `rgba(255, 255, 255, 0.3)` - 白色更透明
- **阴影色：** `rgba(139, 111, 71, 0.1)` - 大地棕浅阴影
- **模糊度：** `backdrop-filter: blur(10px)`
- **使用场景：** 导航栏、卡片、对话框

#### 深色玻璃效果（用于深色背景或图片上）
- **背景色：** `rgba(26, 26, 26, 0.6)` - 深色半透明
- **边框色：** `rgba(255, 255, 255, 0.1)` - 白色细边框
- **阴影色：** `rgba(0, 0, 0, 0.3)` - 黑色阴影
- **模糊度：** `backdrop-filter: blur(12px)`
- **使用场景：** 大图浏览信息面板、图片上的文字容器

#### 暖色玻璃效果（品牌色调）
- **背景色：** `rgba(245, 243, 239, 0.8)` - 暖米色半透明
- **边框色：** `rgba(212, 119, 60, 0.2)` - 热土赤陶浅边框
- **阴影色：** `rgba(212, 119, 60, 0.15)` - 热土赤陶浅阴影
- **模糊度：** `backdrop-filter: blur(8px)`
- **使用场景：** 专辑封面卡片、特殊提示框

### 2.7 渐变色（Gradients）

#### 主渐变（Primary Gradient）
```css
background: linear-gradient(135deg, #D4773C 0%, #F4A460 100%);
```
- **使用场景：** 主要CTA按钮、Logo装饰

#### 次渐变（Secondary Gradient）
```css
background: linear-gradient(135deg, #C9984C 0%, #E8956C 100%);
```
- **使用场景：** 次要按钮、标签装饰

#### 背景渐变（Background Gradient）
```css
background: linear-gradient(180deg, #FAFAF8 0%, #F5F3EF 100%);
```
- **使用场景：** 页面背景、大区域背景

#### 遮罩渐变（Overlay Gradient）
```css
background: linear-gradient(180deg, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 0.8) 100%);
```
- **使用场景：** 图片上的文字遮罩、卡片Hover遮罩

---

## 3. 字体系统

### 3.1 字体选择

#### 英文字体
**主字体：Inter**
- **来源：** Google Fonts
- **特点：** 现代无衬线字体，清晰易读，适合界面设计
- **备用字体：** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**展示字体（标题）：Playfair Display**
- **来源：** Google Fonts
- **特点：** 优雅的衬线字体，适合大标题和品牌名称
- **使用场景：** Logo、大标题、专辑标题
- **备用字体：** `Georgia, serif`

#### 中文字体
**主字体：思源黑体（Noto Sans SC）**
- **来源：** Google Fonts
- **特点：** 现代无衬线字体，中英文协调性好
- **备用字体：** `-apple-system, "PingFang SC", "Microsoft YaHei", "微软雅黑", sans-serif`

**展示字体（标题）：思源宋体（Noto Serif SC）**
- **来源：** Google Fonts
- **特点：** 优雅的宋体，适合大标题
- **使用场景：** 专辑标题、个人简介标题
- **备用字体：** `"STSong", "SimSun", "宋体", serif`

### 3.2 字号层级

| 层级 | 名称 | 字号（Desktop） | 字号（Mobile） | 行高 | 字重 | 使用场景 |
|-----|------|----------------|----------------|------|------|---------|
| H1 | 主标题 | 48px (3rem) | 36px (2.25rem) | 1.2 | 600 | 页面主标题、品牌名称 |
| H2 | 次标题 | 36px (2.25rem) | 28px (1.75rem) | 1.3 | 600 | 区块标题、专辑标题 |
| H3 | 小标题 | 28px (1.75rem) | 24px (1.5rem) | 1.4 | 500 | 卡片标题、子区块标题 |
| H4 | 段落标题 | 24px (1.5rem) | 20px (1.25rem) | 1.4 | 500 | 小节标题、表单标题 |
| H5 | 次段落标题 | 20px (1.25rem) | 18px (1.125rem) | 1.5 | 500 | 次要标题 |
| H6 | 小节标题 | 18px (1.125rem) | 16px (1rem) | 1.5 | 500 | 小标题、分类标题 |
| Body Large | 正文大 | 18px (1.125rem) | 16px (1rem) | 1.6 | 400 | 重要正文、引言 |
| Body | 正文 | 16px (1rem) | 15px (0.9375rem) | 1.6 | 400 | 主要内容、描述文字 |
| Body Small | 正文小 | 14px (0.875rem) | 14px (0.875rem) | 1.6 | 400 | 次要内容、辅助文字 |
| Caption | 说明文字 | 12px (0.75rem) | 12px (0.75rem) | 1.5 | 400 | 图片说明、时间戳 |
| Overline | 上标文字 | 10px (0.625rem) | 10px (0.625rem) | 1.5 | 600 | 分类标签、徽章文字 |
| Button Large | 大按钮 | 18px (1.125rem) | 16px (1rem) | 1.2 | 500 | 主要CTA按钮 |
| Button | 按钮 | 16px (1rem) | 15px (0.9375rem) | 1.2 | 500 | 普通按钮 |
| Button Small | 小按钮 | 14px (0.875rem) | 14px (0.875rem) | 1.2 | 500 | 次要按钮、文字按钮 |

### 3.3 字重（Font Weight）

| 字重值 | 名称 | 使用场景 |
|-------|------|---------|
| 300 | Light | 大标题装饰、引言（谨慎使用） |
| 400 | Regular | 正文、描述、输入框文字 |
| 500 | Medium | 小标题、按钮、导航链接 |
| 600 | Semibold | 大标题、重要标题 |
| 700 | Bold | 强调文字、品牌名称（谨慎使用） |

### 3.4 字体样式规范

#### 标题样式
```css
h1, .h1 {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 3rem; /* 48px */
  font-weight: 600;
  line-height: 1.2;
  color: #2C2C2C;
  letter-spacing: -0.02em;
}

h2, .h2 {
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
  font-size: 2.25rem; /* 36px */
  font-weight: 600;
  line-height: 1.3;
  color: #2C2C2C;
  letter-spacing: -0.01em;
}

h3, .h3 {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-size: 1.75rem; /* 28px */
  font-weight: 500;
  line-height: 1.4;
  color: #2C2C2C;
}
```

#### 正文样式
```css
body, .body {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-size: 1rem; /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: #5C5C5C;
}

.body-large {
  font-size: 1.125rem; /* 18px */
  line-height: 1.6;
}

.body-small {
  font-size: 0.875rem; /* 14px */
  line-height: 1.6;
}
```

---

## 4. 玻璃拟态设计规范

### 4.1 核心视觉效果

玻璃拟态（Glassmorphism）是本平台的核心设计语言，通过半透明背景、模糊效果和细腻边框创造出轻盈、现代的视觉效果。

#### 基本原则
1. **透明度分层：** 不同层级使用不同的透明度，创造视觉层次
2. **模糊适度：** 模糊度要足够看清背景，但不能影响前景内容的可读性
3. **边框细腻：** 使用半透明的细边框增强玻璃质感
4. **阴影柔和：** 使用柔和的阴影增强浮动感
5. **性能优先：** 谨慎使用模糊效果，避免过度影响性能

### 4.2 玻璃效果参数

#### 层级1：导航栏/顶部栏（高透明度）
```css
.glass-navbar {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border-bottom: 1px solid rgba(224, 221, 214, 0.3);
  box-shadow: 0 2px 12px rgba(139, 111, 71, 0.08);
}
```

#### 层级2：卡片/面板（中透明度）
```css
.glass-card {
  background: rgba(250, 250, 248, 0.75);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(224, 221, 214, 0.4);
  border-radius: 16px;
  box-shadow:
    0 4px 16px rgba(139, 111, 71, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
```

#### 层级3：对话框/Modal（深色背景）
```css
.glass-modal {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}
```

#### 层级4：按钮（品牌色玻璃效果）
```css
.glass-button {
  background: linear-gradient(135deg,
    rgba(212, 119, 60, 0.9) 0%,
    rgba(244, 164, 96, 0.9) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow:
    0 4px 12px rgba(212, 119, 60, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
```

#### 层级5：信息面板（图片上的浮动面板）
```css
.glass-info-panel {
  background: rgba(245, 243, 239, 0.85);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(224, 221, 214, 0.5);
  border-radius: 16px;
  box-shadow:
    0 8px 24px rgba(139, 111, 71, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.4) inset;
}
```

### 4.3 模糊效果参数表

| 使用场景 | 模糊度 | 饱和度 | 透明度 | 性能影响 |
|---------|--------|--------|--------|---------|
| 导航栏 | 10px | 180% | 0.7 | 低 |
| 卡片 | 12px | 160% | 0.75 | 中 |
| 对话框 | 12px | 150% | 0.6 | 中 |
| 浮动面板 | 16px | 180% | 0.85 | 高 |
| 按钮 | 8px | 默认 | 0.9 | 低 |

### 4.4 边框规范

#### 玻璃边框样式
```css
/* 浅色边框（用于浅色玻璃） */
.glass-border-light {
  border: 1px solid rgba(224, 221, 214, 0.4);
  /* 内部高光边框 */
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* 深色边框（用于深色玻璃） */
.glass-border-dark {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

/* 品牌色边框（用于品牌色玻璃） */
.glass-border-brand {
  border: 1px solid rgba(212, 119, 60, 0.2);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}
```

### 4.5 阴影规范

#### 阴影层级
```css
/* 浅阴影 - 用于卡片、按钮 */
.shadow-sm {
  box-shadow: 0 2px 8px rgba(139, 111, 71, 0.06);
}

/* 中阴影 - 用于Hover状态、弹出卡片 */
.shadow-md {
  box-shadow:
    0 4px 16px rgba(139, 111, 71, 0.08),
    0 2px 8px rgba(139, 111, 71, 0.05);
}

/* 深阴影 - 用于Modal、对话框 */
.shadow-lg {
  box-shadow:
    0 8px 32px rgba(139, 111, 71, 0.12),
    0 4px 16px rgba(139, 111, 71, 0.08);
}

/* 浮动阴影 - 用于浮动元素、导航栏 */
.shadow-float {
  box-shadow:
    0 4px 20px rgba(139, 111, 71, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

/* 品牌色阴影 - 用于主要按钮 */
.shadow-brand {
  box-shadow:
    0 4px 12px rgba(212, 119, 60, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
```

### 4.6 层级关系

玻璃拟态效果通过透明度和模糊度的组合创造视觉层级：

**视觉层级从低到高：**
1. **背景层（Z-index: 0）** - 页面背景、图片背景
2. **内容层（Z-index: 1）** - 作品图片、文字内容
3. **卡片层（Z-index: 10）** - 专辑卡片、作品卡片
4. **浮动层（Z-index: 100）** - 导航栏、工具栏
5. **覆盖层（Z-index: 1000）** - Modal遮罩
6. **对话框层（Z-index: 1001）** - 对话框、信息面板
7. **提示层（Z-index: 2000）** - Toast通知、Tooltip

### 4.7 适用组件

**适合使用玻璃拟态的组件：**
- ✅ 导航栏（半透明，显示背景图）
- ✅ 卡片（专辑卡片、作品信息卡片）
- ✅ 对话框/Modal（深色或浅色玻璃）
- ✅ 信息面板（大图浏览模式的信息栏）
- ✅ 工具栏（编辑工具、操作按钮组）
- ✅ 按钮（主要CTA按钮）
- ✅ 下拉菜单
- ✅ 搜索框

**不适合使用玻璃拟态的组件：**
- ❌ 作品图片本身（保持纯净）
- ❌ 大面积文字内容区（影响可读性）
- ❌ 表单输入框（使用实心背景更清晰）
- ❌ 移动端小屏幕（性能考虑）

### 4.8 性能优化建议

1. **避免过度使用：** 每个页面最多使用3-5个玻璃效果元素
2. **移动端降级：** 移动设备可使用实心背景替代，减少性能消耗
3. **延迟加载：** 对非关键区域的玻璃效果延迟加载
4. **浏览器兼容：** 提供不支持 `backdrop-filter` 的浏览器的降级方案

```css
/* 浏览器降级方案 */
.glass-card {
  background: rgba(250, 250, 248, 0.95); /* 降级：使用更高透明度 */
  backdrop-filter: blur(12px);
}

@supports not (backdrop-filter: blur(12px)) {
  .glass-card {
    background: rgba(250, 250, 248, 1); /* 不支持模糊时使用实心背景 */
  }
}
```

---

## 5. 布局系统

### 5.1 栅格系统

#### 桌面端栅格（Desktop: > 1024px）
- **容器最大宽度：** 1440px
- **列数：** 12列
- **列间距（Gutter）：** 24px
- **左右边距（Margin）：** 48px

#### 平板栅格（Tablet: 768px - 1024px）
- **容器最大宽度：** 100%
- **列数：** 8列
- **列间距（Gutter）：** 20px
- **左右边距（Margin）：** 32px

#### 移动端栅格（Mobile: < 768px）
- **容器最大宽度：** 100%
- **列数：** 4列
- **列间距（Gutter）：** 16px
- **左右边距（Margin）：** 16px

### 5.2 断点设置（Breakpoints）

| 断点名称 | 屏幕宽度 | 设备类型 | 使用场景 |
|---------|---------|---------|---------|
| xs | < 480px | 小屏手机 | iPhone SE, 小屏安卓 |
| sm | 480px - 767px | 手机 | iPhone, 标准手机 |
| md | 768px - 1023px | 平板 | iPad, 平板 |
| lg | 1024px - 1439px | 小桌面 | 笔记本电脑 |
| xl | 1440px - 1919px | 桌面 | 台式机、大屏笔记本 |
| 2xl | ≥ 1920px | 大屏桌面 | 2K、4K显示器 |

### 5.3 间距系统（Spacing Scale）

采用8px基础单位的间距系统：

| 名称 | 数值 | 使用场景 |
|------|------|---------|
| xs | 4px | 紧密元素间距、图标与文字间距 |
| sm | 8px | 小间距、标签内边距 |
| md | 16px | 标准间距、卡片内边距、段落间距 |
| lg | 24px | 大间距、区块间距 |
| xl | 32px | 超大间距、章节间距 |
| 2xl | 48px | 巨大间距、页面区块间距 |
| 3xl | 64px | 特大间距、顶部区域间距 |
| 4xl | 96px | 页面级间距 |

#### Spacing CSS变量
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;
}
```

### 5.4 瀑布流布局（Masonry Layout）

瀑布流是本平台的核心布局方式，用于展示专辑和作品。

#### 专辑列表瀑布流
- **桌面端：** 3列或4列（根据容器宽度）
- **平板：** 2列
- **手机：** 1列
- **列间距：** 24px（桌面）/ 20px（平板）/ 16px（手机）
- **行间距：** 24px（桌面）/ 20px（平板）/ 16px（手机）

#### 作品列表瀑布流
- **桌面端：** 3列
- **平板：** 2列
- **手机：** 1列
- **列间距：** 20px（桌面）/ 16px（平板）/ 12px（手机）
- **行间距：** 20px（桌面）/ 16px（平板）/ 12px（手机）

#### 瀑布流实现策略
```css
/* 使用CSS Grid实现响应式瀑布流 */
.masonry-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-rows: 10px; /* 小单位行高，方便计算 */
}

.masonry-item {
  grid-row-end: span var(--row-span); /* 根据图片高度计算 */
}
```

### 5.5 容器规范

#### 页面容器
```css
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
}

@media (max-width: 1024px) {
  .container {
    padding: 0 32px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

#### 内容宽度限制
- **文字内容：** 最大宽度 720px（保证可读性）
- **表单区域：** 最大宽度 600px
- **卡片列表：** 最大宽度 1200px

---

## 6. 组件设计规范

### 6.1 按钮（Button）

#### Primary Button（主要按钮）
**视觉样式：**
```css
.btn-primary {
  background: linear-gradient(135deg, #D4773C 0%, #F4A460 100%);
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 4px 12px rgba(212, 119, 60, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 16px rgba(212, 119, 60, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow:
    0 2px 8px rgba(212, 119, 60, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

**尺寸规格：**
- **Large：** `padding: 16px 32px; font-size: 18px; border-radius: 14px;`
- **Medium（默认）：** `padding: 12px 24px; font-size: 16px; border-radius: 12px;`
- **Small：** `padding: 8px 16px; font-size: 14px; border-radius: 10px;`

**使用场景：**
- 上传照片
- 创建专辑
- 保存/提交表单
- 登录/注册

#### Secondary Button（次要按钮）
**视觉样式：**
```css
.btn-secondary {
  background: rgba(250, 250, 248, 0.9);
  color: #8B6F47;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1.5px solid #E0DDD6;
  box-shadow: 0 2px 8px rgba(139, 111, 71, 0.06);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-secondary:hover {
  background: rgba(245, 243, 239, 1);
  border-color: #D4773C;
  color: #D4773C;
  box-shadow: 0 4px 12px rgba(139, 111, 71, 0.1);
}
```

**使用场景：**
- 取消操作
- 返回/关闭
- 次要操作

#### Text Button（文字按钮）
**视觉样式：**
```css
.btn-text {
  background: transparent;
  color: #D4773C;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border: none;
  transition: all 0.2s ease;
}

.btn-text:hover {
  color: #F4A460;
  background: rgba(212, 119, 60, 0.08);
  border-radius: 8px;
}
```

**使用场景：**
- 导航链接
- 次要操作链接
- "了解更多"类链接

#### Danger Button（危险按钮）
**视觉样式：**
```css
.btn-danger {
  background: linear-gradient(135deg, #D4573C 0%, #E8956C 100%);
  color: #FFFFFF;
  /* 其他样式同 Primary Button */
}
```

**使用场景：**
- 删除专辑
- 删除照片
- 不可逆操作

### 6.2 输入框（Input & Textarea）

#### Text Input（文本输入框）
**视觉样式：**
```css
.input-text {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 400;
  color: #2C2C2C;
  background: #FFFFFF;
  border: 1.5px solid #E0DDD6;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.input-text::placeholder {
  color: #BDBDBD;
}

.input-text:focus {
  outline: none;
  border-color: #D4773C;
  box-shadow: 0 0 0 3px rgba(212, 119, 60, 0.1);
}

.input-text:disabled {
  background: #F5F3EF;
  color: #BDBDBD;
  cursor: not-allowed;
}

.input-text.error {
  border-color: #D4573C;
}
```

**尺寸规格：**
- **Large：** `padding: 14px 18px; font-size: 18px;`
- **Medium（默认）：** `padding: 12px 16px; font-size: 16px;`
- **Small：** `padding: 10px 14px; font-size: 14px;`

#### Textarea（文本域）
```css
.textarea {
  /* 基础样式同 input-text */
  min-height: 120px;
  resize: vertical;
  line-height: 1.6;
}
```

#### 表单字段结构
```html
<div class="form-field">
  <label class="form-label">标题</label>
  <input type="text" class="input-text" placeholder="请输入标题">
  <p class="form-helper-text">最多50个字符</p>
  <p class="form-error-text">标题不能为空</p>
</div>
```

```css
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #5C5C5C;
  margin-bottom: 8px;
}

.form-helper-text {
  font-size: 12px;
  color: #9C9C9C;
  margin-top: 4px;
}

.form-error-text {
  font-size: 12px;
  color: #D4573C;
  margin-top: 4px;
  display: none;
}

.form-field.error .form-error-text {
  display: block;
}
```

### 6.3 卡片（Card）

#### 专辑卡片（Album Card）
**结构：**
- 封面图片（3:2或1:1比例）
- 玻璃拟态标题遮罩层
- 专辑标题
- 作品数量标识
- Hover悬浮效果

**视觉样式：**
```css
.album-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0 2px 12px rgba(139, 111, 71, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.album-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(139, 111, 71, 0.15);
}

.album-card__image {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.album-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(180deg,
    rgba(26, 26, 26, 0) 0%,
    rgba(26, 26, 26, 0.8) 100%);
  backdrop-filter: blur(8px);
}

.album-card__title {
  font-size: 20px;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 4px;
}

.album-card__count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* Hover状态：显示"查看专辑"按钮 */
.album-card__hover-action {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover .album-card__hover-action {
  opacity: 1;
}
```

#### 作品卡片（Photo Card）
**结构：**
- 作品图片（保持原始比例）
- 可选：玻璃拟态信息层
- Hover放大效果

**视觉样式：**
```css
.photo-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(139, 111, 71, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.photo-card:hover {
  box-shadow: 0 4px 16px rgba(139, 111, 71, 0.12);
}

.photo-card__image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-card:hover .photo-card__image {
  transform: scale(1.05);
}

/* 可选：显示作品标题 */
.photo-card__title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: rgba(245, 243, 239, 0.9);
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-card__title-overlay {
  opacity: 1;
}
```

#### 信息卡片（Info Card）
用于个人信息、专辑信息等。

**视觉样式：**
```css
.info-card {
  background: rgba(250, 250, 248, 0.75);
  backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(224, 221, 214, 0.4);
  border-radius: 16px;
  padding: 24px;
  box-shadow:
    0 4px 16px rgba(139, 111, 71, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
}
```

### 6.4 导航栏（Navbar）

#### 顶部导航栏
**视觉样式：**
```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px) saturate(180%);
  border-bottom: 1px solid rgba(224, 221, 214, 0.3);
  box-shadow: 0 2px 12px rgba(139, 111, 71, 0.08);
  transition: all 0.3s ease;
}

.navbar--scrolled {
  background: rgba(250, 250, 248, 0.9);
  backdrop-filter: blur(12px) saturate(180%);
  box-shadow: 0 4px 16px rgba(139, 111, 71, 0.12);
}

.navbar__container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 48px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 600;
  color: #D4773C;
}

.navbar__menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.navbar__link {
  font-size: 16px;
  font-weight: 500;
  color: #5C5C5C;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar__link:hover,
.navbar__link.active {
  color: #D4773C;
}
```

#### 移动端导航（底部导航或汉堡菜单）
**移动端采用底部固定导航：**
```css
.mobile-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px) saturate(180%);
  border-top: 1px solid rgba(224, 221, 214, 0.3);
  box-shadow: 0 -2px 12px rgba(139, 111, 71, 0.08);
  padding: 8px 0;
  display: none;
}

@media (max-width: 768px) {
  .mobile-navbar {
    display: block;
  }
}

.mobile-navbar__menu {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.mobile-navbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  color: #9C9C9C;
  transition: color 0.2s ease;
}

.mobile-navbar__item.active {
  color: #D4773C;
}

.mobile-navbar__icon {
  font-size: 24px;
}

.mobile-navbar__label {
  font-size: 12px;
  font-weight: 500;
}
```

### 6.5 模态框（Modal）

#### 对话框/弹窗
**视觉样式：**
```css
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.3s ease;
}

/* 对话框 */
.modal {
  position: relative;
  max-width: 600px;
  width: 100%;
  background: rgba(250, 250, 248, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(224, 221, 214, 0.5);
  border-radius: 20px;
  box-shadow:
    0 8px 32px rgba(139, 111, 71, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal__header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(224, 221, 214, 0.3);
}

.modal__title {
  font-size: 24px;
  font-weight: 600;
  color: #2C2C2C;
}

.modal__close {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #9C9C9C;
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal__close:hover {
  color: #D4773C;
}

.modal__body {
  padding: 24px;
}

.modal__footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 6.6 上传组件（Upload Area）

#### 拖拽上传区域
**视觉样式：**
```css
.upload-area {
  width: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(250, 250, 248, 0.6);
  border: 2px dashed #D0CCC3;
  border-radius: 16px;
  padding: 48px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover,
.upload-area.drag-over {
  background: rgba(245, 243, 239, 0.8);
  border-color: #D4773C;
  box-shadow: 0 4px 16px rgba(212, 119, 60, 0.1);
}

.upload-area__icon {
  font-size: 64px;
  color: #D4773C;
  margin-bottom: 16px;
}

.upload-area__title {
  font-size: 18px;
  font-weight: 500;
  color: #2C2C2C;
  margin-bottom: 8px;
}

.upload-area__subtitle {
  font-size: 14px;
  color: #9C9C9C;
}
```

#### 上传进度条
```css
.upload-progress {
  width: 100%;
  background: rgba(245, 243, 239, 0.9);
  border: 1px solid #E0DDD6;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.upload-progress__item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.upload-progress__bar {
  flex: 1;
  height: 6px;
  background: #E0DDD6;
  border-radius: 3px;
  overflow: hidden;
}

.upload-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #D4773C 0%, #F4A460 100%);
  transition: width 0.3s ease;
}

.upload-progress__percentage {
  font-size: 14px;
  font-weight: 500;
  color: #8B6F47;
  min-width: 40px;
  text-align: right;
}
```

---

## 7. 动效设计

### 7.1 动画原则

**动效哲学：**
动画应该是有意义的、流畅的、自然的。每一个动效都应该服务于用户体验，而不是为了炫技。动画应该像非洲大地上的微风一样自然、轻盈。

**核心原则：**
1. **有目的性：** 动画必须有明确的功能目的（引导注意、展示状态、提供反馈）
2. **适度克制：** 避免过度动画，保持简洁和专业
3. **性能优先：** 使用GPU加速的属性（transform、opacity），避免layout和paint
4. **一致性：** 同类元素使用统一的动画规范

### 7.2 过渡动画（Transitions）

#### 页面切换动画
**淡入淡出（Fade）：**
```css
.page-transition-fade-enter {
  opacity: 0;
}

.page-transition-fade-enter-active {
  opacity: 1;
  transition: opacity 0.4s ease-out;
}

.page-transition-fade-exit {
  opacity: 1;
}

.page-transition-fade-exit-active {
  opacity: 0;
  transition: opacity 0.3s ease-in;
}
```

**滑动（Slide）：**
```css
.page-transition-slide-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-transition-slide-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-transition-slide-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-transition-slide-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 推荐的过渡时长
| 元素类型 | 时长 | Easing函数 | 使用场景 |
|---------|------|-----------|---------|
| 小元素（按钮、图标） | 200ms | ease-out | Hover、点击反馈 |
| 中元素（卡片、面板） | 300ms | cubic-bezier(0.4, 0, 0.2, 1) | 展开、收起 |
| 大元素（Modal、页面） | 400ms | cubic-bezier(0.4, 0, 0.2, 1) | 打开、关闭 |
| 滚动效果 | 600ms | ease-out | 平滑滚动 |

### 7.3 微交互（Micro-interactions）

#### 按钮Hover
```css
.button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(212, 119, 60, 0.4);
}

.button:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}
```

#### 卡片Hover
```css
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(139, 111, 71, 0.15);
}

.card:hover .card__image {
  transform: scale(1.05);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 输入框焦点
```css
.input {
  border: 1.5px solid #E0DDD6;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #D4773C;
  box-shadow: 0 0 0 3px rgba(212, 119, 60, 0.1);
}
```

#### 链接Hover
```css
.link {
  color: #D4773C;
  position: relative;
  transition: color 0.2s ease;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #F4A460;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}
```

### 7.4 加载动画（Loading States）

#### 加载指示器（Spinner）
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 119, 60, 0.2);
  border-top-color: #D4773C;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### 骨架屏（Skeleton）
```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(224, 221, 214, 0.4) 0%,
    rgba(224, 221, 214, 0.6) 50%,
    rgba(224, 221, 214, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### 进度条动画
```css
.progress-bar {
  overflow: hidden;
  background: #E0DDD6;
  border-radius: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #D4773C 0%, #F4A460 100%);
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progressShine 1.5s ease-in-out infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 7.5 大图浏览动画

#### 大图打开动画
```css
.lightbox-overlay {
  animation: fadeIn 0.3s ease;
}

.lightbox-image {
  animation: zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

#### 图片切换动画（淡入淡出+滑动）
```css
.lightbox-image-transition-enter {
  opacity: 0;
  transform: translateX(30px);
}

.lightbox-image-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-image-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.lightbox-image-transition-exit-active {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### 信息面板滑入/滑出
```css
.info-panel {
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-panel.open {
  transform: translateX(0);
}
```

### 7.6 推荐的Easing函数

| Easing函数 | CSS值 | 使用场景 |
|-----------|-------|---------|
| Ease Out | `cubic-bezier(0, 0, 0.2, 1)` | 元素进入、淡入 |
| Ease In | `cubic-bezier(0.4, 0, 1, 1)` | 元素退出、淡出 |
| Ease In Out | `cubic-bezier(0.4, 0, 0.2, 1)` | 通用过渡、页面切换 |
| Sharp | `cubic-bezier(0.4, 0, 0.6, 1)` | 快速反馈、点击 |
| Standard | `cubic-bezier(0.2, 0, 0, 1)` | 标准动画 |
| Bounce | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | 特殊强调（谨慎使用） |

---

## 8. 响应式设计策略

### 8.1 移动端适配原则

**设计原则：**
1. **触摸优先：** 所有交互元素都要考虑触摸操作
2. **内容优先：** 移动端隐藏非关键功能，突出核心内容
3. **性能优先：** 移动端减少动画和玻璃效果，提升性能
4. **单手操作：** 重要操作放在屏幕下半部分

### 8.2 移动端布局调整

#### 个人主页（移动端）
- **专辑瀑布流：** 单列布局，卡片全宽
- **个人信息：** 头像居中，简介折叠显示
- **导航：** 底部固定导航栏

#### 专辑详情页（移动端）
- **作品瀑布流：** 单列布局
- **专辑信息：** 简化显示，可折叠
- **返回按钮：** 左上角大按钮（48x48px）

#### 大图浏览模式（移动端）
- **全屏展示：** 图片填充屏幕
- **左右滑动切换：** 手势滑动
- **信息面板：** 从底部向上滑出（抽屉式）
- **关闭：** 向下滑动关闭

### 8.3 触摸交互

#### 最小触摸区域
- **最小尺寸：** 44x44px（Apple HIG标准）
- **推荐尺寸：** 48x48px（Material Design标准）
- **安全间距：** 触摸元素之间至少8px间距

#### 手势操作
| 手势 | 操作 | 使用场景 |
|-----|------|---------|
| 点击（Tap） | 选择、打开 | 通用 |
| 双击（Double Tap） | 放大图片 | 大图浏览 |
| 长按（Long Press） | 显示菜单、选中 | 编辑模式 |
| 滑动（Swipe） | 切换照片、返回 | 大图浏览、导航 |
| 捏合（Pinch） | 缩放图片 | 大图浏览 |
| 拖拽（Drag） | 排序、移动 | 照片排序 |

#### 移动端导航
**底部导航栏（推荐）：**
```css
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(224, 221, 214, 0.3);
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 100;
}

.mobile-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 64px;
  min-height: 48px;
  color: #9C9C9C;
}

.mobile-nav__item.active {
  color: #D4773C;
}
```

### 8.4 移动端性能优化

#### 玻璃效果降级
```css
/* 移动端使用实心背景替代玻璃效果 */
@media (max-width: 768px) {
  .glass-card {
    background: rgba(250, 250, 248, 1);
    backdrop-filter: none;
  }

  .navbar {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: none;
  }
}
```

#### 图片优化
- 移动端使用中等尺寸图片（1000px宽）
- 使用 WebP 格式（降级到 JPEG）
- 懒加载+渐进式加载

#### 动画优化
- 减少或禁用非关键动画
- 使用 `will-change` 提示浏览器优化
- 避免复杂的模糊效果

---

## 9. 参考竞品设计分析

### 9.1 500px
**优秀设计点：**
- ✅ 高质量的图片展示，画质无损
- ✅ 简洁的瀑布流布局，突出作品
- ✅ 大图浏览模式体验优秀
- ✅ 专业的作品信息展示（EXIF、地点、器材）

**可借鉴：**
- 大图模式的信息面板设计
- 作品卡片的Hover效果
- EXIF信息的呈现方式

### 9.2 Magnum Photos
**优秀设计点：**
- ✅ 极简主义设计，作品至上
- ✅ 大量留白，视觉干净
- ✅ 黑白色调为主，突出作品
- ✅ 沉浸式全屏浏览体验

**可借鉴：**
- 极简的导航设计
- 全屏浏览的交互逻辑
- 留白的使用

### 9.3 图虫
**优秀设计点：**
- ✅ 移动端体验流畅
- ✅ 瀑布流加载性能好
- ✅ 社交互动功能完善
- ✅ 作品分类清晰

**可借鉴：**
- 移动端瀑布流的优化
- 底部导航设计
- 作品标签系统

### 9.4 Flickr
**优秀设计点：**
- ✅ 强大的专辑管理功能
- ✅ 详细的作品元数据展示
- ✅ 灵活的分类和标签系统
- ✅ 完善的搜索和筛选

**可借鉴：**
- 专辑编辑的界面设计
- 作品信息的结构化展示
- 批量上传的流程设计

### 9.5 其他平台启发

**1X（精致的作品呈现）：**
- 策展式的作品展示
- 高端的视觉氛围
- 精致的排版设计

**色影无忌/蜂鸟网（中文摄影社区）：**
- 符合中文用户习惯的布局
- 摄影参数的中文呈现
- 社区互动的设计

---

## 10. 设计挑战与解决方案

### 10.1 玻璃拟态 + 摄影作品展示的平衡

**挑战：**
玻璃拟态效果容易喧宾夺主，影响作品的展示效果。如何让玻璃效果成为衬托而非干扰？

**解决方案：**

1. **作品展示区域使用实心背景：**
   - 作品图片本身不使用玻璃效果
   - 作品卡片使用极简边框，不使用强烈的玻璃效果
   - 瀑布流背景使用纯色，让作品成为焦点

2. **玻璃效果用于UI元素：**
   - 导航栏、工具栏使用玻璃效果（浮动感）
   - 对话框、信息面板使用玻璃效果（层次感）
   - 按钮、标签使用轻微玻璃效果（现代感）

3. **对比度控制：**
   - 确保玻璃效果元素与背景有足够的对比度
   - 文字内容使用实心背景或高对比度遮罩
   - 避免在复杂背景上使用玻璃效果

4. **分区设计：**
   - 作品展示区：极简、纯净
   - UI控制区：玻璃拟态、现代感

### 10.2 性能考虑

**挑战：**
`backdrop-filter` 属性对性能有较大影响，特别是在移动端和低端设备上。

**解决方案：**

1. **按需使用：**
   - 仅在关键UI元素使用玻璃效果
   - 避免在大面积区域使用
   - 限制同时出现的玻璃效果元素数量

2. **移动端降级：**
```css
/* 移动端使用实心背景 */
@media (max-width: 768px) {
  .glass-effect {
    backdrop-filter: none;
    background: rgba(250, 250, 248, 0.98);
  }
}
```

3. **浏览器兼容降级：**
```css
@supports not (backdrop-filter: blur(10px)) {
  .glass-effect {
    background: rgba(250, 250, 248, 1);
  }
}
```

4. **性能优化技巧：**
   - 使用 `will-change: backdrop-filter;` 提示浏览器优化
   - 减少模糊半径（10px-16px已足够）
   - 避免在滚动元素上使用
   - 使用硬件加速（`transform: translateZ(0);`）

### 10.3 可访问性（Accessibility）

**挑战：**
玻璃拟态的半透明效果可能导致对比度不足，影响文字可读性，特别是对视力障碍用户。

**解决方案：**

1. **对比度检查：**
   - 所有文字与背景的对比度≥4.5:1（WCAG AA标准）
   - 重要文字（标题、按钮）对比度≥7:1（WCAG AAA标准）
   - 使用对比度检测工具验证

2. **文字背景加强：**
```css
.glass-text-container {
  background: rgba(250, 250, 248, 0.95); /* 提高不透明度 */
  backdrop-filter: blur(10px);
  /* 添加半透明遮罩确保可读性 */
}
```

3. **提供高对比度模式：**
```css
@media (prefers-contrast: high) {
  .glass-effect {
    background: rgba(250, 250, 248, 1);
    backdrop-filter: none;
    border: 2px solid #2C2C2C;
  }
}
```

4. **键盘导航：**
   - 所有交互元素都可通过键盘访问
   - 焦点状态有明显的视觉反馈
   - 支持Tab键、Enter键、Esc键等操作

5. **屏幕阅读器支持：**
   - 为图片添加 `alt` 属性
   - 为图标按钮添加 `aria-label`
   - 使用语义化HTML标签

### 10.4 色彩适配

**挑战：**
非洲大地色系偏暖，如何确保在不同光线环境下（白天/夜晚）都有良好的视觉效果？

**解决方案：**

1. **自适应亮度：**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1A1A1A;
    --text-primary: #F5F3EF;
    --glass-bg: rgba(26, 26, 26, 0.7);
    /* 调整色彩亮度以适应暗色模式 */
  }
}
```

2. **保持品牌色：**
   - 主色调（Terra Cotta）在暗色模式下仍然使用
   - 调整中性色以适应不同模式
   - 确保对比度符合标准

3. **提供模式切换：**
   - 用户可手动切换浅色/深色模式
   - 记住用户偏好设置

---

## 11. 设计资源与工具

### 11.1 字体资源

**Google Fonts CDN：**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet">
```

### 11.2 图标资源

**推荐图标库：**
- **Lucide Icons：** 现代、简洁的线性图标（推荐）
- **Heroicons：** Tailwind官方图标库
- **Feather Icons：** 轻量级图标库
- **Phosphor Icons：** 灵活的多风格图标库

**使用方式：**
- SVG图标（推荐，可控制颜色和大小）
- Icon Font（备选方案）

### 11.3 设计工具

**UI设计：**
- Figma（推荐）
- Sketch
- Adobe XD

**原型工具：**
- Figma（推荐）
- ProtoPie
- Principle

**色彩工具：**
- Coolors（色彩搭配）
- Adobe Color（色轮工具）
- Contrast Checker（对比度检测）

### 11.4 开发工具

**CSS框架（可选）：**
- Tailwind CSS（实用类优先）
- UnoCSS（按需生成）
- 或纯CSS（完全自定义）

**动画库（可选）：**
- Framer Motion（React）
- GSAP（通用）
- Anime.js（轻量级）

---

## 12. 设计交付清单

### 12.1 设计文件
- [ ] 完整的设计系统文档（本文档）
- [ ] Figma/Sketch设计稿（所有页面）
- [ ] 组件库（可复用的UI组件）
- [ ] 图标资源（SVG格式）
- [ ] 品牌色彩板

### 12.2 页面设计稿
- [ ] 注册/登录页
- [ ] 个人主页（桌面端+移动端）
- [ ] 个人设置页
- [ ] 专辑详情页（桌面端+移动端）
- [ ] 专辑编辑页
- [ ] 作品上传页
- [ ] 大图浏览模式（桌面端+移动端）

### 12.3 交互原型
- [ ] 页面切换流程原型
- [ ] 大图浏览交互原型
- [ ] 上传流程交互原型
- [ ] 移动端手势操作原型

### 12.4 开发规范
- [ ] CSS变量定义文件
- [ ] 组件CSS模板
- [ ] 动画Keyframes库
- [ ] 响应式断点配置

---

## 13. 版本历史

**V1.0 - 2025-10-08**
- 初始版本
- 完整的设计理念、色彩系统、字体系统
- 玻璃拟态设计规范
- 布局系统与组件设计规范
- 动效设计与响应式设计策略
- 竞品分析与设计挑战解决方案

---

**文档结束**

本设计规范文档为摄影作品展示平台提供了完整的UI/UX设计指导，结合了玻璃拟态的现代设计语言和非洲大地色系的温暖基调，创造出独特的品牌视觉识别。下一步将基于此文档进行前端开发实现。
