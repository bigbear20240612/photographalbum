# Playwright E2E 测试文档

## 概述

本测试套件使用 Playwright 对 PhotoAlbum 应用进行端到端测试，验证所有核心功能和用户流程。

## 测试覆盖范围

### 1. 首页测试 (`01-homepage.spec.ts`)
- ✅ 页面正确加载和标题显示
- ✅ Hero 区域内容展示
- ✅ 功能特性区域展示
- ✅ 精选作品区域加载
- ✅ 导航栏功能
- ✅ 页脚显示
- ✅ 响应式设计（移动端）

### 2. 认证测试 (`02-auth.spec.ts`)
- ✅ 登录页面访问和表单元素
- ✅ 注册页面访问和表单元素
- ✅ 表单验证（空表单提交）
- ✅ 输入类型验证（email, password）
- ✅ 登录/注册页面间导航
- ✅ 表单链接正确性

### 3. 发现页面测试 (`03-discover.spec.ts`)
- ✅ 发现页面正确加载
- ✅ 排序选项显示和切换（最新发布、最受欢迎）
- ✅ 分类筛选显示和切换
- ✅ 专辑统计信息显示
- ✅ 专辑列表加载
- ✅ 响应式设计（移动端）

### 4. 搜索功能测试 (`04-search.spec.ts`)
- ✅ 搜索页面访问
- ✅ 搜索输入框和按钮显示
- ✅ 搜索类型标签显示（全部、用户、专辑、照片）
- ✅ 搜索类型切换功能
- ✅ 初始提示显示
- ✅ 搜索输入功能
- ✅ 响应式设计（移动端）

### 5. 导航和可访问性测试 (`05-navigation.spec.ts`)
- ✅ 所有公共页面可访问性（首页、登录、注册、发现、搜索）
- ✅ 导航栏链接正常工作
- ✅ Logo 链接返回首页
- ✅ 控制台错误检查
- ✅ 页面加载性能（5秒内）
- ✅ 404 页面处理

## 测试环境配置

### 浏览器支持
- **桌面端**: Chrome, Firefox, Safari
- **移动端**: Pixel 5 (Mobile Chrome), iPhone 12 (Mobile Safari)

### 测试配置
- **并行测试**: 启用（fullyParallel: true）
- **重试次数**: CI 环境 2 次，本地 0 次
- **超时时间**: 导航超时 30 秒
- **截图**: 仅在失败时
- **视频**: 仅在失败时保留
- **追踪**: 首次重试时启用

## 快速开始

### 1. 安装浏览器驱动
```bash
npm run test:install
```

### 2. 运行测试

#### 运行所有测试（无头模式）
```bash
npm run test:e2e
```

#### 运行测试并显示 UI 界面
```bash
npm run test:e2e:ui
```

#### 运行测试并显示浏览器窗口
```bash
npm run test:e2e:headed
```

#### 调试模式运行测试
```bash
npm run test:e2e:debug
```

#### 查看测试报告
```bash
npm run test:e2e:report
```

### 3. 运行特定测试文件
```bash
npx playwright test e2e/01-homepage.spec.ts
```

### 4. 运行特定浏览器测试
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 环境变量

### BASE_URL
测试的目标 URL，默认为生产环境：
```bash
BASE_URL=https://photographalbum.vercel.app
```

本地测试时可以修改为：
```bash
BASE_URL=http://localhost:3000 npm run test:e2e
```

## 测试报告

测试完成后会生成以下报告：

### HTML 报告
- 位置: `playwright-report/index.html`
- 查看命令: `npm run test:e2e:report`
- 包含: 测试结果、截图、视频、追踪信息

### JSON 报告
- 位置: `test-results/results.json`
- 用途: CI/CD 集成、数据分析

### 控制台输出
- 实时显示测试进度和结果
- 显示通过/失败的测试用例

## 测试编写指南

### 测试结构
```typescript
import { test, expect } from '@playwright/test';

test.describe('功能模块名称', () => {
  test('应该能够完成某个操作', async ({ page }) => {
    // 1. 导航到页面
    await page.goto('/path');

    // 2. 执行操作
    await page.getByRole('button', { name: /按钮名/i }).click();

    // 3. 验证结果
    await expect(page.getByText(/预期文本/i)).toBeVisible();
  });
});
```

### 最佳实践

1. **使用语义化选择器**
   ```typescript
   // 推荐
   page.getByRole('button', { name: /登录/i })
   page.getByLabel(/邮箱/i)

   // 避免
   page.locator('#btn-login')
   ```

2. **等待元素可见**
   ```typescript
   await expect(element).toBeVisible({ timeout: 10000 });
   ```

3. **测试响应式设计**
   ```typescript
   await page.setViewportSize({ width: 375, height: 667 });
   ```

4. **处理异步操作**
   ```typescript
   await page.waitForTimeout(2000); // 仅在必要时使用
   await expect(element).toBeVisible(); // 更推荐
   ```

## CI/CD 集成

### GitHub Actions 示例
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 故障排查

### 测试失败时的检查清单

1. **检查截图和视频**
   - 位置: `test-results/` 目录
   - 查看失败时的页面状态

2. **查看追踪文件**
   ```bash
   npx playwright show-trace test-results/trace.zip
   ```

3. **本地重现**
   ```bash
   npm run test:e2e:headed
   npm run test:e2e:debug
   ```

4. **检查网络连接**
   - 确保可以访问测试 URL
   - 检查 API 端点是否正常

5. **更新浏览器驱动**
   ```bash
   npm run test:install
   ```

## 扩展测试

### 添加新测试文件
1. 在 `e2e/` 目录创建新文件: `06-new-feature.spec.ts`
2. 遵循现有测试的命名和结构
3. 使用描述性的测试名称

### 添加测试覆盖的功能
- [ ] Dashboard 页面测试
- [ ] 照片上传流程测试
- [ ] 社交功能测试（点赞、评论、关注）
- [ ] 用户个人资料页测试
- [ ] 设置页面测试
- [ ] 管理员面板测试
- [ ] 通知功能测试

## 性能基准

### 页面加载时间目标
- 首页: < 5 秒
- 登录/注册页: < 3 秒
- 发现页: < 5 秒
- 搜索页: < 3 秒

### 交互响应时间目标
- 按钮点击响应: < 200ms
- 表单提交: < 1 秒
- 页面切换: < 500ms

## 维护建议

1. **定期运行测试**
   - 每次代码提交前
   - 每次 PR 创建时
   - 每日定时运行

2. **保持测试更新**
   - UI 变更时更新选择器
   - 新功能添加时添加测试
   - 删除功能时移除相关测试

3. **监控测试健康度**
   - 跟踪测试通过率
   - 分析失败原因
   - 优化不稳定的测试

## 资源链接

- [Playwright 官方文档](https://playwright.dev)
- [Playwright 测试最佳实践](https://playwright.dev/docs/best-practices)
- [项目仓库](https://github.com/bigbear20240612/photographalbum)

## 支持

如遇到测试相关问题，请：
1. 查看本文档的故障排查部分
2. 查看 Playwright 官方文档
3. 在项目仓库提交 Issue
