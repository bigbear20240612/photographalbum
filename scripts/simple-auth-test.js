/**
 * PhotoAlbum 简化认证测试
 * 使用现有测试账号进行登录测试
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://photographalbum.vercel.app';
const testResultsDir = 'test-results';

// 使用现有的测试账号（如果之前创建成功的话）
const testUser = {
  email: 'test@example.com',
  password: 'test123456'
};

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(message, type = 'info') {
  const colorMap = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue
  };
  console.log(`${colorMap[type] || colors.reset}${message}${colors.reset}`);
}

async function runSimpleTest() {
  log('\n============================================================', 'blue');
  log('PhotoAlbum 简化认证测试', 'blue');
  log('============================================================\n', 'blue');

  let browser;

  try {
    browser = await chromium.launch({
      headless: false,  // 可视化模式，方便调试
      args: ['--no-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // 1. 访问首页
    log('1. 访问首页...', 'info');
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(testResultsDir, 'simple-1-home.png'), fullPage: true });
    log('  ✓ 首页加载成功', 'success');

    // 2. 访问登录页
    log('\n2. 访问登录页...', 'info');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(testResultsDir, 'simple-2-login-page.png'), fullPage: true });
    log('  ✓ 登录页加载成功', 'success');

    // 3. 查看页面上的所有输入框
    log('\n3. 检测页面表单元素...', 'info');
    const inputs = await page.locator('input').all();
    log(`  找到 ${inputs.length} 个输入框：`, 'info');
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      log(`    [${i}] type=${type}, name=${name}, placeholder=${placeholder}, id=${id}`, 'info');
    }

    // 4. 查看页面上的所有按钮
    const buttons = await page.locator('button').all();
    log(`\n  找到 ${buttons.length} 个按钮：`, 'info');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const type = await button.getAttribute('type');
      const text = await button.textContent();
      log(`    [${i}] type=${type}, text="${text?.trim()}"`, 'info');
    }

    // 5. 尝试填写并提交登录表单
    log('\n4. 尝试填写登录表单...', 'info');

    // 方法1: 通过序号填写
    if (inputs.length >= 2) {
      log('  使用第一个输入框作为邮箱...', 'info');
      await inputs[0].fill(testUser.email);
      log('  ✓ 邮箱已填写', 'success');

      log('  使用第二个输入框作为密码...', 'info');
      await inputs[1].fill(testUser.password);
      log('  ✓ 密码已填写', 'success');

      await page.screenshot({ path: path.join(testResultsDir, 'simple-3-form-filled.png'), fullPage: true });

      // 尝试点击第一个submit类型的按钮
      for (const button of buttons) {
        const type = await button.getAttribute('type');
        if (type === 'submit') {
          log('\n5. 提交登录表单...', 'info');
          await button.click();
          log('  ✓ 表单已提交', 'success');
          break;
        }
      }

      // 等待响应
      await page.waitForTimeout(5000);

      const currentUrl = page.url();
      log(`\n6. 登录后URL: ${currentUrl}`, 'info');

      await page.screenshot({ path: path.join(testResultsDir, 'simple-4-after-submit.png'), fullPage: true });

      // 检查是否跳转
      if (currentUrl !== `${baseUrl}/login`) {
        log('  ✓ URL已改变，可能登录成功', 'success');
      } else {
        log('  ⚠ URL未改变，检查是否有错误消息', 'warning');
      }

      // 尝试访问需要登录的页面
      log('\n7. 尝试访问仪表板...', 'info');
      await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(2000);

      const dashboardUrl = page.url();
      log(`  当前URL: ${dashboardUrl}`, 'info');

      await page.screenshot({ path: path.join(testResultsDir, 'simple-5-dashboard.png'), fullPage: true });

      if (dashboardUrl.includes('/dashboard')) {
        log('  ✓ 成功访问仪表板，用户已登录！', 'success');
      } else if (dashboardUrl.includes('/login')) {
        log('  ✗ 被重定向到登录页，登录失败', 'error');
      } else {
        log(`  ⚠ 未知状态: ${dashboardUrl}`, 'warning');
      }

    } else {
      log('  ✗ 输入框数量不足', 'error');
    }

    log('\n============================================================', 'blue');
    log('测试完成！请查看 test-results 目录中的截图。', 'blue');
    log('============================================================\n', 'blue');

    // 保持浏览器打开5秒以便观察
    await page.waitForTimeout(5000);

  } catch (error) {
    log(`\n❌ 测试出错: ${error.message}`, 'error');
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runSimpleTest();
