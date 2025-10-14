# Playwright MCP 集成指南

**创建时间**: 2025-10-14
**项目**: 摄影作品展示平台
**Playwright MCP 版本**: 0.0.42

---

## 概述

Playwright MCP (Model Context Protocol) 是一个浏览器自动化服务器,允许 Claude Code 通过结构化的可访问性快照与网页交互,无需截图或视觉模型。

### 关键特性

- **快速轻量** - 使用 Playwright 的可访问性树,而非基于像素的输入
- **对 LLM 友好** - 无需视觉模型,纯结构化数据操作
- **确定性工具应用** - 避免基于截图方法的歧义

---

## 安装状态

✅ **已完成安装和配置**

### 1. 安装的包
```bash
npm install -D @playwright/mcp@0.0.42
```

### 2. 配置到 Claude Code
```bash
claude mcp add playwright npx @playwright/mcp@latest
```

配置文件位置: `C:\Users\Administrator\.claude.json`

### 3. 浏览器安装
```bash
npm run test:install
```

已安装浏览器:
- ✅ Firefox 142.0.1 (playwright build v1495)
- ✅ Webkit 26.0 (playwright build v2215)
- ✅ Chromium (默认)

---

## 可用工具

Playwright MCP 提供了丰富的浏览器自动化工具。以下是按类别分类的完整列表:

### 核心自动化工具

#### 1. browser_navigate
**导航到URL**
- 描述: 导航到指定的URL
- 参数:
  - `url` (string): 要导航到的URL

#### 2. browser_snapshot
**页面快照**
- 描述: 捕获当前页面的可访问性快照(比截图更好)
- 参数: 无
- 只读: ✅

#### 3. browser_click
**点击元素**
- 描述: 在网页上执行点击操作
- 参数:
  - `element` (string): 元素的可读描述
  - `ref` (string): 页面快照中的精确元素引用
  - `doubleClick` (boolean, 可选): 是否执行双击
  - `button` (string, 可选): 要点击的按钮,默认为左键
  - `modifiers` (array, 可选): 要按下的修饰键

#### 4. browser_type
**输入文本**
- 描述: 在可编辑元素中输入文本
- 参数:
  - `element` (string): 元素的可读描述
  - `ref` (string): 页面快照中的精确元素引用
  - `text` (string): 要输入的文本
  - `submit` (boolean, 可选): 是否提交(输入后按Enter)
  - `slowly` (boolean, 可选): 是否逐字符输入

#### 5. browser_hover
**悬停鼠标**
- 描述: 在页面元素上悬停
- 参数:
  - `element` (string): 元素的可读描述
  - `ref` (string): 页面快照中的精确元素引用

#### 6. browser_fill_form
**填写表单**
- 描述: 填写多个表单字段
- 参数:
  - `fields` (array): 要填写的字段列表

#### 7. browser_select_option
**选择选项**
- 描述: 在下拉菜单中选择选项
- 参数:
  - `element` (string): 元素的可读描述
  - `ref` (string): 页面快照中的精确元素引用
  - `values` (array): 要选择的值数组

#### 8. browser_press_key
**按键**
- 描述: 按下键盘上的键
- 参数:
  - `key` (string): 要按下的键名或字符,如 `ArrowLeft` 或 `a`

#### 9. browser_drag
**拖拽鼠标**
- 描述: 在两个元素之间执行拖放操作
- 参数:
  - `startElement` (string): 源元素描述
  - `startRef` (string): 源元素引用
  - `endElement` (string): 目标元素描述
  - `endRef` (string): 目标元素引用

#### 10. browser_evaluate
**执行JavaScript**
- 描述: 在页面或元素上执行JavaScript表达式
- 参数:
  - `function` (string): 函数代码,如 `() => { /* code */ }`
  - `element` (string, 可选): 元素描述
  - `ref` (string, 可选): 元素引用

### 导航工具

#### 11. browser_navigate_back
**返回**
- 描述: 返回上一页
- 参数: 无

#### 12. browser_wait_for
**等待**
- 描述: 等待文本出现/消失或等待指定时间
- 参数:
  - `time` (number, 可选): 等待时间(秒)
  - `text` (string, 可选): 要等待的文本
  - `textGone` (string, 可选): 要等待消失的文本

### 信息获取工具

#### 13. browser_console_messages
**获取控制台消息**
- 描述: 返回所有控制台消息
- 参数:
  - `onlyErrors` (boolean, 可选): 仅返回错误消息
- 只读: ✅

#### 14. browser_network_requests
**列出网络请求**
- 描述: 返回自加载页面以来的所有网络请求
- 参数: 无
- 只读: ✅

