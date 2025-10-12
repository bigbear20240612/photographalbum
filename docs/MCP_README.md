# MCP 服务器配置总览

本文档提供 PhotoAlbum 项目中所有可用 MCP 服务器的快速参考和配置指南。

## 📚 文档导航

本项目提供了以下 MCP 配置文档：

1. **[BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)** - 浏览器自动化 MCP（Chrome DevTools、Playwright）
2. **[GOOGLE_MCP_SETUP.md](./GOOGLE_MCP_SETUP.md)** - Google 服务 MCP（Google Maps）

## 🎯 快速开始

### 配置文件位置

**Windows**: `C:\Users\Administrator\.claude\settings.local.json`
**Linux/Mac**: `~/.claude/settings.local.json`

### 配置模板

项目根目录提供了完整的配置模板：`.claude.settings.example.json`

## 🔧 已集成的 MCP 服务器

### 1. Chrome DevTools MCP
**用途**: 浏览器调试和性能分析

**功能**:
- 🔍 页面检查和调试
- 📊 性能分析（Core Web Vitals）
- 🌐 网络请求监控
- 📸 截图和录屏
- 🐛 控制台日志分析

**配置**:
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

**文档**: [BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)

---

### 2. Playwright MCP
**用途**: 多浏览器自动化测试

**功能**:
- 🌐 支持 Chrome、Firefox、Safari
- 📱 移动设备模拟
- 🤖 智能元素定位
- 📄 PDF 生成
- 🎭 视觉识别
- ⚡ 可靠的自动化

**配置**:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chromium",
        "--caps", "vision,pdf"
      ]
    }
  }
}
```

**文档**: [BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)

---

### 3. Google Maps MCP
**用途**: 地图和地理位置服务

**功能**:
- 📍 地理编码（地址 ↔ 坐标）
- 🔍 地点搜索
- 🗺️ 路线规划
- 📏 距离计算
- ⛰️ 海拔数据

**配置**:
```json
{
  "mcpServers": {
    "google-maps": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-maps"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

**前置要求**: 需要 Google Maps API Key
**文档**: [GOOGLE_MCP_SETUP.md](./GOOGLE_MCP_SETUP.md)

---

### 4. Google Maps 文档助手
**用途**: 获取官方文档和代码示例

**功能**:
- 📖 官方文档查询
- 💡 代码示例
- 🎓 最佳实践

**配置**:
```json
{
  "mcpServers": {
    "google-maps-docs": {
      "command": "npx",
      "args": ["-y", "@googlemaps/code-assist-mcp@latest"]
    }
  }
}
```

**前置要求**: 无需 API Key
**文档**: [GOOGLE_MCP_SETUP.md](./GOOGLE_MCP_SETUP.md)

## 🎨 完整配置示例

将所有 MCP 服务器整合到一个配置文件：

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
      "args": ["-y", "@modelcontextprotocol/server-google-maps"],
      "env": {
        "GOOGLE_MAPS_API_KEY": "YOUR_API_KEY_HERE"
      }
    },
    "google-maps-docs": {
      "command": "npx",
      "args": ["-y", "@googlemaps/code-assist-mcp@latest"]
    }
  }
}
```

## 📋 安装步骤

### 1. 准备工作

确保已安装：
- Node.js (v18.0 或更高)
- npm
- Claude Code CLI

### 2. 复制配置模板

```bash
# 在项目根目录
cp .claude.settings.example.json ~/.claude/settings.local.json

# Windows PowerShell
Copy-Item .claude.settings.example.json $env:USERPROFILE\.claude\settings.local.json
```

### 3. 配置 API 密钥

编辑 `~/.claude/settings.local.json`，替换以下内容：

- `YOUR_API_KEY_HERE` → 您的 Google Maps API Key

### 4. 安装浏览器驱动（可选但推荐）

```bash
# 安装 Playwright 浏览器
npx playwright install

