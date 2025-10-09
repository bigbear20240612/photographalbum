import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取单个用户详情 (仅管理员)
 * GET /api/admin/users/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            albums: true,
            photos: true,
            likes: true,
            comments: true,
            followers: true,
            following: true,
          },
        },
        albums: {
          select: {
            id: true,
            title: true,
            photoCount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 隐藏敏感信息
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('获取用户详情失败:', error);
    return NextResponse.json(
      { error: '获取用户详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新用户信息 (仅管理员)
 * PUT /api/admin/users/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { status, role, emailVerified } = body;

    // 验证更新字段
    const updateData: any = {};

    if (status && ['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      updateData.status = status;
    }

    if (role && ['USER', 'ADMIN'].includes(role)) {
      updateData.role = role;
    }

    if (typeof emailVerified === 'boolean') {
      updateData.emailVerified = emailVerified;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: '没有有效的更新字段' },
        { status: 400 }
      );
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        status: true,
        role: true,
        emailVerified: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: '用户信息已更新',
      user: updatedUser,
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json(
      { error: '更新用户失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除用户 (仅管理员)
 * DELETE /api/admin/users/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 防止删除管理员账户(可选的安全措施)
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: '不能删除管理员账户' },
        { status: 403 }
      );
    }

    // 删除用户(Prisma会自动级联删除相关数据)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: '用户已删除',
      deletedUser: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { error: '删除用户失败' },
      { status: 500 }
    );
  }
}
