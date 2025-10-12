# Git 代理配置指南

## 📋 概述

本指南帮助您配置 Git 使用代理服务器，解决网络连接问题。

---

## 🔍 检测代理端口

### 方法 1: 查看代理软件设置

检查您正在使用的代理软件的端口设置：

- **Clash/ClashX**: 通常是 `7890` (HTTP) 和 `7891` (SOCKS5)
- **V2RayN**: 通常是 `10808` (HTTP) 和 `10809` (SOCKS5)
- **Shadowsocks**: 通常是 `1080` (SOCKS5)
- **Qv2ray**: 通常是 `8889` (HTTP)

### 方法 2: 查看系统代理设置

**Windows**:
1. 打开 `设置` → `网络和 Internet` → `代理`
2. 查看 `手动代理设置` 中的地址和端口

**方法 3: 命令行检测**

```bash
# 查看所有监听端口
netstat -ano | findstr "LISTEN"

# 查看特定端口（如 7890）
netstat -ano | findstr "7890"
```

---

## ⚙️ 配置 Git 代理

### 快速配置（使用脚本）

我们提供了自动配置脚本：

```bash
# 进入项目目录
cd D:\data\CLAUDE_USE\Vercel\photographalbum

# 运行配置脚本
scripts\setup-git-proxy.bat
```

脚本提供以下选项：
1. Clash/ClashX 默认 (127.0.0.1:7890)
2. V2RayN 默认 (127.0.0.1:10808)
3. Shadowsocks 默认 (127.0.0.1:1080)
4. 自定义代理地址
5. 清除代理设置

### 手动配置

#### 配置 HTTP/HTTPS 代理

```bash
# 设置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7890

# 设置 HTTPS 代理
git config --global https.proxy http://127.0.0.1:7890
```

#### 配置 SOCKS5 代理

```bash
# 使用 SOCKS5 协议
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080
```

#### 为特定域名设置代理（推荐）

只为 GitHub 设置代理，其他保持直连：

```bash
# 仅为 GitHub 配置代理
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890
```

---

## ✅ 验证配置

### 查看当前代理设置

```bash
# 查看 HTTP 代理
git config --global --get http.proxy

# 查看 HTTPS 代理
git config --global --get https.proxy

# 查看所有配置
git config --global --list | findstr proxy
```

### 测试连接

```bash
# 测试 GitHub 连接
git ls-remote https://github.com/bigbear20240612/photographalbum.git

# 如果成功，会显示分支列表
```

---

## 🗑️ 清除代理设置

### 清除全局代理

```bash
# 清除 HTTP 代理
git config --global --unset http.proxy

# 清除 HTTPS 代理
git config --global --unset https.proxy
```

### 清除特定域名代理

```bash
# 清除 GitHub 专用代理
git config --global --unset http.https://github.com.proxy
git config --global --unset https.https://github.com.proxy
```

---

## 🔧 常见问题

### 问题 1: 连接超时

**错误信息**:
```
fatal: unable to access 'https://github.com/...': Failed to connect to 127.0.0.1 port 7890
```

**解决方案**:
1. 检查代理软件是否运行
2. 确认代理端口是否正确
3. 尝试其他端口或清除代理设置

```bash
# 清除代理，尝试直连
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 问题 2: 代理认证失败

**错误信息**:
```
fatal: unable to access '...': Proxy CONNECT aborted
```

**解决方案**:
如果代理需要用户名和密码：

```bash
git config --global http.proxy http://username:password@127.0.0.1:7890
```

### 问题 3: SSL 证书验证失败

**错误信息**:
```
SSL certificate problem: unable to get local issuer certificate
```

**临时解决方案**（不推荐用于生产）:
```bash
git config --global http.sslVerify false
```

**推荐解决方案**:
更新 Git 到最新版本，或者配置正确的 CA 证书。

### 问题 4: 代理工作但速度很慢

**解决方案**:
1. 尝试不同的代理服务器
2. 切换代理协议（HTTP vs SOCKS5）
3. 检查代理服务器的网络质量

---

## 📊 代理配置对比

| 配置方式 | 优点 | 缺点 | 推荐度 |
|---------|------|------|--------|
| **全局 HTTP 代理** | 简单易用 | 影响所有 Git 操作 | ⭐⭐⭐ |
| **特定域名代理** | 精准控制 | 配置稍复杂 | ⭐⭐⭐⭐⭐ |
| **SOCKS5 代理** | 支持更多协议 | 需要支持 SOCKS5 | ⭐⭐⭐⭐ |
| **直接连接** | 无需配置 | 可能无法访问 | ⭐⭐ |

---

## 🎯 推荐配置

### 最佳实践配置

```bash
# 1. 仅为 GitHub 配置代理（推荐）
git config --global http.https://github.com.proxy http://127.0.0.1:7890
git config --global https.https://github.com.proxy http://127.0.0.1:7890

# 2. 设置连接超时时间
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999

# 3. 增加缓冲区大小（提升大文件传输）
git config --global http.postBuffer 524288000
```

---

## 📝 配置文件位置

Git 全局配置文件位置：

**Windows**: `C:\Users\你的用户名\.gitconfig`

**Linux/Mac**: `~/.gitconfig`

可以直接编辑此文件：

```ini
[http]
    proxy = http://127.0.0.1:7890
    lowSpeedLimit = 0
    lowSpeedTime = 999999
    postBuffer = 524288000
[https]
    proxy = http://127.0.0.1:7890
[http "https://github.com"]
    proxy = http://127.0.0.1:7890
```

---

## 🚀 快速参考

### 常用命令速查

```bash
# 设置代理
git config --global http.proxy http://127.0.0.1:7890

# 查看代理
git config --global --get http.proxy

# 清除代理
git config --global --unset http.proxy

# 测试连接
git ls-remote https://github.com/bigbear20240612/photographalbum.git

# 查看所有配置
git config --global --list
```

### 常见端口速查

| 软件 | HTTP 端口 | SOCKS5 端口 |
|------|----------|------------|
| Clash/ClashX | 7890 | 7891 |
| V2RayN | 10808 | 10809 |
| Shadowsocks | - | 1080 |
| Qv2ray | 8889 | 1088 |

---

## ⚠️ 安全提示

1. **不要在公共网络上使用未加密的代理**
2. **避免在代理 URL 中明文存储密码**
3. **定期更换代理密码**
4. **不要将 .gitconfig 文件提交到版本控制**

---

## 📚 相关文档

- [Git 官方文档 - HTTP 代理](https://git-scm.com/docs/git-config#Documentation/git-config.txt-httpproxy)
- [GitHub 帮助 - 使用 SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [项目 README](../README.md)

---

## 🎉 成功案例

### 2025-10-12 配置记录

**环境**: Windows 10, Git 2.x
**问题**: GitHub push 超时
**解决方案**: 尝试多个代理端口后，发现直接连接可用
**配置**: 清除所有代理设置
**结果**: ✅ 推送成功

```bash
# 实际使用的命令
git config --global --unset http.proxy
git config --global --unset https.proxy
git push origin master
# 输出: To https://github.com/.../master
```

---

**版本**: 1.0.0
**最后更新**: 2025-10-12
**维护者**: PhotoAlbum Team
