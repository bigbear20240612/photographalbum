# 浏览器自动化 MCP 服务器配置指南

本指南将帮助您配置 Chrome DevTools 和 Playwright MCP 服务器，让 Claude Code 能够直接控制和自动化浏览器操作。

## 📋 概述

### Chrome DevTools MCP
让 AI 助手能够控制和检查实时的 Chrome 浏览器，提供完整的 Chrome DevTools 功能。

**主要功能**：
- 🔍 页面检查和调试
- 📊 性能分析和追踪
- 🌐 网络请求监控
- 📸 截图和录屏
- 🐛 控制台日志分析
- 🎯 元素定位和交互

### Playwright MCP
提供强大的浏览器自动化能力，支持多浏览器测试和复杂的自动化场景。

**主要功能**：
- 🌐 多浏览器支持（Chrome、Firefox、Safari）
- 📱 移动设备模拟
- 🤖 智能等待和元素定位
- 📄 PDF 生成
- 🎭 视觉识别能力
- ⚡ 快速可靠的自动化

## 🔧 前置要求

### 必需
- Node.js (LTS 版本，建议 18.0 或更高)
- npm 包管理器
- Claude Code CLI 已安装
- Chrome 浏览器（用于 Chrome DevTools MCP）

### 推荐
- 稳定的网络连接
- 足够的磁盘空间（浏览器驱动约 500MB）

## 📦 安装步骤

### 第一步：验证环境

1. **检查 Node.js 版本**
   ```bash
   node --version
   # 应该显示 v18.0.0 或更高
   ```

2. **检查 npm 版本**
   ```bash
   npm --version
   # 应该显示 8.0.0 或更高
   ```

### 第二步：配置 Chrome DevTools MCP

#### 方法 1：快速配置（推荐）

编辑 Claude Code 配置文件：

**Windows 路径**：`C:\Users\Administrator\.claude\settings.local.json`

**Linux/Mac 路径**：`~/.claude/settings.local.json`

添加以下配置：

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

#### 方法 2：全局安装（可选）

如果您希望加快启动速度，可以全局安装：

```bash
npm install -g chrome-devtools-mcp
```

然后配置为：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "chrome-devtools-mcp",
      "args": []
    }
  }
}
```

#### 高级配置选项

对于 Windows 系统，如果需要指定 Chrome 安装位置或调整超时：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {
        "CHROME_PATH": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      },
      "startup_timeout_ms": 10000
    }
  }
}
```

### 第三步：配置 Playwright MCP

#### 官方 Microsoft Playwright MCP

这是 Microsoft 官方维护的 Playwright MCP 服务器：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

#### 增强版 Playwright MCP（executeautomation）

这个版本提供了更多功能和更好的集成：

```json
{
  "mcpServers": {
    "playwright-enhanced": {
      "command": "npx",
      "args": ["@executeautomation/playwright-mcp-server"]
    }
  }
}
```

#### Playwright 高级配置

