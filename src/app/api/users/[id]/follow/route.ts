import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/users/[id]/follow - 关注用户
export async function POST(
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

    const targetUserId = params.id;

    // 不能关注自己
    if (targetUserId === session.user.id) {
      return NextResponse.json(
        { error: '不能关注自己' },
        { status: 400 }
      );
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 检查是否已关注
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: '已经关注过了' },
        { status: 400 }
      );
    }

    // 创建关注记录
    const follow = await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'FOLLOW',
        title: '新的关注者',
        content: `${session.user.displayName || session.user.username} 关注了你`,
        data: JSON.stringify({
          userId: session.user.id,
          username: session.user.username,
        }),
      },
    });

    // 获取关注统计
    const followerCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: session.user.id },
    });

    return NextResponse.json({
      message: '关注成功',
      follow,
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error('关注失败:', error);
    return NextResponse.json(
      { error: '关注失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]/follow - 取消关注
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

    const targetUserId = params.id;

    // 删除关注记录
    const deletedFollow = await prisma.follow.deleteMany({
      where: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });

    if (deletedFollow.count === 0) {
      return NextResponse.json(
        { error: '未找到关注记录' },
        { status: 404 }
      );
    }

    // 获取关注统计
    const followerCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: session.user.id },
    });

    return NextResponse.json({
      message: '取消关注成功',
      followerCount,
      followingCount,
    });
  } catch (error) {
    console.error('取消关注失败:', error);
    return NextResponse.json(
      { error: '取消关注失败' },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/follow - 获取关注状态
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const targetUserId = params.id;

    // 获取关注统计
    const followerCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: targetUserId },
    });

    // 如果已登录,检查当前用户是否已关注目标用户
    let isFollowing = false;
    if (session?.user?.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: targetUserId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      followerCount,
      followingCount,
      isFollowing,
    });
  } catch (error) {
    console.error('获取关注状态失败:', error);
    return NextResponse.json(
      { error: '获取关注状态失败' },
      { status: 500 }
    );
  }
}
