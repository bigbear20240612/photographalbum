import { test, expect } from '@playwright/test';

/**
 * 导航和页面可访问性测试
 */
test.describe('页面导航测试', () => {
  test('所有公共页面应该可访问', async ({ page }) => {
    const pages = [
      { url: '/', title: /PhotoAlbum/i },
      { url: '/login', title: /登录/i },
      { url: '/register', title: /注册/i },
      { url: '/discover', title: /发现/i },
      { url: '/search', title: /搜索/i },
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      await expect(page).toHaveURL(new RegExp(pageInfo.url));
      await expect(page.getByRole('heading', { name: pageInfo.title })).toBeVisible({ timeout: 10000 });
    }
  });

  test('导航栏链接应该正常工作', async ({ page }) => {
    await page.goto('/');

    // 点击发现链接
    const discoverLink = page.getByRole('link', { name: /发现/i }).first();
    if (await discoverLink.isVisible()) {
      await discoverLink.click();
      await expect(page).toHaveURL(/\/discover/);
    }

    // 返回首页
    await page.goto('/');

    // 点击登录链接
    const loginLink = page.getByRole('link', { name: /登录/i }).first();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Logo链接应该返回首页', async ({ page }) => {
    await page.goto('/discover');

    // 点击Logo或品牌名
    const logoLink = page.getByRole('link', { name: /PhotoAlbum/i }).first();
    if (await logoLink.isVisible()) {
      await logoLink.click();
      await expect(page).toHaveURL(/^\/$/);
    }
  });

  test('页面应该没有明显的控制台错误', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // 给页面一些时间加载
    await page.waitForTimeout(2000);

    // 检查是否有严重错误（排除某些常见的非关键错误）
    const criticalErrors = errors.filter(
      (error) => !error.includes('favicon') && !error.includes('404')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('页面应该在合理时间内加载', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // 等待主要内容加载
    await expect(page.getByRole('heading').first()).toBeVisible();

    const loadTime = Date.now() - startTime;

    // 页面应该在5秒内加载完成
    expect(loadTime).toBeLessThan(5000);
  });

  test('404页面应该存在或正常处理', async ({ page }) => {
    await page.goto('/non-existent-page-12345');

    // 应该显示404页面或重定向到首页
    const is404 = await page.getByText(/404|not found|页面不存在/i).isVisible().catch(() => false);
    const isHome = page.url().endsWith('/') || page.url().endsWith('/login');

    expect(is404 || isHome).toBeTruthy();
  });
});
