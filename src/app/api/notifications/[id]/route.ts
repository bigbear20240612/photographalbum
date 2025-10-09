import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/notifications/[id] - 标记单个通知为已读
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // 检查通知是否存在且属于当前用户
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: '通知不存在' },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权操作此通知' },
        { status: 403 }
      );
    }

    // 更新通知为已读
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({
      message: '通知已标记为已读',
      notification: updatedNotification,
    });
  } catch (error) {
    console.error('标记通知已读失败:', error);
    return NextResponse.json(
      { error: '标记通知已读失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - 删除单个通知
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const notificationId = params.id;

    // 检查通知是否存在且属于当前用户
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return NextResponse.json(
        { error: '通知不存在' },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权操作此通知' },
        { status: 403 }
      );
    }

    // 删除通知
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({
      message: '通知已删除',
    });
  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json(
      { error: '删除通知失败' },
      { status: 500 }
    );
  }
}
