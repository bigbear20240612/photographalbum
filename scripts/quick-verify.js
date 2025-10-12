/**
 * PhotoAlbum 生产环境快速验证脚本
 * 使用 Playwright 进行自动化测试
 */

const { chromium } = require('playwright');

const baseUrl = 'https://photographalbum.vercel.app';

// 测试页面列表
const pages = [
  { path: '/', name: '首页', checkElements: ['PhotoAlbum', '立即开始', '发现'] },
  { path: '/login', name: '登录页', checkElements: ['登录', '邮箱', '密码'] },
  { path: '/register', name: '注册页', checkElements: ['注册', '用户名', '邮箱'] },
  { path: '/discover', name: '发现页', checkElements: ['发现', '最新', '最受欢迎'] },
  { path: '/search', name: '搜索页', checkElements: ['搜索', '全部', '用户'] },
];

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
};

async function checkPage(page, pageInfo) {
  const { path, name, checkElements } = pageInfo;
  const url = `${baseUrl}${path}`;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.blue}测试: ${name} (${path})${colors.reset}`);
  console.log(`${'='.repeat(60)}`);

  try {
    const startTime = Date.now();

    // 访问页面
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;
    const status = response.status();

    // 检查HTTP状态
    if (status >= 200 && status < 400) {
      console.log(`${colors.green}✓${colors.reset} HTTP状态: ${status}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} HTTP状态: ${status}`);
      return { success: false, name, status, error: `HTTP ${status}` };
    }

    console.log(`${colors.green}✓${colors.reset} 加载时间: ${loadTime}ms`);

    // 等待页面完全加载
    await page.waitForTimeout(2000);

    // 检查关键元素
    let foundElements = 0;
    for (const element of checkElements) {
      try {
        const isVisible = await page.getByText(element, { exact: false }).first().isVisible({ timeout: 5000 });
        if (isVisible) {
          console.log(`${colors.green}✓${colors.reset} 找到元素: "${element}"`);
          foundElements++;
        } else {
          console.log(`${colors.yellow}⚠${colors.reset} 元素不可见: "${element}"`);
        }
      } catch (e) {
        console.log(`${colors.yellow}⚠${colors.reset} 未找到元素: "${element}"`);
      }
    }

    // 截图
    const screenshotPath = `test-results/verify-${name.replace(/\s+/g, '-')}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`${colors.green}✓${colors.reset} 截图已保存: ${screenshotPath}`);

    // 检查控制台错误
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    if (logs.length > 0) {
      console.log(`${colors.yellow}⚠${colors.reset} 控制台错误: ${logs.length} 个`);
      logs.slice(0, 3).forEach(log => console.log(`  - ${log.substring(0, 100)}...`));
    } else {
      console.log(`${colors.green}✓${colors.reset} 无控制台错误`);
    }

    // 计算成功率
    const elementSuccessRate = (foundElements / checkElements.length) * 100;
    console.log(`\n${colors.blue}元素检测率: ${elementSuccessRate.toFixed(0)}% (${foundElements}/${checkElements.length})${colors.reset}`);

    return {
      success: status < 400 && foundElements > 0,
      name,
      path,
      status,
      loadTime,
      foundElements,
      totalElements: checkElements.length,
      errors: logs.length,
    };

  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} 错误: ${error.message}`);
    return {
      success: false,
      name,
      path,
      error: error.message,
    };
  }
}

async function runVerification() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.blue}PhotoAlbum 生产环境验证${colors.reset}`);
  console.log(`${colors.blue}目标: ${baseUrl}${colors.reset}`);
  console.log('='.repeat(60));

  let browser;

  try {
    // 启动浏览器
    console.log(`\n${colors.blue}正在启动 Chromium 浏览器...${colors.reset}`);
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });

    const page = await context.newPage();
    console.log(`${colors.green}✓${colors.reset} 浏览器已启动\n`);

    // 测试所有页面
    const results = [];
    for (const pageInfo of pages) {
      const result = await checkPage(page, pageInfo);
      results.push(result);
      await page.waitForTimeout(1000); // 页面间延迟
    }

    // 生成报告
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.blue}测试报告汇总${colors.reset}`);
    console.log('='.repeat(60));

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    const successRate = (successCount / totalCount) * 100;

    console.log(`\n总计页面: ${totalCount}`);
    console.log(`${colors.green}✓ 成功: ${successCount}${colors.reset}`);
    console.log(`${colors.red}✗ 失败: ${totalCount - successCount}${colors.reset}`);
    console.log(`${colors.blue}成功率: ${successRate.toFixed(1)}%${colors.reset}`);

    console.log('\n详细结果:');
    results.forEach(r => {
      const icon = r.success ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
      const status = r.status ? `HTTP ${r.status}` : (r.error || '失败');
      const time = r.loadTime ? `${r.loadTime}ms` : 'N/A';
      const elements = r.foundElements !== undefined ? `${r.foundElements}/${r.totalElements}元素` : '';
      console.log(`  ${icon} ${r.name.padEnd(10)} | ${status.padEnd(12)} | ${time.padEnd(8)} | ${elements}`);
    });

    // 性能统计
    const successResults = results.filter(r => r.success && r.loadTime);
    if (successResults.length > 0) {
      const avgTime = successResults.reduce((sum, r) => sum + r.loadTime, 0) / successResults.length;
      const maxTime = Math.max(...successResults.map(r => r.loadTime));
      const minTime = Math.min(...successResults.map(r => r.loadTime));

      console.log('\n性能统计:');
      console.log(`  平均加载: ${avgTime.toFixed(0)}ms`);
      console.log(`  最快: ${minTime}ms`);
      console.log(`  最慢: ${maxTime}ms`);
    }

    console.log('\n' + '='.repeat(60));

    if (successRate === 100) {
      console.log(`${colors.green}🎉 所有页面验证通过！${colors.reset}`);
    } else if (successRate >= 80) {
      console.log(`${colors.yellow}⚠️  大部分页面正常，但有${totalCount - successCount}个页面需要检查${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ 多个页面存在问题，需要修复${colors.reset}`);
    }

    console.log('='.repeat(60) + '\n');

    return results;

  } catch (error) {
    console.error(`${colors.red}验证过程出错: ${error.message}${colors.reset}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log(`${colors.blue}浏览器已关闭${colors.reset}`);
    }
  }
}

// 运行验证
runVerification()
  .then(() => {
    console.log('验证完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('验证失败:', error);
    process.exit(1);
  });
