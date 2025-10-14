# Chrome DevTools MCP 集成指南

**创建时间**: 2025-10-15
**项目**: 摄影作品展示平台
**Chrome DevTools MCP 版本**: 0.2.6

---

## 概述

`chrome-devtools-mcp` 让您的 AI 编码助手(如 Claude Code)能够控制和检查实时的 Chrome 浏览器。它作为 Model Context Protocol (MCP) 服务器,为 AI 提供 Chrome DevTools 的完整功能,实现可靠的自动化、深度调试和性能分析。

### 关键特性

- **性能洞察** - 使用 Chrome DevTools 记录追踪并提取可操作的性能见解
- **高级浏览器调试** - 分析网络请求、截图和检查浏览器控制台
- **可靠的自动化** - 使用 Puppeteer 自动化 Chrome 操作并自动等待操作结果

---

## 安装状态

✅ **已完成安装和配置**

### 1. 安装的包
```bash
npm install -D chrome-devtools-mcp@0.2.6
```

### 2. 配置到 Claude Code
```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

配置文件位置: `C:\Users\Administrator\.claude.json`

### 3. 系统要求
- ✅ Node.js 22+ (当前: v22.11.0)
- ✅ Chrome 浏览器 (稳定版本)
- ✅ npm 包管理器

---

## 重要免责声明 ⚠️

`chrome-devtools-mcp` 会将浏览器实例的内容暴露给 MCP 客户端,允许它们检查、调试和修改浏览器或 DevTools 中的任何数据。

**请避免分享您不想与 MCP 客户端共享的敏感或个人信息。**

---

## 可用工具

Chrome DevTools MCP 提供了 26 个专业工具,分为 6 大类:

### 1. 输入自动化 (7 工具)

#### `click`
**点击元素**
- 描述: 在页面上点击元素
- 用途: 点击按钮、链接、表单元素等

#### `drag`
**拖拽元素**
- 描述: 拖拽元素到新位置
- 用途: 拖放操作、排序列表

#### `fill`
**填充输入框**
- 描述: 在输入框中填充文本
- 用途: 填写表单字段

#### `fill_form`
**填充整个表单**
- 描述: 一次性填充多个表单字段
- 用途: 快速完成表单提交

#### `handle_dialog`
**处理对话框**
- 描述: 处理浏览器对话框(alert/confirm/prompt)
- 用途: 自动处理弹窗

#### `hover`
**悬停元素**
- 描述: 在元素上悬停鼠标
- 用途: 触发悬停效果、下拉菜单

#### `upload_file`
**上传文件**
- 描述: 通过文件选择器上传文件
- 用途: 测试文件上传功能

---

### 2. 导航自动化 (7 工具)

#### `close_page`
**关闭页面**
- 描述: 关闭当前或指定的页面
- 用途: 清理测试环境

#### `list_pages`
**列出所有页面**
- 描述: 获取所有打开的页面列表
- 用途: 管理多个标签页

#### `navigate_page`
**导航到URL**
- 描述: 导航到指定的URL
- 用途: 访问网页

#### `navigate_page_history`
**浏览历史导航**
- 描述: 前进或后退浏览历史
- 用途: 测试浏览器历史功能

#### `new_page`
**新建页面**
- 描述: 打开新的浏览器标签页
- 用途: 多页面测试

#### `select_page`
**选择页面**
- 描述: 切换到指定的页面
- 用途: 在多个标签页间切换

#### `wait_for`
**等待条件**
- 描述: 等待特定条件满足(元素出现/消失、时间等)
- 用途: 等待页面加载完成

---

### 3. 模拟环境 (3 工具)

#### `emulate_cpu`
**CPU 限流**
- 描述: 模拟较慢的CPU性能
- 用途: 测试低端设备性能

#### `emulate_network`
**网络限流**
- 描述: 模拟不同的网络条件(3G、4G、慢速等)
- 用途: 测试慢速网络下的体验

#### `resize_page`
**调整页面大小**
- 描述: 调整浏览器视口大小
- 用途: 测试响应式设计

---

### 4. 性能分析 (3 工具)

#### `performance_analyze_insight`
**分析性能洞察**
- 描述: 分析性能追踪并提取关键指标
- 用途: 获取性能优化建议

#### `performance_start_trace`
**开始性能追踪**
- 描述: 开始记录性能追踪
- 用途: 性能分析起点

#### `performance_stop_trace`
**停止性能追踪**
- 描述: 停止记录并保存性能追踪
- 用途: 完成性能分析

---

### 5. 网络分析 (2 工具)

#### `get_network_request`
**获取网络请求详情**
- 描述: 获取特定网络请求的详细信息
- 用途: 分析API调用、检查响应数据

#### `list_network_requests`
**列出网络请求**
- 描述: 列出所有网络请求
- 用途: 检查网络活动、发现失败的请求

---

### 6. 调试工具 (4 工具)

#### `evaluate_script`
**执行JavaScript**
- 描述: 在页面上下文中执行JavaScript代码
- 用途: 获取数据、修改DOM、调用函数

#### `list_console_messages`
**列出控制台消息**
- 描述: 获取浏览器控制台的所有消息
- 用途: 检查错误、警告、日志

#### `take_screenshot`
**截图**
- 描述: 对页面或元素截图
- 用途: 记录测试证据、视觉回归测试

#### `take_snapshot`
**获取DOM快照**
- 描述: 获取页面的可访问性树快照
- 用途: 分析页面结构、查找元素

---

## 使用示例

### 示例1: 完整的用户登录测试

```typescript
// 1. 导航到登录页面
await navigate_page({
  url: "https://photographalbum.vercel.app/login"
});

