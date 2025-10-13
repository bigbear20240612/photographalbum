#!/usr/bin/env node

/**
 * 验证部署脚本
 * 用于检查 Vercel 部署后消息 API 是否正常工作
 */

const PRODUCTION_URL = 'https://photographalbum.vercel.app';

async function checkEndpoint(endpoint, expectedStatus = [200, 401]) {
  try {
    console.log(`\n🔍 检查端点: ${endpoint}`);
    const response = await fetch(`${PRODUCTION_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const status = response.status;
    const isExpected = expectedStatus.includes(status);

    if (isExpected) {
      console.log(`✅ 状态码: ${status} (预期)`);

      // 尝试解析响应内容
      try {
        const data = await response.json();
        console.log(`📄 响应内容:`, JSON.stringify(data, null, 2));
      } catch (e) {
        console.log(`⚠️  无法解析 JSON 响应`);
      }
    } else {
      console.log(`❌ 状态码: ${status} (不符合预期: ${expectedStatus.join(', ')})`);

      try {
        const data = await response.json();
        console.log(`📄 错误响应:`, JSON.stringify(data, null, 2));
      } catch (e) {
        const text = await response.text();
        console.log(`📄 错误文本:`, text.substring(0, 200));
      }
    }

    return isExpected;
  } catch (error) {
    console.log(`❌ 请求失败:`, error.message);
    return false;
  }
}

async function verifyDeployment() {
  console.log('=' .repeat(60));
  console.log('🚀 开始验证 Vercel 部署');
  console.log('=' .repeat(60));
  console.log(`📍 生产环境: ${PRODUCTION_URL}`);

  const results = [];

  // 检查未读消息 API
  results.push({
    name: '未读消息 API',
    success: await checkEndpoint('/api/messages/unread', [200, 401])
  });

  // 检查对话列表 API
  results.push({
    name: '对话列表 API',
    success: await checkEndpoint('/api/conversations', [200, 401])
  });

  // 检查消息列表 API
  results.push({
    name: '消息列表 API',
    success: await checkEndpoint('/api/messages?otherUserId=test', [200, 401, 400])
  });

  // 汇总结果
  console.log('\n' + '=' .repeat(60));
  console.log('📊 验证结果汇总');
  console.log('=' .repeat(60));

  let allPassed = true;
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.success ? '通过' : '失败'}`);
    if (!result.success) allPassed = false;
  });

  console.log('\n' + '=' .repeat(60));
  if (allPassed) {
    console.log('🎉 所有检查通过！消息功能部署成功！');
  } else {
    console.log('⚠️  部分检查失败，请查看上方详细信息');
    console.log('💡 提示：');
    console.log('   - 如果返回 500 错误，可能数据库迁移未成功');
    console.log('   - 如果返回 401 错误，这是正常的（需要登录）');
    console.log('   - 如果返回 400 错误，这是正常的（参数验证）');
  }
  console.log('=' .repeat(60));

  return allPassed;
}

// 运行验证
verifyDeployment().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('❌ 验证过程出错:', error);
  process.exit(1);
});
