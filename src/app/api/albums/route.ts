import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/albums - 获取专辑列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};

    if (username) {
      where.user = { username };
    }

    if (status) {
      where.status = status;
    } else {
      // 如果没有指定状态，默认只显示已发布的
      const session = await auth();
      if (!session?.user?.id) {
        where.status = 'PUBLISHED';
      }
    }

    // 查询专辑
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
            },
          },
          _count: {
            select: {
              photos: true,
            },
          },
        },
        orderBy: [
          { sortOrder: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.album.count({ where }),
    ]);

    return NextResponse.json(
      {
        albums,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('获取专辑列表错误:', error);
    return NextResponse.json(
      { error: '获取专辑列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/albums - 创建专辑
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      categoryTags,
      shootDate,
      shootDateRangeStart,
      shootDateRangeEnd,
      status = 'DRAFT',
    } = body;

    // 验证必填字段
    if (!title) {
      return NextResponse.json(
        { error: '专辑标题不能为空' },
        { status: 400 }
      );
    }

    // 创建专辑
    const album = await prisma.album.create({
      data: {
        userId: session.user.id,
        title,
        description,
        categoryTags,
        shootDate: shootDate ? new Date(shootDate) : null,
        shootDateRangeStart: shootDateRangeStart ? new Date(shootDateRangeStart) : null,
        shootDateRangeEnd: shootDateRangeEnd ? new Date(shootDateRangeEnd) : null,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: '创建成功',
        album,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建专辑错误:', error);
    return NextResponse.json(
      { error: '创建专辑失败' },
      { status: 500 }
    );
  }
}