// 2. 等待页面加载
await wait_for({
  selector: "input[type='email']"
});

// 3. 填写登录表单
await fill_form({
  fields: [
    { selector: "input[type='email']", value: "123456789@qq.com" },
    { selector: "input[type='password']", value: "123456" }
  ]
});

// 4. 点击登录按钮
await click({
  selector: "button[type='submit']"
});

// 5. 等待跳转成功
await wait_for({
  selector: ".dashboard"
});

// 6. 截图保存证据
await take_screenshot({
  path: "login-success.png"
});

// 7. 检查控制台错误
const consoleMessages = await list_console_messages();
const errors = consoleMessages.filter(msg => msg.level === 'error');
```

---

### 示例2: 性能分析

```typescript
// 1. 开始性能追踪
await performance_start_trace();

// 2. 导航到目标页面
await navigate_page({
  url: "https://photographalbum.vercel.app"
});

// 3. 等待页面完全加载
await wait_for({
  timeout: 5000
});

// 4. 停止追踪
await performance_stop_trace({
  path: "homepage-trace.json"
});

// 5. 分析性能洞察
const insights = await performance_analyze_insight({
  tracePath: "homepage-trace.json"
});

// insights 包含:
// - LCP (Largest Contentful Paint)
// - FCP (First Contentful Paint)
// - TBT (Total Blocking Time)
// - CLS (Cumulative Layout Shift)
```

---

### 示例3: 网络请求监控

```typescript
// 1. 导航到页面
await navigate_page({
  url: "https://photographalbum.vercel.app/discover"
});

// 2. 等待页面加载
await wait_for({
  timeout: 3000
});

// 3. 获取所有网络请求
const requests = await list_network_requests();

// 4. 分析失败的请求
const failedRequests = requests.filter(req =>
  req.status >= 400 || req.failed
);

// 5. 检查API请求
const apiRequests = requests.filter(req =>
  req.url.includes('/api/')
);

// 6. 获取特定请求详情
for (const req of apiRequests) {
  const details = await get_network_request({
    requestId: req.id
  });
  // 检查响应体、请求头等
}
```

---

### 示例4: 测试专辑页面新功能

```typescript
// 1. 登录
await navigate_page({
  url: "https://photographalbum.vercel.app/login"
});
await fill_form({
  fields: [
    { selector: "input[type='email']", value: "123456789@qq.com" },
    { selector: "input[type='password']", value: "123456" }
  ]
});
await click({ selector: "button[type='submit']" });
await wait_for({ timeout: 2000 });

// 2. 访问其他用户的专辑
await navigate_page({
  url: "https://photographalbum.vercel.app/photographer/someuser/album/123"
});

// 3. 获取DOM快照,验证用户信息卡片
const snapshot = await take_snapshot();
// 验证快照中包含:
// - 用户头像
// - 用户名
// - 关注者数量
// - 关注按钮
// - 私信按钮

// 4. 截图记录当前状态
await take_screenshot({
  path: "album-page-initial.png",
  fullPage: true
});

// 5. 悬停在关注按钮上(测试hover效果)
await hover({
  selector: "button.follow-button"
});

// 6. 点击关注按钮
await click({
  selector: "button.follow-button"
});

// 7. 等待按钮状态变化
await wait_for({
  selector: "button:contains('已关注')"
});

// 8. 验证关注者数量增加
const followCount = await evaluate_script({
  script: `
    document.querySelector('.follower-count').textContent
  `
});

// 9. 截图记录关注后状态
await take_screenshot({
  path: "album-page-followed.png"
});

// 10. 测试私信按钮
await click({
  selector: "button.message-button"
});

// 11. 验证跳转到私信页面
await wait_for({
  selector: ".message-conversation"
});

const currentUrl = await evaluate_script({
  script: "window.location.href"
});
// 验证URL包含 /messages/

// 12. 检查整个过程中的控制台错误
const consoleMessages = await list_console_messages();
const errors = consoleMessages.filter(msg => msg.level === 'error');

