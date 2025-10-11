@echo off
REM 生产数据库迁移脚本 (Windows)
REM 用于手动运行 Prisma 迁移到生产数据库

echo.
echo ========================================
echo   生产数据库迁移工具
echo ========================================
echo.

REM 检查是否设置了 DATABASE_URL
if "%DATABASE_URL%"=="" (
  echo [错误] 未检测到 DATABASE_URL 环境变量
  echo.
  echo 请先设置环境变量：
  echo set DATABASE_URL=postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require
  echo.
  echo 或者使用 PowerShell：
  echo $env:DATABASE_URL="postgres://997367aed2338ea5e93f46237b1dda196e076b1346e16d88c94123ed4133e655:sk_kqZ8moCdY5yNjkGeW9zyw@db.prisma.io:5432/postgres?sslmode=require"
  echo.
  pause
  exit /b 1
)

echo [OK] 检测到 DATABASE_URL
echo.

echo [信息] 检查当前迁移状态...
echo.
call npx prisma migrate status
echo.

echo [执行] 运行数据库迁移...
echo.
call npx prisma migrate deploy

if errorlevel 1 (
  echo.
  echo [失败] 迁移失败，请检查错误信息
  echo.
  pause
  exit /b 1
)

echo.
echo ========================================
echo   迁移成功完成！
echo ========================================
echo.
echo [信息] 当前数据库状态：
call npx prisma migrate status
echo.
echo [成功] 现在可以测试应用了！
echo 访问：https://photographalbum.vercel.app/register
echo.
pause
