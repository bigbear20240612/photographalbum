import { test, expect } from '@playwright/test';

/**
 * 认证功能测试
 */
test.describe('用户认证测试', () => {
  test('应该能访问登录页面', async ({ page }) => {
    await page.goto('/login');

    // 检查登录表单
    await expect(page.getByRole('heading', { name: /登录/i })).toBeVisible();
    await expect(page.getByLabel(/邮箱/i)).toBeVisible();
    await expect(page.getByLabel(/密码/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /登录/i })).toBeVisible();

    // 检查注册链接
    await expect(page.getByRole('link', { name: /注册/i })).toBeVisible();
  });

  test('应该能访问注册页面', async ({ page }) => {
    await page.goto('/register');

    // 检查注册表单
    await expect(page.getByRole('heading', { name: /注册/i })).toBeVisible();
    await expect(page.getByLabel(/邮箱/i)).toBeVisible();
    await expect(page.getByLabel(/用户名/i)).toBeVisible();
    await expect(page.getByLabel(/密码/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /注册/i })).toBeVisible();

    // 检查登录链接
    await expect(page.getByRole('link', { name: /登录/i })).toBeVisible();
  });

  test('登录表单验证 - 空表单提交', async ({ page }) => {
    await page.goto('/login');

    // 尝试提交空表单
    await page.getByRole('button', { name: /登录/i }).click();

    // 检查HTML5验证（邮箱必填）
    const emailInput = page.getByLabel(/邮箱/i);
    await expect(emailInput).toHaveAttribute('required');
  });

  test('注册表单验证 - 空表单提交', async ({ page }) => {
    await page.goto('/register');

    // 尝试提交空表单
    await page.getByRole('button', { name: /注册/i }).click();

    // 检查HTML5验证
    const emailInput = page.getByLabel(/邮箱/i);
    await expect(emailInput).toHaveAttribute('required');
  });

  test('登录页面应该有正确的表单元素', async ({ page }) => {
    await page.goto('/login');

    // 检查表单输入类型
    const emailInput = page.getByLabel(/邮箱/i);
    const passwordInput = page.getByLabel(/密码/i);

    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('注册页面应该有正确的表单元素', async ({ page }) => {
    await page.goto('/register');

    // 检查表单输入类型
    const emailInput = page.getByLabel(/邮箱/i);
    const passwordInput = page.getByLabel(/密码/i);

    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('从登录页导航到注册页', async ({ page }) => {
    await page.goto('/login');

    // 点击注册链接
    await page.getByRole('link', { name: /注册/i }).click();

    // 验证跳转到注册页
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: /注册/i })).toBeVisible();
  });

  test('从注册页导航到登录页', async ({ page }) => {
    await page.goto('/register');

    // 点击登录链接
    await page.getByRole('link', { name: /登录/i }).click();

    // 验证跳转到登录页
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: /登录/i })).toBeVisible();
  });
});
