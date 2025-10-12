# Google MCP 服务器配置指南

本指南将帮助您配置 Google Maps MCP 服务器，以便在 Claude Code 中使用 Google Maps API 功能。

## 📋 前置要求

- Node.js (LTS 版本，建议 18.0 或更高)
- npm 包管理器
- Google Cloud 账号
- Claude Code CLI 已安装

## 🔑 第一步：获取 Google Maps API Key

### 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击项目下拉菜单，选择"新建项目"
3. 输入项目名称（例如：`photoalbum-mcp`）
4. 点击"创建"

### 2. 启用 Google Maps API

1. 在 Google Cloud Console 中，进入"API 和服务" → "库"
2. 搜索并启用以下 API：
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API**
   - **Directions API**
   - **Distance Matrix API**
   - **Elevation API**

### 3. 创建 API 密钥

1. 进入"API 和服务" → "凭据"
2. 点击"创建凭据" → "API 密钥"
3. 复制生成的 API 密钥（格式类似：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`）

### 4. 限制 API 密钥（推荐）

为了安全起见，建议限制 API 密钥的使用：

1. 点击刚创建的 API 密钥进入编辑页面
2. 在"应用限制"部分，选择"HTTP 引荐来源网址"
3. 添加您的域名：
   - `https://photographalbum.vercel.app/*`
   - `http://localhost:3000/*`（用于本地开发）
4. 在"API 限制"部分，选择"限制密钥"
5. 选择您启用的所有 Maps API
6. 点击"保存"

### 5. 设置计费（必需）

Google Maps Platform 需要启用计费账号：

1. 进入"结算" → "账号管理"
2. 点击"设置结算账号"
3. 输入支付信息

**注意**: Google 提供每月 $200 的免费额度，足够大多数开发和测试使用。

## ⚙️ 第二步：配置 Claude Code MCP 服务器

### 方法 1：使用官方 MCP 服务器（推荐）

1. **编辑 Claude Code 配置文件**

   Windows 路径：`C:\Users\Administrator\.claude\settings.local.json`

2. **添加 MCP 服务器配置**

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

3. **替换 API 密钥**

   将 `YOUR_API_KEY_HERE` 替换为您在第一步获取的实际 API 密钥。

### 方法 2：使用环境变量（更安全）

1. **创建环境变量文件**

   在项目根目录创建 `.env.local` 文件：

   ```env
   GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

2. **更新 .gitignore**

   确保 `.env.local` 已添加到 `.gitignore`：

   ```gitignore
   .env.local
   .env*.local
   ```

3. **修改配置文件**

   编辑 `settings.local.json`：

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
       "google-maps": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-google-maps"
         ],
         "env": {
           "GOOGLE_MAPS_API_KEY": "${GOOGLE_MAPS_API_KEY}"
         }
       }
     }
   }
   ```

### 方法 3：使用 Google Maps Platform Code Assist（官方文档工具）

这个 MCP 服务器提供官方文档和代码示例的访问：

```json
{
  "mcpServers": {
    "google-maps-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@googlemaps/code-assist-mcp@latest"
      ]
    }
  }
}
```

**注意**: 此服务器不需要 API 密钥，主要用于获取文档和代码示例。

## 🧪 第三步：验证配置

### 1. 重启 Claude Code

配置文件修改后，需要重启 Claude Code CLI 会话。

### 2. 检查 MCP 服务器状态

在 Claude Code 中执行：

```bash
# 列出所有可用的 MCP 服务器
claude mcp list
```

您应该能看到 `google-maps` 服务器已列出。

### 3. 测试 Google Maps 功能

在 Claude Code 对话中，尝试以下请求：

```
请使用 Google Maps API 获取以下地址的坐标：
北京市朝阳区三里屯太古里
```

或者：

```
请使用 Google Maps 计算从北京到上海的驾车路线距离
```

如果配置正确，Claude Code 将能够调用 Google Maps MCP 服务器并返回结果。

## 🔧 可用的 Google Maps 功能

配置完成后，您可以使用以下功能：

### 1. 地理编码
- 将地址转换为坐标
- 反向地理编码（坐标转地址）

### 2. 地点搜索
- 搜索附近的地点
- 获取地点详细信息
- 地点自动补全

### 3. 路线规划
- 计算两点间的路线
- 多种交通方式（驾车、步行、骑行、公交）
- 实时交通信息

### 4. 距离计算
- 计算多个起点到多个终点的距离
- 距离矩阵