if (errors.length > 0) {
  console.log("发现控制台错误:", errors);
}

// 13. 获取所有网络请求
const networkRequests = await list_network_requests();
const failedRequests = networkRequests.filter(req => req.failed);

if (failedRequests.length > 0) {
  console.log("发现失败的网络请求:", failedRequests);
}
```

---

### 示例5: 响应式设计测试

```typescript
// 测试不同设备尺寸

// 1. 桌面版 (1920x1080)
await resize_page({
  width: 1920,
  height: 1080
});
await navigate_page({
  url: "https://photographalbum.vercel.app"
});
await take_screenshot({
  path: "homepage-desktop.png"
});

// 2. 平板版 (768x1024)
await resize_page({
  width: 768,
  height: 1024
});
await navigate_page({
  url: "https://photographalbum.vercel.app"
});
await take_screenshot({
  path: "homepage-tablet.png"
});

// 3. 手机版 (375x667)
await resize_page({
  width: 375,
  height: 667
});
await navigate_page({
  url: "https://photographalbum.vercel.app"
});
await take_screenshot({
  path: "homepage-mobile.png"
});
```

---

### 示例6: 慢速网络测试

```typescript
// 模拟 3G 网络
await emulate_network({
  profile: "slow-3g"  // 可选: fast-3g, 4g, wifi
});

// 模拟慢速 CPU
await emulate_cpu({
  slowdown: 4  // CPU 速度降低 4 倍
});

// 开始性能追踪
await performance_start_trace();

// 访问页面
await navigate_page({
  url: "https://photographalbum.vercel.app"
});

// 等待加载完成
await wait_for({
  timeout: 10000  // 慢速网络需要更长等待时间
});

// 停止追踪并分析
await performance_stop_trace({
  path: "slow-network-trace.json"
});

const insights = await performance_analyze_insight({
  tracePath: "slow-network-trace.json"
});

// 恢复正常网络和CPU
await emulate_network({ profile: null });
await emulate_cpu({ slowdown: 1 });
```

---

## 配置选项

### 基础配置

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### 高级配置

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "chrome-devtools-mcp@latest",
        "--headless",              // 无头模式
        "--isolated",              // 使用临时用户数据目录
        "--channel=canary",        // 使用 Canary 版本
        "--executablePath=/path/to/chrome"  // 自定义Chrome路径
      ]
    }
  }
}
```

### 配置选项说明

#### `--browserUrl`, `-u`
- 类型: string
- 说明: 连接到已运行的 Chrome 实例(使用端口转发)
- 用途: 远程调试

#### `--headless`
- 类型: boolean
- 默认: false
- 说明: 是否以无头模式运行(无UI)

#### `--executablePath`, `-e`
- 类型: string
- 说明: 自定义 Chrome 可执行文件路径

#### `--isolated`
- 类型: boolean
- 默认: false
- 说明: 使用临时用户数据目录,关闭浏览器后自动清理

#### `--channel`
- 类型: string
- 可选值: stable, canary, beta, dev
- 默认: stable
- 说明: 指定使用的 Chrome 渠道

---

## 用户数据目录

### 默认位置

Chrome DevTools MCP 使用以下用户数据目录:

**Windows**:
```
%HOMEPATH%/.cache/chrome-devtools-mcp/chrome-profile-$CHANNEL
```

**Linux / MacOS**:
```
$HOME/.cache/chrome-devtools-mcp/chrome-profile-$CHANNEL
```

### 持久化 vs 隔离模式

- **默认(持久化)**: 用户数据在多次运行间保留(登录状态、cookies等)
- **隔离模式** (`--isolated`): 每次使用临时目录,关闭后自动清理

**建议**:
- 开发/调试: 使用默认持久化模式
- 自动化测试: 使用 `--isolated` 模式确保环境干净

---

## 测试计划

### 阶段1: 基础功能验证

1. **页面导航**
   - ✅ 访问首页
   - ✅ 访问登录页
   - ✅ 访问发现页

2. **登录功能**
   - ✅ 填写表单
   - ✅ 提交登录
   - ✅ 验证登录成功

### 阶段2: 专辑页面新功能测试

1. **用户信息卡片**
   - ✅ 验证头像显示
   - ✅ 验证用户名显示
   - ✅ 验证关注者数量显示

2. **关注功能**
   - ✅ 点击关注按钮
   - ✅ 验证状态变化
   - ✅ 验证数量更新
   - ✅ 取消关注测试

3. **私信功能**
   - ✅ 点击私信按钮
   - ✅ 验证页面跳转
   - ✅ 验证URL正确

### 阶段3: 性能和网络分析

1. **性能追踪**
   - 记录首页加载性能
   - 记录专辑页面加载性能
   - 分析性能瓶颈

2. **网络监控**
   - 检查API请求
   - 检查失败的请求
   - 分析请求时间

