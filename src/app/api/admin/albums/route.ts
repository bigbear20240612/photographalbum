import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 标记为动态路由，避免静态生成警告
export const dynamic = 'force-dynamic';

/**
 * 获取专辑列表 (管理员内容审核)
 * GET /api/admin/albums
 */
export async function GET(request: NextRequest) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // DRAFT, PUBLISHED
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // 获取专辑列表
    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              status: true,
              role: true,
            },
          },
          _count: {
            select: {
              photos: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.album.count({ where }),
    ]);

    return NextResponse.json({
      albums,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取专辑列表失败:', error);
    return NextResponse.json(
      { error: '获取专辑列表失败' },
      { status: 500 }
    );
  }
}