### 5. 海拔数据
- 获取特定位置的海拔信息

## 🛠️ 故障排查

### 问题 1: MCP 服务器无法启动

**错误**: `Failed to start MCP server: google-maps`

**解决方案**:
1. 检查 Node.js 是否已安装：`node --version`
2. 检查 npx 是否可用：`npx --version`
3. 手动安装包：`npm install -g @modelcontextprotocol/server-google-maps`

### 问题 2: API 密钥无效

**错误**: `API key is invalid or missing`

**解决方案**:
1. 检查 API 密钥是否正确复制（无空格）
2. 确认已在 Google Cloud Console 启用所需的 API
3. 检查 API 密钥限制设置
4. 确认计费账号已启用

### 问题 3: API 配额超限

**错误**: `OVER_QUERY_LIMIT`

**解决方案**:
1. 检查 Google Cloud Console 中的配额使用情况
2. 考虑升级到付费计划
3. 优化 API 调用频率

### 问题 4: 权限错误

**错误**: `Permission denied`

**解决方案**:
1. 检查 `settings.local.json` 文件权限
2. 确保文件格式为有效的 JSON
3. 检查 API 密钥是否有访问所需 API 的权限

## 🔐 安全最佳实践

### 1. 保护 API 密钥
- ❌ 不要将 API 密钥提交到 Git
- ✅ 使用环境变量存储密钥
- ✅ 添加 `.env.local` 到 `.gitignore`

### 2. 限制 API 密钥
- ✅ 设置 HTTP 引荐来源限制
- ✅ 限制可访问的 API
- ✅ 定期轮换密钥

### 3. 监控使用情况
- ✅ 定期检查 API 使用量
- ✅ 设置预算警报
- ✅ 删除未使用的密钥

## 📊 成本管理

### 免费额度（每月）
- **前 $200**: 免费
- **地理编码**: 前 40,000 次请求免费
- **地点搜索**: 前 28,000 次请求免费
- **路线**: 前 40,000 次请求免费

### 超出免费额度的定价
- **地理编码**: $5.00 / 1,000 次请求
- **地点详情**: $17.00 / 1,000 次请求
- **路线**: $5.00 / 1,000 次请求

详细定价请参考：[Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

## 📚 其他可用的 Google MCP 服务器

### 1. Google Analytics MCP
```json
{
  "mcpServers": {
    "google-analytics": {
      "command": "npx",
      "args": ["-y", "@google-analytics/mcp-server"]
    }
  }
}
```

### 2. Firebase MCP
```json
{
  "mcpServers": {
    "firebase": {
      "command": "npx",
      "args": ["-y", "firebase-tools", "mcp"]
    }
  }
}
```

### 3. Google Search MCP
```json
{
  "mcpServers": {
    "google-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-search"],
      "env": {
        "GOOGLE_API_KEY": "YOUR_API_KEY",
        "GOOGLE_CSE_ID": "YOUR_SEARCH_ENGINE_ID"
      }
    }
  }
}
```

## 🎯 实际应用示例

### 在 PhotoAlbum 项目中的应用

1. **地理位置标记**
   - 为照片添加拍摄地点
   - 自动根据坐标获取地址

2. **地图展示**
   - 在照片详情页显示拍摄位置地图
   - 创建摄影作品地理分布视图

3. **路线规划**
   - 规划摄影路线
   - 计算多个拍摄点之间的距离

4. **地点推荐**
   - 推荐附近的摄影景点
   - 搜索特定类型的拍摄地点

## 🔗 相关资源

- [Google Maps Platform 文档](https://developers.google.com/maps)
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io)
- [Claude Code MCP 配置文档](https://docs.claude.com/en/docs/claude-code/mcp)
- [Google Maps MCP Server GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps)

## 📝 配置检查清单

在完成配置后，请检查以下项目：

- [ ] Google Cloud 项目已创建
- [ ] 所需的 Google Maps API 已启用
- [ ] API 密钥已创建并复制
- [ ] API 密钥已设置访问限制
- [ ] 计费账号已启用
- [ ] `settings.local.json` 已正确配置
- [ ] API 密钥已妥善保存（环境变量或安全存储）
- [ ] `.env.local` 已添加到 `.gitignore`
- [ ] MCP 服务器启动成功
- [ ] 测试 API 调用成功

---

**配置完成后，您就可以在 Claude Code 中使用强大的 Google Maps 功能了！** 🎉

如有问题，请参考故障排查部分或查阅官方文档。
