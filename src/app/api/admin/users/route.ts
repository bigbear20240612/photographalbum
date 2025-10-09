import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取用户列表 (仅管理员)
 * GET /api/admin/users
 */
export async function GET(request: NextRequest) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // ACTIVE, INACTIVE, SUSPENDED
    const role = searchParams.get('role'); // USER, ADMIN
    const search = searchParams.get('search'); // 搜索关键词

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { username: { contains: search } },
        { email: { contains: search } },
        { displayName: { contains: search } },
      ];
    }

    // 获取用户列表
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          location: true,
          status: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
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
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}
