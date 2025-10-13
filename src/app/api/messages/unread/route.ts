import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/messages/unread - 获取未读消息总数
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 统计未读消息数
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error('获取未读消息数失败:', error);
    return NextResponse.json(
      { success: false, error: '获取未读消息数失败' },
      { status: 500 }
    );
  }
}
