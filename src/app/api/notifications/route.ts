import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/notifications - 获取通知列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = { userId: session.user.id };
    if (unreadOnly) {
      where.read = false;
    }

    // 获取通知列表
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // 获取总数
    const total = await prisma.notification.count({ where });

    // 获取未读数量
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json(
      { error: '获取通知列表失败' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications - 批量标记为已读
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: '无效的通知ID列表' },
        { status: 400 }
      );
    }

    // 批量更新通知为已读
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id, // 确保只能更新自己的通知
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({
      message: '通知已标记为已读',
      count: result.count,
    });
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return NextResponse.json(
      { error: '标记通知已读失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - 批量删除通知
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationIds = searchParams.get('ids')?.split(',') || [];

    if (notificationIds.length === 0) {
      return NextResponse.json(
        { error: '无效的通知ID列表' },
        { status: 400 }
      );
    }

    // 批量删除通知
    const result = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id, // 确保只能删除自己的通知
      },
    });

    return NextResponse.json({
      message: '通知已删除',
      count: result.count,
    });
  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json(
      { error: '删除通知失败' },
      { status: 500 }
    );
  }
}
