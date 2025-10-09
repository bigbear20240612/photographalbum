import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 管理员权限验证中间件
 * 检查当前用户是否为管理员
 */
export async function requireAdmin(request: NextRequest) {
  try {
    // 获取当前会话
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 查询用户角色
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    // 验证通过,返回 null
    return null;
  } catch (error) {
    console.error('管理员验证失败:', error);
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    );
  }
}

/**
 * 检查当前用户是否为管理员(不返回响应)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('检查管理员权限失败:', error);
    return false;
  }
}
