import { test, expect } from '@playwright/test';

/**
 * 搜索功能测试
 */
test.describe('搜索功能测试', () => {
  test('应该能访问搜索页面', async ({ page }) => {
    await page.goto('/search');

    // 检查搜索输入框
    await expect(page.getByPlaceholder(/搜索用户.*专辑.*照片/i)).toBeVisible();

    // 检查搜索按钮
    await expect(page.getByRole('button', { name: /搜索/i })).toBeVisible();
  });

  test('应该显示搜索类型标签', async ({ page }) => {
    await page.goto('/search');

    // 检查类型标签
    await expect(page.getByRole('button', { name: /^全部$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^用户$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^专辑$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^照片$/i })).toBeVisible();
  });

  test('应该能切换搜索类型', async ({ page }) => {
    await page.goto('/search');

    const allButton = page.getByRole('button', { name: /^全部$/i });
    const usersButton = page.getByRole('button', { name: /^用户$/i });

    // 点击"用户"类型
    await usersButton.click();
    await expect(usersButton).toHaveClass(/bg-charcoal/);

    // 点击"全部"类型
    await allButton.click();
    await expect(allButton).toHaveClass(/bg-charcoal/);
  });

  test('应该显示初始提示', async ({ page }) => {
    await page.goto('/search');

    // 检查初始提示文字
    await expect(page.getByText(/输入关键词开始搜索/i)).toBeVisible();
  });

  test('搜索输入框应该可用', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/搜索用户.*专辑.*照片/i);

    // 输入测试关键词
    await searchInput.fill('测试');

    // 验证输入值
    await expect(searchInput).toHaveValue('测试');
  });

  test('响应式设计 - 移动端', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/search');

    // 检查移动端布局
    await expect(page.getByPlaceholder(/搜索用户.*专辑.*照片/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /搜索/i })).toBeVisible();
  });
});