#### 15. browser_take_screenshot
**截图**
- 描述: 对当前页面截图(不能基于截图执行操作,使用 browser_snapshot 执行操作)
- 参数:
  - `type` (string, 可选): 图片格式,默认png
  - `filename` (string, 可选): 保存文件名
  - `element` (string, 可选): 要截图的元素描述
  - `ref` (string, 可选): 元素引用
  - `fullPage` (boolean, 可选): 是否截取完整滚动页面
- 只读: ✅

### 浏览器管理工具

#### 16. browser_close
**关闭浏览器**
- 描述: 关闭页面
- 参数: 无

#### 17. browser_resize
**调整浏览器窗口大小**
- 描述: 调整浏览器窗口大小
- 参数:
  - `width` (number): 窗口宽度
  - `height` (number): 窗口高度

#### 18. browser_handle_dialog
**处理对话框**
- 描述: 处理浏览器对话框
- 参数:
  - `accept` (boolean): 是否接受对话框
  - `promptText` (string, 可选): 提示对话框的文本

#### 19. browser_file_upload
**上传文件**
- 描述: 上传一个或多个文件
- 参数:
  - `paths` (array, 可选): 要上传的文件的绝对路径数组

### 标签页管理工具

#### 20. browser_tabs
**管理标签页**
- 描述: 列出、创建、关闭或选择浏览器标签页
- 参数:
  - `action` (string): 要执行的操作(list/create/close/select)
  - `index` (number, 可选): 标签页索引(用于close/select)

### 浏览器安装工具

#### 21. browser_install
**安装浏览器**
- 描述: 安装配置中指定的浏览器
- 参数: 无
- 使用场景: 如果遇到浏览器未安装的错误时调用

---

## 使用示例

### 示例1: 自动登录测试

```typescript
// 1. 导航到登录页面
await browser_navigate({
  url: "https://photographalbum.vercel.app/login"
});

// 2. 获取页面快照
const snapshot = await browser_snapshot();

// 3. 填写登录表单
await browser_fill_form({
  fields: [
    { element: "邮箱输入框", ref: "input#email", text: "123456789@qq.com" },
    { element: "密码输入框", ref: "input#password", text: "123456" }
  ]
});

// 4. 点击登录按钮
await browser_click({
  element: "登录按钮",
  ref: "button[type='submit']"
});

// 5. 等待跳转
await browser_wait_for({
  text: "欢迎回来"
});
```

### 示例2: 测试专辑页面新功能

```typescript
// 1. 登录
// (同上登录步骤)

// 2. 访问其他用户的专辑
await browser_navigate({
  url: "https://photographalbum.vercel.app/photographer/someuser/album/album123"
});

// 3. 获取页面快照,验证用户信息卡片
const snapshot = await browser_snapshot();
// 应该能看到: 用户头像、用户名、关注者数量、关注按钮、私信按钮

// 4. 点击关注按钮
await browser_click({
  element: "关注按钮",
  ref: "button.follow-button"
});

// 5. 验证按钮文字变化
await browser_wait_for({
  text: "已关注"
});

// 6. 获取控制台消息检查错误
const consoleMessages = await browser_console_messages({
  onlyErrors: true
});

// 7. 截图保存证据
await browser_take_screenshot({
  filename: "album-page-with-follow-button.png",
  fullPage: true
});
```

### 示例3: 测试私信功能

```typescript
// 1. 点击私信按钮
await browser_click({
  element: "私信按钮",
  ref: "button.message-button"
});

// 2. 等待跳转到私信页面
await browser_wait_for({
  text: "发送消息"
});

// 3. 验证URL正确
const snapshot = await browser_snapshot();
// URL应该是: /messages/{username}

// 4. 输入消息
await browser_type({
  element: "消息输入框",
  ref: "textarea#message-input",
  text: "你好,这是自动化测试消息",
  submit: true
});

// 5. 验证消息发送成功
await browser_wait_for({
  text: "你好,这是自动化测试消息"
});
```

---

## 配置选项

Playwright MCP 支持以下配置参数(在 MCP 配置的 `args` 中添加):

### 常用配置

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser=chromium",        // 浏览器类型: chrome/firefox/webkit/msedge
        "--headless",                // 无头模式
        "--viewport-size=1280x720",  // 视口大小
        "--timeout-action=5000",     // 操作超时(毫秒)
        "--timeout-navigation=60000", // 导航超时(毫秒)
        "--output-dir=./test-output", // 输出目录
        "--save-trace",              // 保存追踪
        "--save-video=800x600",      // 保存视频
        "--user-agent=CustomUA"      // 自定义User-Agent
      ]
    }
  }
}
```

### 高级配置

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--isolated",                         // 隔离模式(每次都是新会话)
        "--storage-state=./auth.json",        // 使用存储的认证状态
        "--device=iPhone 15",                 // 模拟设备
        "--ignore-https-errors",              // 忽略HTTPS错误
        "--grant-permissions=geolocation,clipboard-read", // 授予权限
        "--proxy-server=http://myproxy:3128", // 代理服务器
        "--caps=vision,pdf"                   // 启用额外功能
      ]
    }
  }
}
```

