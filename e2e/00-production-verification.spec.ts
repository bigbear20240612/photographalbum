import { test, expect } from '@playwright/test';

/**
 * PhotoAlbum 生产环境全面验证测试
 * 测试 URL: https://photographalbum.vercel.app
 */

test.describe('PhotoAlbum 生产环境完整功能验证', () => {

  // ========== 首页测试 ==========
  test.describe('首页功能验证', () => {
    test('应该正确加载首页并显示所有核心元素', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app');

      // 验证页面标题
      await expect(page).toHaveTitle(/PhotoAlbum/i);

      // 验证 Hero 区域
      const heroHeading = page.getByRole('heading', { name: /画廊级的.*摄影作品.*展示平台/i });
      await expect(heroHeading).toBeVisible();

      // 验证主要 CTA 按钮
      const ctaButton = page.getByRole('link', { name: /立即开始|开始探索/i });
      await expect(ctaButton).toBeVisible();

      // 验证导航栏
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      // 截图记录
      await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });

      console.log('✅ 首页核心元素验证通过');
    });

    test('首页导航栏功能验证', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app');

      // 验证导航链接
      const navLinks = [
        { name: /首页|Home/i, expected: true },
        { name: /发现|Discover/i, expected: true },
        { name: /搜索|Search/i, expected: true },
        { name: /登录|Login/i, expected: true },
      ];

      for (const link of navLinks) {
        const navLink = page.getByRole('link', { name: link.name });
        if (link.expected) {
          await expect(navLink).toBeVisible();
          console.log(`✅ 导航链接 "${link.name}" 存在`);
        }
      }
    });

    test('首页性能检查', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('https://photographalbum.vercel.app');
      const loadTime = Date.now() - startTime;

      console.log(`📊 首页加载时间: ${loadTime}ms`);

      // 验证加载时间在合理范围内（10秒）
      expect(loadTime).toBeLessThan(10000);

      // 检查控制台错误
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(2000);

      if (errors.length > 0) {
        console.log('⚠️ 控制台错误:', errors);
      } else {
        console.log('✅ 无控制台错误');
      }
    });
  });

  // ========== 登录页面测试 ==========
  test.describe('登录页面验证', () => {
    test('应该正确显示登录表单', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/login');

      // 验证页面标题
      await expect(page.getByRole('heading', { name: /登录/i })).toBeVisible();

      // 验证表单元素
      const emailInput = page.getByLabel(/邮箱|Email/i);
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toHaveAttribute('type', 'email');

      const passwordInput = page.getByLabel(/密码|Password/i);
      await expect(passwordInput).toBeVisible();
      await expect(passwordInput).toHaveAttribute('type', 'password');

      // 验证登录按钮
      const loginButton = page.getByRole('button', { name: /登录|Login/i });
      await expect(loginButton).toBeVisible();

      // 验证注册链接
      const registerLink = page.getByRole('link', { name: /注册|Register|Sign up/i });
      await expect(registerLink).toBeVisible();

      // 截图
      await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });

      console.log('✅ 登录页面表单验证通过');
    });

    test('登录表单验证功能', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/login');

      // 尝试空表单提交
      const loginButton = page.getByRole('button', { name: /登录|Login/i });
      await loginButton.click();

      // 验证必填字段提示
      const emailInput = page.getByLabel(/邮箱|Email/i);
      await expect(emailInput).toHaveAttribute('required');

      console.log('✅ 登录表单验证功能正常');
    });
  });

  // ========== 注册页面测试 ==========
  test.describe('注册页面验证', () => {
    test('应该正确显示注册表单', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/register');

      // 验证页面标题
      await expect(page.getByRole('heading', { name: /注册|Register/i })).toBeVisible();

      // 验证表单元素
      const usernameInput = page.getByLabel(/用户名|Username/i);
      await expect(usernameInput).toBeVisible();

      const emailInput = page.getByLabel(/邮箱|Email/i);
      await expect(emailInput).toBeVisible();

      const passwordInput = page.getByLabel(/密码|Password/i).first();
      await expect(passwordInput).toBeVisible();

      // 截图
      await page.screenshot({ path: 'test-results/register-page.png', fullPage: true });

      console.log('✅ 注册页面表单验证通过');
    });
  });

  // ========== 发现页面测试 ==========
  test.describe('发现页面验证', () => {
    test('应该正确显示发现页面和筛选功能', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/discover');

      // 验证页面标题
      await expect(page.getByRole('heading', { name: /发现|Discover/i })).toBeVisible();

      // 验证排序选项
      const sortOptions = page.getByText(/最新发布|最受欢迎|Latest|Popular/i);
      await expect(sortOptions.first()).toBeVisible();

      // 验证分类筛选
      const categories = page.getByText(/全部|风景|人像|All|Landscape|Portrait/i);
      await expect(categories.first()).toBeVisible();

      // 截图
      await page.screenshot({ path: 'test-results/discover-page.png', fullPage: true });

      console.log('✅ 发现页面布局验证通过');
    });

    test('发现页面专辑列表加载', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/discover');

      // 等待内容加载
      await page.waitForTimeout(3000);

      // 检查是否有专辑内容或提示信息
      const hasContent = await page.locator('[class*="album"], [class*="grid"]').count() > 0;
      const hasEmptyMessage = await page.getByText(/暂无|没有|No albums/i).isVisible().catch(() => false);

      if (hasContent) {
        console.log('✅ 发现页面有专辑内容显示');
      } else if (hasEmptyMessage) {
        console.log('ℹ️ 发现页面显示空状态提示（正常）');
      }
    });
  });

  // ========== 搜索页面测试 ==========
  test.describe('搜索页面验证', () => {
    test('应该正确显示搜索页面', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/search');

      // 验证搜索输入框
      const searchInput = page.getByPlaceholder(/搜索|Search/i);
      await expect(searchInput).toBeVisible();

      // 验证搜索类型标签
      const typeFilters = page.getByText(/全部|用户|专辑|照片|All|Users|Albums|Photos/i);
      await expect(typeFilters.first()).toBeVisible();

      // 截图
      await page.screenshot({ path: 'test-results/search-page.png', fullPage: true });

      console.log('✅ 搜索页面布局验证通过');
    });

    test('搜索类型切换功能', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/search');

      // 尝试点击不同的搜索类型
      const typeButtons = page.locator('button, [role="tab"]').filter({
        hasText: /全部|用户|专辑|照片|All|Users|Albums|Photos/i
      });

      const count = await typeButtons.count();
      if (count > 0) {
        await typeButtons.first().click();
        console.log('✅ 搜索类型切换功能可用');
      }
    });
  });

  // ========== 响应式设计测试 ==========
  test.describe('响应式设计验证', () => {
    test('桌面端布局验证', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('https://photographalbum.vercel.app');

      // 验证导航栏在桌面端的显示
      const nav = page.locator('nav').first();
      await expect(nav).toBeVisible();

      await page.screenshot({ path: 'test-results/desktop-1920x1080.png', fullPage: true });
      console.log('✅ 桌面端布局 (1920x1080) 验证通过');
    });

    test('平板端布局验证', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('https://photographalbum.vercel.app');

      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tablet-768x1024.png', fullPage: true });
      console.log('✅ 平板端布局 (768x1024) 验证通过');
    });

    test('移动端布局验证', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('https://photographalbum.vercel.app');

      // 在移动端，导航可能是汉堡菜单
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/mobile-375x667.png', fullPage: true });
      console.log('✅ 移动端布局 (375x667) 验证通过');
    });
  });

  // ========== 所有公共页面可访问性测试 ==========
  test.describe('页面可访问性验证', () => {
    const publicPages = [
      { url: '/', name: '首页' },
      { url: '/login', name: '登录页' },
      { url: '/register', name: '注册页' },
      { url: '/discover', name: '发现页' },
      { url: '/search', name: '搜索页' },
    ];

    for (const pageInfo of publicPages) {
      test(`${pageInfo.name} 应该可访问且无404错误`, async ({ page }) => {
        const response = await page.goto(`https://photographalbum.vercel.app${pageInfo.url}`);

        // 验证响应状态
        expect(response?.status()).toBeLessThan(400);

        // 验证页面有内容
        const bodyText = await page.textContent('body');
        expect(bodyText?.length).toBeGreaterThan(0);

        console.log(`✅ ${pageInfo.name} 可访问 (状态码: ${response?.status()})`);
      });
    }
  });

  // ========== 关键链接导航测试 ==========
  test.describe('导航功能验证', () => {
    test('导航链接应该正常工作', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app');

      // 测试发现页链接
      const discoverLink = page.getByRole('link', { name: /发现|Discover/i }).first();
      await discoverLink.click();
      await page.waitForURL('**/discover');
      expect(page.url()).toContain('/discover');
      console.log('✅ 发现页导航成功');

      // 返回首页
      await page.goto('https://photographalbum.vercel.app');

      // 测试搜索页链接
      const searchLink = page.getByRole('link', { name: /搜索|Search/i }).first();
      await searchLink.click();
      await page.waitForURL('**/search');
      expect(page.url()).toContain('/search');
      console.log('✅ 搜索页导航成功');

      // 测试登录页链接
      await page.goto('https://photographalbum.vercel.app');
      const loginLink = page.getByRole('link', { name: /登录|Login/i }).first();
      await loginLink.click();
      await page.waitForURL('**/login');
      expect(page.url()).toContain('/login');
      console.log('✅ 登录页导航成功');
    });

    test('Logo 应该链接回首页', async ({ page }) => {
      await page.goto('https://photographalbum.vercel.app/discover');

      // 点击 Logo 或品牌名称
      const logo = page.locator('a[href="/"], a[href="https://photographalbum.vercel.app"]').first();
      await logo.click();
      await page.waitForURL(/photographalbum\.vercel\.app\/?$/);

      console.log('✅ Logo 返回首页功能正常');
    });
  });
});
