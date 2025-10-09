import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取照片列表 (管理员内容审核)
 * GET /api/admin/photos
 */
export async function GET(request: NextRequest) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const albumId = searchParams.get('albumId');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (albumId) {
      where.albumId = albumId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    // 获取照片列表
    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              status: true,
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.photo.count({ where }),
    ]);

    return NextResponse.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取照片列表失败:', error);
    return NextResponse.json(
      { error: '获取照片列表失败' },
      { status: 500 }
    );
  }
}