3. **控制台检查**
   - 收集所有错误
   - 收集警告信息
   - 生成错误报告

### 阶段4: 响应式和兼容性

1. **响应式设计**
   - 测试桌面版布局
   - 测试平板版布局
   - 测试移动版布局

2. **慢速网络**
   - 3G网络测试
   - 4G网络测试
   - 慢速CPU测试

---

## 与 Playwright MCP 的对比

| 功能 | Chrome DevTools MCP | Playwright MCP |
|------|-------------------|----------------|
| **基础自动化** | ✅ 支持 | ✅ 支持 |
| **性能分析** | ✅ 详细追踪 | ❌ 不支持 |
| **网络监控** | ✅ 详细分析 | ✅ 基础支持 |
| **CPU/网络限流** | ✅ 支持 | ❌ 不支持 |
| **多浏览器** | ❌ 仅Chrome | ✅ Chrome/Firefox/Safari |
| **视觉快照** | ✅ DOM树 | ✅ 可访问性树 |
| **开发工具集成** | ✅ 完整DevTools | ❌ 无 |

### 使用建议

- **性能分析和优化**: 使用 Chrome DevTools MCP
- **跨浏览器测试**: 使用 Playwright MCP
- **深度调试和网络分析**: 使用 Chrome DevTools MCP
- **快速UI自动化**: 两者皆可

可以同时使用两个 MCP,根据具体任务选择合适的工具!

---

## 最佳实践

### 1. 等待页面加载

始终在操作前等待页面完全加载:
```typescript
await wait_for({
  selector: ".content-ready",
  timeout: 5000
});
```

### 2. 错误检查

每次测试后检查控制台错误:
```typescript
const messages = await list_console_messages();
const errors = messages.filter(m => m.level === 'error');
if (errors.length > 0) {
  console.error("发现错误:", errors);
}
```

### 3. 网络监控

监控网络请求找出问题:
```typescript
const requests = await list_network_requests();
const failed = requests.filter(r => r.failed);
const slow = requests.filter(r => r.duration > 3000);
```

### 4. 截图证据

关键步骤截图保存:
```typescript
await take_screenshot({
  path: `step-${stepNumber}.png`,
  fullPage: true
});
```

### 5. 性能基准

建立性能基准:
```typescript
// 记录基准
const baseline = await measurePerformance();
// 后续对比
const current = await measurePerformance();
if (current.lcp > baseline.lcp * 1.2) {
  console.warn("LCP 性能下降 20%");
}
```

---

## 故障排除

### 问题1: Chrome 未启动

**错误**: `Could not find Chrome`

**解决**:
1. 确保已安装 Chrome 浏览器
2. 使用 `--executablePath` 指定路径
3. 检查系统权限

### 问题2: 连接超时

**错误**: `Timeout connecting to browser`

**解决**:
1. 增加超时时间
2. 检查防火墙设置
3. 使用 `--headless` 模式

### 问题3: 用户数据目录权限

**错误**: `Cannot write to user-data-dir`

**解决**:
1. 检查目录权限
2. 使用 `--isolated` 模式
3. 手动清理旧的用户数据目录

### 问题4: 工具不可用

**错误**: `Tool not found`

**解决**:
1. 确保 MCP 服务器已正确配置
2. 重启 Claude Code
3. 更新到最新版本: `npx chrome-devtools-mcp@latest`

---

## 项目配置

### 当前配置

```bash
# 配置文件位置
C:\Users\Administrator\.claude.json

# MCP 服务器配置
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["chrome-devtools-mcp@latest"]
  }
}
```

### 推荐配置(开发环境)

```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": [
      "chrome-devtools-mcp@latest",
      "--channel=stable"
    ]
  }
}
```

### 推荐配置(自动化测试)

```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": [
      "chrome-devtools-mcp@latest",
      "--headless",
      "--isolated"
    ]
  }
}
```

---

## 安全考虑

⚠️ **重要**: Chrome DevTools MCP 可以访问浏览器中的所有数据

**建议**:
1. 不要在生产环境使用
2. 不要在浏览器中打开敏感页面
3. 测试后清理用户数据目录(使用 `--isolated`)
4. 不要共享包含敏感信息的截图或追踪文件

---

## 下一步

1. ✅ Chrome DevTools MCP 已安装并配置
2. ⏭️ 使用工具测试专辑页面新功能
3. ⏭️ 进行性能分析
4. ⏭️ 生成测试报告

---

## 参考资料

- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Chrome DevTools 协议文档](https://chromedevtools.github.io/devtools-protocol/)
- [Puppeteer 文档](https://pptr.dev/)
- [Chrome DevTools 官方文档](https://developer.chrome.com/docs/devtools/)

---

**文档创建**: 2025-10-15
**最后更新**: 2025-10-15
**状态**: ✅ 集成完成,等待测试