# 仅安装 Chromium
npx playwright install chromium
```

### 5. 重启 Claude Code

配置文件修改后需要完全重启 CLI 会话。

### 6. 验证安装

在 Claude Code 中测试：

```
列出所有可用的 MCP 工具
```

## 🎯 使用场景

### PhotoAlbum 项目中的应用

#### 1. 自动化测试
**使用**: Playwright MCP

```
使用 Playwright 测试登录流程：
1. 访问登录页面
2. 输入测试账号
3. 验证登录成功
4. 截图记录
```

#### 2. 性能优化
**使用**: Chrome DevTools MCP

```
分析首页的 Core Web Vitals 性能指标，识别优化点
```

#### 3. 地理位置功能
**使用**: Google Maps MCP

```
为照片添加地理位置标记，根据坐标获取地址信息
```

#### 4. 跨浏览器测试
**使用**: Playwright MCP

```
在 Chrome、Firefox 和 Safari 中测试发现页面的兼容性
```

#### 5. 移动端测试
**使用**: Playwright MCP

```
在 iPhone 15 和 Pixel 5 上测试响应式设计
```

## 🛠️ 常见问题

### Q: MCP 服务器无法启动？
**A**: 检查 Node.js 版本，清除 npm 缓存，尝试手动安装包。

详见：
- [BROWSER_MCP_SETUP.md - 故障排查](./BROWSER_MCP_SETUP.md#%F0%9F%9B%A0%EF%B8%8F-%E6%95%85%E9%9A%9C%E6%8E%92%E6%9F%A5)
- [GOOGLE_MCP_SETUP.md - 故障排查](./GOOGLE_MCP_SETUP.md#%F0%9F%94%A7-%E6%95%85%E9%9A%9C%E6%8E%92%E6%9F%A5)

### Q: 浏览器驱动未安装？
**A**: 运行 `npx playwright install`

### Q: Google Maps API 密钥无效？
**A**:
1. 确认已在 Google Cloud Console 启用相关 API
2. 检查 API 密钥限制设置
3. 确认计费账号已启用

### Q: 配置修改后没有生效？
**A**:
1. 完全关闭 Claude Code
2. Windows 用户需要在任务管理器中终止相关进程
3. 重新启动 Claude Code

## 🔐 安全提醒

⚠️ **重要**：
- `.claude/settings.local.json` 包含 API 密钥，已添加到 `.gitignore`
- 不要将真实配置文件提交到 Git
- 使用 `.claude.settings.example.json` 作为模板分享
- 定期轮换 API 密钥

## 📊 MCP 服务器对比

| 服务器 | 用途 | 需要 API Key | 启动速度 | 学习曲线 |
|--------|------|-------------|----------|----------|
| Chrome DevTools | 调试/性能 | ❌ | ⚡ 快 | 📈 低 |
| Playwright | 自动化测试 | ❌ | ⚡ 中等 | 📈 中等 |
| Google Maps | 地图服务 | ✅ | ⚡ 快 | 📈 低 |
| Google Maps Docs | 文档查询 | ❌ | ⚡ 快 | 📈 低 |

## 🎓 学习资源

### 官方文档
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Claude Code MCP](https://docs.claude.com/en/docs/claude-code/mcp)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [Playwright](https://playwright.dev)
- [Google Maps Platform](https://developers.google.com/maps)

### 项目文档
- [浏览器 MCP 配置指南](./BROWSER_MCP_SETUP.md)
- [Google MCP 配置指南](./GOOGLE_MCP_SETUP.md)
- [Playwright 测试指南](./TESTING_GUIDE.md)
- [E2E 测试文档](../e2e/README.md)

## 🚀 进阶配置

### 性能优化

**本地安装包**（加快启动）:
```bash
npm install -g chrome-devtools-mcp @playwright/mcp @modelcontextprotocol/server-google-maps
```

**配置文件更新**:
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

### 自定义浏览器路径

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"],
      "env": {
        "CHROME_PATH": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      }
    }
  }
}
```

### 多环境配置

创建不同环境的配置：

- `settings.local.json` - 本地开发
- `settings.staging.json` - 测试环境
- `settings.production.json` - 生产环境

## 📞 获取帮助

遇到问题？

1. 查看相关文档的故障排查部分
2. 检查 [MCP Awesome List](https://github.com/punkpeye/awesome-mcp-servers)
3. 在项目仓库提交 Issue
4. 查阅官方文档

## 🎉 配置完成后

您将能够：

✅ 通过 Claude Code 直接控制浏览器
✅ 自动化复杂的测试流程
✅ 分析网页性能和调试问题
✅ 使用 Google Maps 服务
✅ 进行跨浏览器和移动端测试
✅ 生成截图、PDF 和测试报告

---

**版本**: 1.0.0
**最后更新**: 2025-10-12
**维护者**: PhotoAlbum Team
