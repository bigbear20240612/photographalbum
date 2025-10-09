import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取系统统计数据 (管理员仪表板)
 * GET /api/admin/stats
 */
export async function GET(request: NextRequest) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // 并发查询所有统计数据
    const [
      totalUsers,
      activeUsers,
      totalAlbums,
      publishedAlbums,
      totalPhotos,
      totalLikes,
      totalComments,
      totalFollows,
      recentUsers,
      recentAlbums,
      recentPhotos,
      usersByStatus,
      albumsByStatus,
    ] = await Promise.all([
      // 用户统计
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),

      // 专辑统计
      prisma.album.count(),
      prisma.album.count({ where: { status: 'PUBLISHED' } }),

      // 照片统计
      prisma.photo.count(),

      // 社交统计
      prisma.like.count(),
      prisma.comment.count(),
      prisma.follow.count(),

      // 最近注册用户
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // 最近创建专辑
      prisma.album.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          photoCount: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // 最近上传照片
      prisma.photo.findMany({
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              displayName: true,
            },
          },
          album: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // 按状态分组的用户数
      prisma.user.groupBy({
        by: ['status'],
        _count: true,
      }),

      // 按状态分组的专辑数
      prisma.album.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // 计算增长趋势(最近30天)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [newUsersLast30Days, newAlbumsLast30Days, newPhotosLast30Days] =
      await Promise.all([
        prisma.user.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
        prisma.album.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
        prisma.photo.count({
          where: {
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
      ]);

    // 格式化用户状态统计
    const userStats = {
      total: totalUsers,
      active: activeUsers,
      inactive: usersByStatus.find((s) => s.status === 'INACTIVE')?._count || 0,
      suspended: usersByStatus.find((s) => s.status === 'SUSPENDED')?._count || 0,
    };

    // 格式化专辑状态统计
    const albumStats = {
      total: totalAlbums,
      published: publishedAlbums,
      draft: albumsByStatus.find((s) => s.status === 'DRAFT')?._count || 0,
    };

    return NextResponse.json({
      overview: {
        users: userStats,
        albums: albumStats,
        photos: {
          total: totalPhotos,
        },
        social: {
          likes: totalLikes,
          comments: totalComments,
          follows: totalFollows,
        },
      },
      growth: {
        users: newUsersLast30Days,
        albums: newAlbumsLast30Days,
        photos: newPhotosLast30Days,
      },
      recent: {
        users: recentUsers,
        albums: recentAlbums,
        photos: recentPhotos,
      },
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
