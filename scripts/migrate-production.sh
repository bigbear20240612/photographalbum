#!/bin/bash

# 生产数据库迁移脚本
# 用于手动运行 Prisma 迁移到生产数据库

echo "🚀 开始运行生产数据库迁移..."
echo ""

# 检查是否设置了 DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  未检测到 DATABASE_URL 环境变量"
  echo ""
  echo "请设置环境变量："
  echo "export DATABASE_URL=\"postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require\""
  echo ""
  exit 1
fi

echo "✅ 检测到 DATABASE_URL"
echo ""

# 检查 Prisma CLI
if ! command -v npx &> /dev/null; then
  echo "❌ 未找到 npx 命令，请确保已安装 Node.js"
  exit 1
fi

echo "📊 检查当前迁移状态..."
npx prisma migrate status
echo ""

echo "🔄 运行数据库迁移..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 迁移成功完成！"
  echo ""
  echo "📊 当前数据库状态："
  npx prisma migrate status
  echo ""
  echo "🎉 现在可以测试应用了！"
  echo "访问：https://photographalbum.vercel.app/register"
else
  echo ""
  echo "❌ 迁移失败，请检查错误信息"
  exit 1
fi
