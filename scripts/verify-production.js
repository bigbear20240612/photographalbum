/**
 * PhotoAlbum 生产环境快速验证脚本
 * 使用 Node.js 的 https 模块快速检查页面可访问性
 */

const https = require('https');

const pages = [
  { path: '/', name: '首页' },
  { path: '/login', name: '登录页' },
  { path: '/register', name: '注册页' },
  { path: '/discover', name: '发现页' },
  { path: '/search', name: '搜索页' },
];

const baseUrl = 'photographalbum.vercel.app';

console.log('🚀 开始验证 PhotoAlbum 生产环境...\n');
console.log(`目标: https://${baseUrl}\n`);
console.log('═'.repeat(60));

let successCount = 0;
let failCount = 0;

async function checkPage(path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: baseUrl,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const startTime = Date.now();

    const req = https.request(options, (res) => {
      const loadTime = Date.now() - startTime;

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const status = res.statusCode;
        const success = status >= 200 && status < 400;

        if (success) {
          console.log(`✅ ${name.padEnd(15)} | 状态: ${status} | 响应时间: ${loadTime}ms`);

          // 检查页面内容
          if (data.includes('<!DOCTYPE html') || data.includes('<html')) {
            console.log(`   └─ 内容: HTML 页面 (${(data.length / 1024).toFixed(2)} KB)`);
          }

          successCount++;
        } else {
          console.log(`❌ ${name.padEnd(15)} | 状态: ${status} | 响应时间: ${loadTime}ms`);
          failCount++;
        }

        console.log('─'.repeat(60));
        resolve({ success, status, loadTime, size: data.length });
      });
    });

    req.on('error', (error) => {
      const loadTime = Date.now() - startTime;
      console.log(`❌ ${name.padEnd(15)} | 错误: ${error.message} | 时间: ${loadTime}ms`);
      console.log('─'.repeat(60));
      failCount++;
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`⏱️  ${name.padEnd(15)} | 超时 (>10秒)`);
      console.log('─'.repeat(60));
      failCount++;
      resolve({ success: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function runVerification() {
  console.log('\n📋 页面可访问性测试\n');

  const results = [];

  for (const page of pages) {
    const result = await checkPage(page.path, page.name);
    results.push({ ...page, ...result });

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // 汇总报告
  console.log('\n═'.repeat(60));
  console.log('\n📊 测试汇总报告\n');
  console.log(`总计页面: ${pages.length}`);
  console.log(`✅ 成功: ${successCount} 个`);
  console.log(`❌ 失败: ${failCount} 个`);
  console.log(`📈 成功率: ${((successCount / pages.length) * 100).toFixed(1)}%`);

  // 详细结果
  console.log('\n📋 详细结果:\n');
  results.forEach(r => {
    const statusIcon = r.success ? '✅' : '❌';
    const statusText = r.success ? `${r.status}` : (r.error || 'Failed');
    const timeText = r.loadTime ? `${r.loadTime}ms` : 'N/A';
    console.log(`${statusIcon} ${r.name}: ${statusText} (${timeText})`);
  });

  // 性能统计
  const successfulResults = results.filter(r => r.success && r.loadTime);
  if (successfulResults.length > 0) {
    const avgLoadTime = successfulResults.reduce((sum, r) => sum + r.loadTime, 0) / successfulResults.length;
    const maxLoadTime = Math.max(...successfulResults.map(r => r.loadTime));
    const minLoadTime = Math.min(...successfulResults.map(r => r.loadTime));

    console.log('\n⚡ 性能统计:\n');
    console.log(`平均响应时间: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`最快响应: ${minLoadTime}ms`);
    console.log(`最慢响应: ${maxLoadTime}ms`);
  }

  // 功能验证建议
  console.log('\n💡 功能验证建议:\n');

  if (successCount === pages.length) {
    console.log('🎉 所有页面均可访问！建议进一步验证：');
    console.log('   • 登录/注册功能是否正常');
    console.log('   • 专辑和照片上传功能');
    console.log('   • 搜索和筛选功能');
    console.log('   • 用户交互功能（点赞、评论、关注）');
    console.log('   • 响应式布局在不同设备上的表现');
  } else {
    console.log('⚠️  部分页面无法访问，需要检查：');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.name} (${r.path})`);
    });
  }

  console.log('\n═'.repeat(60));
  console.log('\n✨ 验证完成！');

  return results;
}

// 运行验证
runVerification().catch(error => {
  console.error('\n❌ 验证过程出错:', error);
  process.exit(1);
});