---

## 测试计划

### 阶段1: 基础功能测试

1. **登录功能**
   - 使用测试账号 123456789@qq.com / 123456
   - 验证登录成功跳转
   - 检查会话持久化

2. **专辑浏览**
   - 访问专辑列表页面
   - 点击专辑卡片
   - 验证专辑详情页加载

### 阶段2: 新功能测试(专辑页面用户信息)

1. **用户信息卡片显示**
   - 验证用户头像显示
   - 验证用户名显示
   - 验证关注者数量显示

2. **关注按钮功能**
   - 点击关注按钮
   - 验证按钮状态变化("关注" → "已关注")
   - 验证关注者数量+1
   - 点击取消关注
   - 验证状态恢复

3. **私信按钮功能**
   - 点击私信按钮
   - 验证跳转到私信页面
   - 验证URL正确

### 阶段3: 交互测试

1. **点赞功能**
   - 点击照片进入Lightbox
   - 打开信息侧边栏
   - 点击点赞按钮
   - 验证点赞状态

2. **评论功能**
   - 切换到评论标签
   - 输入评论内容
   - 提交评论
   - 验证评论显示

---

## 最佳实践

### 1. 始终获取页面快照

在执行操作前先调用 `browser_snapshot()`,这样可以:
- 了解当前页面结构
- 获取元素的精确引用(ref)
- 确保元素存在才操作

### 2. 使用等待命令

在导航或操作后使用 `browser_wait_for()`:
- 等待页面加载完成
- 等待元素出现
- 避免竞态条件

### 3. 错误处理

每次测试后检查:
```typescript
// 获取控制台错误
const errors = await browser_console_messages({ onlyErrors: true });

// 获取网络请求失败
const networkRequests = await browser_network_requests();
```

### 4. 保存证据

对关键步骤截图:
```typescript
await browser_take_screenshot({
  filename: "step-1-login-success.png",
  fullPage: true
});
```

### 5. 会话管理

- **开发/调试**: 使用默认持久化profile,保留登录状态
- **自动化测试**: 使用 `--isolated` 模式,每次全新环境
- **多账号测试**: 使用 `--storage-state` 预先保存不同账号的认证

---

## 故障排除

### 问题1: 浏览器未安装

**错误**: `Executable doesn't exist at ...`

**解决**:
```bash
npm run test:install
# 或
npx playwright install chromium
```

### 问题2: 元素未找到

**错误**: `Element not found: ...`

**解决**:
1. 先调用 `browser_snapshot()` 获取最新页面结构
2. 使用快照中的精确 `ref` 引用
3. 添加 `browser_wait_for()` 等待元素加载

### 问题3: 操作超时

**错误**: `Timeout exceeded ...`

**解决**:
1. 增加超时时间: `--timeout-action=10000`
2. 确保网络正常
3. 检查页面是否真的加载完成

### 问题4: 会话丢失

**问题**: 登录后刷新页面变成未登录

**解决**:
1. 不使用 `--isolated` 模式(使用持久化profile)
2. 或使用 `--storage-state` 保存认证状态
3. 检查cookie设置

---

## 项目特定配置

### 当前配置

```bash
# 项目配置位置
C:\Users\Administrator\.claude.json

# MCP 服务器配置
{
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest"]
  }
}
```

### 推荐的项目配置

考虑到本项目的特点,推荐以下配置:

```json
{
  "playwright": {
    "command": "npx",
    "args": [
      "@playwright/mcp@latest",
      "--browser=chromium",
      "--viewport-size=1920x1080",
      "--timeout-action=10000",
      "--timeout-navigation=30000",
      "--output-dir=./playwright-output",
      "--save-trace",
      "--save-video=1280x720"
    ]
  }
}
```

---

## 下一步

1. ✅ Playwright MCP 已安装并配置
2. ✅ 浏览器已安装
3. ⏭️ 创建自动化测试脚本
4. ⏭️ 使用 MCP 工具测试专辑页面新功能
5. ⏭️ 生成测试报告

---

## 参考资料

- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Playwright 官方文档](https://playwright.dev)
- [Model Context Protocol 文档](https://modelcontextprotocol.io)
- [Claude Code MCP 集成指南](https://docs.claude.com/claude-code/mcp)

---

**文档创建**: 2025-10-14
**最后更新**: 2025-10-14
**状态**: ✅ 集成完成,等待测试
