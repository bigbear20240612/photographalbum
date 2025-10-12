import { test, expect } from '@playwright/test';

/**
 * 发现页面测试
 */
test.describe('发现页面功能测试', () => {
  test('应该正确加载发现页面', async ({ page }) => {
    await page.goto('/discover');

    // 检查页面标题
    await expect(page.getByRole('heading', { name: /发现作品/i })).toBeVisible();

    // 检查描述文字
    await expect(page.getByText(/浏览来自优秀摄影师的精彩作品集/i)).toBeVisible();
  });

  test('应该显示排序选项', async ({ page }) => {
    await page.goto('/discover');

    // 检查排序标签
    await expect(page.getByText(/排序/i).first()).toBeVisible();

    // 检查排序按钮
    await expect(page.getByRole('button', { name: /最新发布/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /最受欢迎/i })).toBeVisible();
  });

  test('应该显示分类筛选', async ({ page }) => {
    await page.goto('/discover');

    // 检查分类标签
    await expect(page.getByText(/分类/i).first()).toBeVisible();

    // 检查"全部"按钮
    await expect(page.getByRole('button', { name: /全部/i })).toBeVisible();
  });

  test('应该能点击排序选项', async ({ page }) => {
    await page.goto('/discover');

    const latestButton = page.getByRole('button', { name: /最新发布/i });
    const popularButton = page.getByRole('button', { name: /最受欢迎/i });

    // 点击"最受欢迎"
    await popularButton.click();
    await expect(popularButton).toHaveClass(/bg-charcoal/);

    // 点击"最新发布"
    await latestButton.click();
    await expect(latestButton).toHaveClass(/bg-charcoal/);
  });

  test('应该能点击分类筛选', async ({ page }) => {
    await page.goto('/discover');

    const allButton = page.getByRole('button', { name: /^全部$/i });

    // 点击"全部"分类
    await allButton.click();

    // 检查按钮状态
    await expect(allButton).toHaveClass(/from-terra-cotta|to-amber-gold/);
  });

  test('应该显示专辑统计', async ({ page }) => {
    await page.goto('/discover');

    // 等待加载完成
    await page.waitForTimeout(2000);

    // 检查是否显示专辑数量
    await expect(page.getByText(/共.*个专辑/i)).toBeVisible({ timeout: 10000 });
  });

  test('响应式设计 - 移动端', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/discover');

    // 检查移动端布局
    await expect(page.getByRole('heading', { name: /发现作品/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /最新发布/i })).toBeVisible();
  });

  test('应该能加载专辑列表', async ({ page }) => {
    await page.goto('/discover');

    // 等待内容加载
    await page.waitForTimeout(3000);

    // 检查是否有内容显示（专辑或空状态）
    const hasAlbums = await page.getByText(/共.*个专辑/i).isVisible();
    const noAlbums = await page.getByText(/暂无符合条件的专辑/i).isVisible();

    expect(hasAlbums || noAlbums).toBeTruthy();
  });
});
