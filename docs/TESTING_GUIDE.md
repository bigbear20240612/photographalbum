# PhotoAlbum 测试指南

## 📋 概述

本项目已集成 Playwright 端到端测试框架，用于验证生产环境 (https://photographalbum.vercel.app) 的所有核心功能。

## ✅ 已完成的测试集成

### 1. 测试框架安装
- ✅ Playwright v1.56.0
- ✅ 支持 Chrome、Firefox、Safari 三大浏览器
- ✅ 支持移动端测试（Pixel 5、iPhone 12）

### 2. 测试配置
- ✅ `playwright.config.ts` - 完整的测试配置
- ✅ 多浏览器并行测试
- ✅ 自动截图和视频录制（仅在失败时）
- ✅ 测试追踪和调试支持

### 3. 测试用例（共 5 个测试文件，30+ 测试用例）

#### `e2e/01-homepage.spec.ts` - 首页测试
- 页面加载和标题验证
- Hero 区域内容展示
- 功能特性区域
- 精选作品加载
- 导航栏功能
- 页脚显示
- 移动端响应式设计

#### `e2e/02-auth.spec.ts` - 认证测试
- 登录页面访问和表单
- 注册页面访问和表单
- 表单验证（空表单、必填字段）
- 输入类型验证
- 页面间导航

#### `e2e/03-discover.spec.ts` - 发现页面测试
- 页面加载
- 排序功能（最新发布、最受欢迎）
- 分类筛选
- 专辑统计
- 专辑列表加载
- 移动端布局

#### `e2e/04-search.spec.ts` - 搜索功能测试
- 搜索页面访问
- 搜索输入框
- 类型筛选（全部、用户、专辑、照片）
- 类型切换
- 搜索交互
- 移动端适配

#### `e2e/05-navigation.spec.ts` - 导航和可访问性测试
- 所有公共页面可访问性
- 导航链接功能
- Logo 返回首页
- 控制台错误检查
- 页面加载性能（< 5秒）
- 404 页面处理

### 4. NPM 脚本
在 `package.json` 中添加了以下测试脚本：

```bash
npm run test:e2e          # 运行所有测试（无头模式）
npm run test:e2e:ui       # UI 模式运行测试
npm run test:e2e:headed   # 显示浏览器窗口
npm run test:e2e:debug    # 调试模式
npm run test:e2e:report   # 查看测试报告
npm run test:install      # 安装浏览器驱动
```

### 5. CI/CD 集成
- ✅ GitHub Actions 工作流配置 (`.github/workflows/e2e-tests.yml`)
- ✅ 自动在 push 和 PR 时运行测试
- ✅ 测试结果自动上传为 Artifacts
- ✅ PR 评论显示测试结果

### 6. 文档
- ✅ `e2e/README.md` - 详细的测试文档
- ✅ `docs/TESTING_GUIDE.md` - 本指南

## 🚀 快速开始

### 首次使用

1. **安装浏览器驱动**
```bash
npm run test:install
```

2. **运行所有测试**
```bash
npm run test:e2e
```

3. **查看测试报告**
```bash
npm run test:e2e:report
```

### 本地开发测试

如果要测试本地开发服务器（而不是生产环境）：

```bash
BASE_URL=http://localhost:3000 npm run test:e2e
```

### UI 模式（推荐用于开发）

```bash
npm run test:e2e:ui
```

这会打开 Playwright UI，可以：
- 可视化查看测试执行
- 逐步调试测试
- 查看时间轴和截图
- 实时编辑测试

## 📊 测试覆盖范围

### 功能覆盖
- ✅ 页面导航和路由
- ✅ 用户界面元素显示
- ✅ 表单验证
- ✅ 响应式设计（桌面端 + 移动端）
- ✅ 页面加载性能
- ✅ 错误处理（404 页面、控制台错误）

### 浏览器覆盖
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### 测试类型
- ✅ 冒烟测试（页面可访问性）
- ✅ 功能测试（表单、搜索、筛选）
- ✅ UI 测试（元素显示、布局）
- ✅ 性能测试（加载时间）
- ✅ 可访问性测试（语义化 HTML）

## 📈 测试报告

### HTML 报告
测试完成后会生成详细的 HTML 报告：
- 位置: `playwright-report/index.html`
- 包含: 测试结果、截图、视频、追踪
- 查看: `npm run test:e2e:report`

### JSON 报告
用于 CI/CD 集成和数据分析：
- 位置: `test-results/results.json`
- 格式: 标准 JSON
- 用途: 自动化分析、趋势跟踪

### 控制台输出
实时显示测试进度：
```
Running 30 tests using 5 workers
  ✓  01-homepage.spec.ts:7:3 › 应该正确加载首页 (2.3s)
  ✓  02-auth.spec.ts:7:3 › 应该能访问登录页面 (1.8s)
  ...
  30 passed (45.2s)
```

## 🔧 故障排查

### 常见问题

**1. 浏览器未安装**
```bash
Error: browserType.launch: Executable doesn't exist
```
解决: `npm run test:install`

**2. 超时错误**
```bash
Error: Test timeout of 30000ms exceeded
```
解决: 检查网络连接，确保可以访问 https://photographalbum.vercel.app

**3. 选择器找不到元素**
- 检查页面是否加载完成
- 使用 `npm run test:e2e:headed` 查看实际页面
- 使用 `npm run test:e2e:debug` 逐步调试

### 调试技巧

**1. 查看失败截图**
```bash
# 失败的测试会自动保存截图到
test-results/[test-name]/test-failed-1.png
```

**2. 查看追踪文件**
```bash
npx playwright show-trace test-results/trace.zip
```

**3. 使用调试模式**
```bash
npm run test:e2e:debug
```

## 🎯 下一步计划

### 待添加的测试用例
- [ ] Dashboard 页面测试（需要登录）
- [ ] 照片上传流程测试
- [ ] 社交功能测试（点赞、评论、关注）
- [ ] 用户个人资料页测试
- [ ] 设置页面测试
- [ ] 管理员面板测试
- [ ] 通知功能测试
- [ ] 实时功能测试（WebSocket）

### 测试增强
- [ ] 添加视觉回归测试
- [ ] 添加性能基准测试
- [ ] 添加可访问性（a11y）测试
- [ ] 添加 API 测试
- [ ] 添加数据库状态验证

### CI/CD 优化
- [ ] 并行测试优化
- [ ] 测试分片（sharding）
- [ ] 测试结果趋势报告
- [ ] Slack/Discord 通知集成

## 📚 参考资源

- [Playwright 官方文档](https://playwright.dev)
- [测试最佳实践](https://playwright.dev/docs/best-practices)
- [CI/CD 集成指南](https://playwright.dev/docs/ci)
- [项目测试文档](../e2e/README.md)

## 💡 贡献指南

### 添加新测试

1. 在 `e2e/` 目录创建新测试文件
2. 遵循命名约定: `[序号]-[功能名].spec.ts`
3. 使用描述性的测试名称
4. 添加适当的注释
5. 运行测试确保通过
6. 更新文档

### 测试编写规范

```typescript
import { test, expect } from '@playwright/test';

test.describe('功能模块名称', () => {
  test('应该能够完成某个操作', async ({ page }) => {
    // 1. 导航
    await page.goto('/path');

    // 2. 操作
    await page.getByRole('button', { name: /按钮名/i }).click();

    // 3. 验证
    await expect(page.getByText(/预期文本/i)).toBeVisible();
  });
});
```

## 📞 支持

遇到问题？
1. 查看 [e2e/README.md](../e2e/README.md) 详细文档
2. 查看 Playwright 官方文档
3. 在项目仓库提交 Issue

---

**最后更新**: 2025-10-12
**测试框架版本**: Playwright v1.56.0
**Node 版本要求**: >= 18.0.0