指定浏览器、设备模拟和额外功能：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chromium",
        "--device", "iPhone 15",
        "--caps", "vision,pdf"
      ]
    }
  }
}
```

**配置参数说明**：
- `--browser <browser>`: 浏览器类型（chrome, firefox, webkit, msedge）
- `--device <device>`: 模拟设备（如 "iPhone 15", "Pixel 5"）
- `--caps <caps>`: 额外功能（vision 视觉识别, pdf PDF生成）
- `--config <path>`: Playwright 配置文件路径

### 第四步：完整配置示例

将所有 MCP 服务器整合到一个配置文件中：

**完整的 `settings.local.json` 示例**：

```json
{
  "permissions": {
    "allow": [
      "Read(//d/data/CLAUDE_USE/记忆agent/**)",
      "Bash(powershell:*)",
      "Bash(echo $PROFILE)"
    ],
    "deny": [],
    "ask": []
  },
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chromium",
        "--caps", "vision,pdf"
      ]
    },
    "google-maps": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-google-maps"
      ],
      "env": {
        "GOOGLE_MAPS_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

## 🧪 验证安装

### 1. 重启 Claude Code

配置文件修改后，需要完全重启 Claude Code CLI 会话。

### 2. 检查 MCP 服务器状态

在 Claude Code 中尝试：

```
列出所有可用的 MCP 工具
```

您应该能看到 Chrome DevTools 和 Playwright 相关的工具。

### 3. 测试 Chrome DevTools MCP

尝试以下请求：

```
请使用 Chrome DevTools 检查 https://photographalbum.vercel.app 的 LCP（最大内容绘制）性能指标
```

或者：

```
请打开 https://photographalbum.vercel.app 并截取首页的屏幕截图
```

### 4. 测试 Playwright MCP

尝试以下请求：

```
使用 Playwright 访问 https://photographalbum.vercel.app/login 页面，并检查登录表单是否正确显示
```

或者：

```
用 Playwright 模拟 iPhone 15 访问我的网站首页，并生成截图
```

## 🎯 实际应用场景

### 在 PhotoAlbum 项目中的应用

#### 1. 自动化测试（推荐使用 Playwright）

**场景**：自动运行 E2E 测试并生成报告

```
请使用 Playwright 运行以下测试流程：
1. 访问 https://photographalbum.vercel.app
2. 点击"登录"按钮
3. 输入测试账号和密码
4. 验证登录成功
5. 截图记录
```

#### 2. 性能分析（推荐使用 Chrome DevTools）

**场景**：分析页面加载性能

```
使用 Chrome DevTools 分析 https://photographalbum.vercel.app 的性能：
1. 记录页面加载追踪
2. 分析 Core Web Vitals (LCP, FID, CLS)
3. 识别性能瓶颈
4. 生成优化建议
```

#### 3. 视觉回归测试（推荐使用 Playwright）

**场景**：检查 UI 变更

```
使用 Playwright 对比以下页面的视觉变化：
1. 首页
2. 发现页
3. 搜索页
生成截图并标注差异
```

#### 4. 跨浏览器测试（推荐使用 Playwright）

**场景**：验证多浏览器兼容性

```
使用 Playwright 在以下浏览器中测试登录功能：
- Chrome
- Firefox
- Safari
记录任何兼容性问题
```

#### 5. 移动端测试（推荐使用 Playwright）

**场景**：验证移动端响应式设计

```
使用 Playwright 在以下设备上测试首页：
- iPhone 15
- Pixel 5
- iPad Pro
检查布局和交互是否正常
```

## 🔧 工具对比

| 功能 | Chrome DevTools MCP | Playwright MCP |
|------|-------------------|---------------|
| **性能分析** | ✅ 优秀 | ⚠️ 基础 |
| **网络监控** | ✅ 详细 | ✅ 支持 |
| **多浏览器** | ❌ 仅 Chrome | ✅ Chrome/Firefox/Safari |
| **移动模拟** | ⚠️ 基础 | ✅ 完整支持 |
| **自动化测试** | ⚠️ 基础 | ✅ 优秀 |
| **截图录屏** | ✅ 支持 | ✅ 支持 |
| **PDF 生成** | ❌ 不支持 | ✅ 支持 |
| **视觉识别** | ❌ 不支持 | ✅ 支持（需启用） |
| **学习曲线** | 📈 较低 | 📈 中等 |
| **启动速度** | ⚡ 快 | ⚡ 中等 |

### 使用建议

- **性能调试和分析**：使用 Chrome DevTools MCP
- **自动化测试**：使用 Playwright MCP
- **跨浏览器测试**：使用 Playwright MCP
- **快速页面检查**：使用 Chrome DevTools MCP
- **复杂交互测试**：使用 Playwright MCP

## 🛠️ 故障排查

### 问题 1：MCP 服务器无法启动

**错误信息**：
```
Failed to start MCP server: chrome-devtools
```

**解决方案**：
1. 检查 Node.js 是否已安装：`node --version`
2. 检查 npm 是否可用：`npm --version`
3. 清除 npm 缓存：`npm cache clean --force`
4. 手动安装包：`npm install -g chrome-devtools-mcp`

### 问题 2：浏览器驱动未安装

**错误信息**（Playwright）：
```
browserType.launch: Executable doesn't exist
```

**解决方案**：
```bash
# 安装 Playwright 浏览器
npx playwright install

# 或安装特定浏览器
npx playwright install chromium
```

### 问题 3：Chrome 无法启动

**错误信息**：
```
Error: Failed to launch Chrome
```

**解决方案**：
1. 确认 Chrome 已安装
2. 检查 Chrome 路径：
   ```bash
   # Windows
   where chrome

   # Linux/Mac
   which google-chrome
   ```
3. 在配置中指定 Chrome 路径（参见高级配置）

### 问题 4：权限错误

**错误信息**：
```
EACCES: permission denied
```

**解决方案**：
1. 以管理员权限运行：
   ```bash
   # Windows PowerShell
   npm install -g chrome-devtools-mcp --force
   ```
2. 检查文件权限
3. 尝试使用 npx 方式（无需全局安装）

### 问题 5：版本冲突

**错误信息**：
```
Version mismatch between MCP server and dependencies
```

**解决方案**：
1. 指定特定版本而不是 @latest：
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["@playwright/mcp@1.0.0"]
       }
     }
   }
   ```
2. 清除 npx 缓存：
   ```bash
   npx clear-npx-cache
   ```

### 问题 6：超时错误

**错误信息**：
```
Timeout waiting for MCP server to start
```

**解决方案**：
1. 增加启动超时时间：
   ```json
   {
     "mcpServers": {
       "chrome-devtools": {
         "command": "npx",
         "args": ["chrome-devtools-mcp@latest"],
         "startup_timeout_ms": 30000
       }
     }
   }
   ```
2. 检查网络连接（npx 需要下载包）
3. 使用全局安装避免每次下载

### 问题 7：配置未生效

**症状**：修改配置后 MCP 服务器没有更新

**解决方案**：
1. 完全关闭 Claude Code
2. Windows 用户需要在任务管理器中终止相关进程
3. 重新启动 Claude Code
4. 验证配置文件语法（JSON 格式）

## 🔐 安全最佳实践

### 1. 限制访问范围
```json
{
  "permissions": {
    "allow": [
      "Read(//specific/path/**)"
    ],
    "deny": [
      "Read(//**/*.env)",
      "Write(//**/*.env)"
    ],
    "ask": [
      "Bash(*)",
      "Write(**)"
    ]
  }
}
```

### 2. 使用沙箱模式

启用浏览器沙箱以提高安全性：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chromium",
        "--headless"
      ]
    }
  }
}
```

