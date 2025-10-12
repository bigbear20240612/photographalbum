# MCP 服务器快速参考卡

## 🚀 一键配置

### 步骤 1: 复制配置模板
```bash
# Windows PowerShell
Copy-Item .claude.settings.example.json $env:USERPROFILE\.claude\settings.local.json

# Linux/Mac
cp .claude.settings.example.json ~/.claude/settings.local.json
```

### 步骤 2: 编辑配置文件
```bash
# Windows
notepad C:\Users\Administrator\.claude\settings.local.json

# Linux/Mac
nano ~/.claude/settings.local.json
```

### 步骤 3: 替换 API 密钥
将 `YOUR_GOOGLE_MAPS_API_KEY_HERE` 替换为您的实际密钥

### 步骤 4: 安装浏览器（可选）
```bash
npx playwright install chromium
```

### 步骤 5: 重启 Claude Code
完全关闭并重新打开 CLI 会话

---

## 📋 MCP 服务器速查表

### Chrome DevTools MCP
```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["chrome-devtools-mcp@latest"]
  }
}
```
**用途**: 调试、性能分析、截图
**需要 API Key**: ❌
**文档**: [BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)

---

### Playwright MCP
```json
{
  "playwright": {
    "command": "npx",
    "args": ["@playwright/mcp@latest", "--browser", "chromium"]
  }
}
```
**用途**: 自动化测试、多浏览器、移动端
**需要 API Key**: ❌
**文档**: [BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)

---

### Google Maps MCP
```json
{
  "google-maps": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-google-maps"],
    "env": {
      "GOOGLE_MAPS_API_KEY": "YOUR_KEY"
    }
  }
}
```
**用途**: 地图、地理编码、路线规划
**需要 API Key**: ✅
**文档**: [GOOGLE_MCP_SETUP.md](./GOOGLE_MCP_SETUP.md)

---

## 🧪 快速测试命令

### 测试 Chrome DevTools
```
请使用 Chrome DevTools 检查 https://photographalbum.vercel.app 的性能指标
```

### 测试 Playwright
```
使用 Playwright 访问 https://photographalbum.vercel.app 并截图
```

### 测试 Google Maps
```
使用 Google Maps 获取北京天安门的坐标
```

---

## 🛠️ 常见问题快速解决

### 问题: 服务器无法启动
```bash
# 清除缓存
npm cache clean --force

# 手动安装
npm install -g chrome-devtools-mcp @playwright/mcp
```

### 问题: 浏览器驱动未安装
```bash
npx playwright install
```

### 问题: 配置未生效
1. 完全关闭 Claude Code
2. Windows: 任务管理器中结束相关进程
3. 重新启动

---

## 📊 功能对比

| 功能 | Chrome DevTools | Playwright | Google Maps |
|------|----------------|-----------|-------------|
| 性能分析 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | N/A |
| 自动化测试 | ⭐⭐ | ⭐⭐⭐⭐⭐ | N/A |
| 多浏览器 | ❌ | ✅ | N/A |
| 移动模拟 | ⭐⭐ | ⭐⭐⭐⭐⭐ | N/A |
| 地图服务 | N/A | N/A | ⭐⭐⭐⭐⭐ |
| 需要 API Key | ❌ | ❌ | ✅ |

---

## 🎯 使用建议

| 任务类型 | 推荐工具 |
|---------|---------|
| 性能调试 | Chrome DevTools |
| E2E 测试 | Playwright |
| 跨浏览器测试 | Playwright |
| 移动端测试 | Playwright |
| 地理位置功能 | Google Maps |
| 快速页面检查 | Chrome DevTools |

---

## 📚 完整文档

- **[MCP_README.md](./MCP_README.md)** - 总览和配置指南
- **[BROWSER_MCP_SETUP.md](./BROWSER_MCP_SETUP.md)** - 浏览器 MCP 详细配置
- **[GOOGLE_MCP_SETUP.md](./GOOGLE_MCP_SETUP.md)** - Google MCP 详细配置
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Playwright 测试指南

---

**版本**: 1.0.0
**最后更新**: 2025-10-12
