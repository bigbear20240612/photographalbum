import { test, expect } from '@playwright/test';

/**
 * 首页测试
 */
test.describe('首页功能测试', () => {
  test('应该正确加载首页', async ({ page }) => {
    await page.goto('/');

    // 检查页面标题
    await expect(page).toHaveTitle(/PhotoAlbum/i);

    // 检查主标题
    await expect(page.getByRole('heading', { name: /画廊级的.*摄影作品.*展示平台/i })).toBeVisible();

    // 检查立即开始按钮
    const startButton = page.getByRole('link', { name: /立即开始/i });
    await expect(startButton).toBeVisible();

    // 检查查看示例按钮
    const exampleButton = page.getByRole('link', { name: /查看示例/i });
    await expect(exampleButton).toBeVisible();
  });

  test('应该显示功能特性区域', async ({ page }) => {
    await page.goto('/');

    // 检查"为什么选择 PhotoAlbum"标题
    await expect(page.getByRole('heading', { name: /为什么选择 PhotoAlbum/i })).toBeVisible();

    // 检查特性卡片
    await expect(page.getByText(/画廊级展示/i)).toBeVisible();
    await expect(page.getByText(/专辑管理/i)).toBeVisible();
    await expect(page.getByText(/个人品牌/i)).toBeVisible();
  });

  test('应该显示精选作品区域', async ({ page }) => {
    await page.goto('/');

    // 检查精选作品标题
    await expect(page.getByRole('heading', { name: /精选作品/i })).toBeVisible();

    // 检查是否有专辑卡片
    const albumCards = page.locator('.card, [class*="card"]').first();
    await expect(albumCards).toBeVisible({ timeout: 10000 });
  });

  test('导航栏应该正常工作', async ({ page }) => {
    await page.goto('/');

    // 检查导航栏
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 检查Logo或品牌名
    await expect(page.getByText(/PhotoAlbum/i).first()).toBeVisible();

    // 检查导航链接
    await expect(page.getByRole('link', { name: /发现/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /登录/i })).toBeVisible();
  });

  test('页脚应该显示', async ({ page }) => {
    await page.goto('/');

    // 滚动到底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 检查页脚内容
    await expect(page.locator('footer')).toBeVisible();
  });

  test('响应式设计 - 移动端', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 检查移动端布局
    await expect(page).toHaveTitle(/PhotoAlbum/i);
    await expect(page.getByRole('heading', { name: /画廊级的.*摄影作品/i })).toBeVisible();
  });
});