### 3. 监控资源使用

- 定期检查 MCP 进程的资源占用
- 设置合理的超时时间
- 及时清理浏览器实例

## 📚 高级功能

### 1. 自定义 Playwright 配置

创建 `playwright.config.js`：

```javascript
module.exports = {
  use: {
    baseURL: 'https://photographalbum.vercel.app',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
};
```

然后在 MCP 配置中引用：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--config", "./playwright.config.js"
      ]
    }
  }
}
```

### 2. 启用视觉识别（Playwright）

启用 vision 功能以进行视觉分析：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--caps", "vision"
      ]
    }
  }
}
```

使用示例：
```
使用 Playwright 的视觉识别功能分析首页的布局问题
```

### 3. PDF 生成（Playwright）

启用 PDF 生成功能：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--caps", "pdf"
      ]
    }
  }
}
```

使用示例：
```
使用 Playwright 将 https://photographalbum.vercel.app 首页生成 PDF
```

## 📊 性能优化建议

### 1. 使用本地安装

全局或本地安装包以加快启动速度：

```bash
# 在项目中本地安装
npm install --save-dev @playwright/mcp chrome-devtools-mcp

# 更新配置使用本地包
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp"]
    }
  }
}
```

### 2. 浏览器复用

配置浏览器实例复用以减少启动开销：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {
        "REUSE_BROWSER": "true"
      }
    }
  }
}
```

### 3. 无头模式

对于不需要可视化的任务，使用无头模式：

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless"
      ]
    }
  }
}
```

## 🔗 相关资源

### 官方文档
- [Chrome DevTools MCP GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io)
- [Claude Code MCP 配置文档](https://docs.claude.com/en/docs/claude-code/mcp)

### 教程和博客
- [Chrome DevTools MCP 官方博客](https://developer.chrome.com/blog/chrome-devtools-mcp)
- [Playwright 官方文档](https://playwright.dev)
- [MCP Awesome List](https://github.com/punkpeye/awesome-mcp-servers)

## 📝 配置检查清单

在完成配置后，请检查以下项目：

- [ ] Node.js 和 npm 已安装并版本正确
- [ ] Chrome 浏览器已安装（用于 Chrome DevTools）
- [ ] `settings.local.json` 已正确配置
- [ ] JSON 格式验证通过（无语法错误）
- [ ] Playwright 浏览器驱动已安装（如使用 Playwright）
- [ ] Claude Code 已完全重启
- [ ] MCP 服务器列表中显示新服务器
- [ ] 测试命令执行成功
- [ ] 截图和性能分析功能正常

## 🎉 完成后的能力

配置完成后，您将能够：

✅ **通过 Claude Code 直接**：
- 控制真实的浏览器实例
- 执行复杂的自动化测试
- 分析网页性能指标
- 生成页面截图和 PDF
- 模拟不同设备和浏览器
- 监控网络请求
- 调试前端问题
- 进行视觉回归测试

这将极大地提升您的 PhotoAlbum 项目的测试和调试效率！🚀

---

**下一步**：按照本指南配置 MCP 服务器，然后尝试对您的 PhotoAlbum 应用进行自动化测试和性能分析！

如有问题，请参考故障排查部分或查阅官方文档。
