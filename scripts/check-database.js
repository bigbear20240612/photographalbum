#!/usr/bin/env node

/**
 * 数据库表检查脚本
 * 用于验证 conversations 和 messages 表是否存在于数据库中
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function checkDatabase() {
  console.log('=' .repeat(60));
  console.log('🔍 开始检查数据库表结构');
  console.log('=' .repeat(60));

  try {
    // 检查数据库连接
    console.log('\n📡 测试数据库连接...');
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // 检查 conversations 表
    console.log('\n📋 检查 conversations 表...');
    try {
      const convCount = await prisma.conversation.count();
      console.log(`✅ conversations 表存在`);
      console.log(`   当前对话数量: ${convCount}`);
    } catch (error) {
      console.log('❌ conversations 表不存在或无法访问');
      console.log(`   错误信息: ${error.message}`);
    }

    // 检查 messages 表
    console.log('\n📬 检查 messages 表...');
    try {
      const msgCount = await prisma.message.count();
      console.log(`✅ messages 表存在`);
      console.log(`   当前消息数量: ${msgCount}`);
    } catch (error) {
      console.log('❌ messages 表不存在或无法访问');
      console.log(`   错误信息: ${error.message}`);
    }

    // 检查迁移历史
    console.log('\n📜 检查迁移历史...');
    try {
      const migrations = await prisma.$queryRaw`
        SELECT migration_name, finished_at
        FROM "_prisma_migrations"
        ORDER BY finished_at DESC
        LIMIT 5
      `;
      console.log('✅ 最近的迁移记录:');
      migrations.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m.migration_name}`);
        console.log(`      完成时间: ${m.finished_at ? m.finished_at.toISOString() : '未完成'}`);
      });
    } catch (error) {
      console.log('⚠️  无法获取迁移历史');
      console.log(`   错误信息: ${error.message}`);
    }

    // 检查用户表
    console.log('\n👥 检查 users 表...');
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ users 表存在`);
      console.log(`   当前用户数量: ${userCount}`);
    } catch (error) {
      console.log('❌ users 表不存在或无法访问');
      console.log(`   错误信息: ${error.message}`);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('📊 检查完成');
    console.log('=' .repeat(60));

    // 给出建议
    console.log('\n💡 建议:');
    console.log('   - 如果 conversations 和 messages 表不存在，请运行:');
    console.log('     npx prisma migrate deploy');
    console.log('   - 如果迁移记录中没有 20251013_add_message_models，说明迁移未执行');
    console.log('   - 检查 Vercel 部署日志，搜索 "prisma migrate deploy"');

  } catch (error) {
    console.log('\n❌ 检查过程出错:');
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行检查
checkDatabase().catch((error) => {
  console.error('❌ 脚本执行失败:', error);
  process.exit(1);
});
