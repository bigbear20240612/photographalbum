import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';



// POST /api/photos/[id]/like - 点赞照片
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const photoId = params.id;

    // 检查照片是否存在
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json(
        { error: '照片不存在' },
        { status: 404 }
      );
    }

    // 检查是否已点赞
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_photoId: {
          userId: session.user.id,
          photoId: photoId,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json(
        { error: '已经点赞过了' },
        { status: 400 }
      );
    }

    // 创建点赞记录
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        photoId: photoId,
      },
    });

    // 如果点赞的不是自己的照片,创建通知
    if (photo.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: photo.userId,
          type: 'LIKE',
          title: '新的点赞',
          content: `${session.user.displayName || session.user.username} 赞了你的照片`,
          data: JSON.stringify({
            photoId: photoId,
            userId: session.user.id,
            username: session.user.username,
          }),
        },
      });
    }

    // 获取点赞总数
    const likeCount = await prisma.like.count({
      where: { photoId: photoId },
    });

    return NextResponse.json({
      message: '点赞成功',
      like,
      likeCount,
    });
  } catch (error) {
    console.error('点赞失败:', error);
    return NextResponse.json(
      { error: '点赞失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/photos/[id]/like - 取消点赞
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const photoId = params.id;

    // 删除点赞记录
    const deletedLike = await prisma.like.deleteMany({
      where: {
        userId: session.user.id,
        photoId: photoId,
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json(
        { error: '未找到点赞记录' },
        { status: 404 }
      );
    }

    // 获取点赞总数
    const likeCount = await prisma.like.count({
      where: { photoId: photoId },
    });

    return NextResponse.json({
      message: '取消点赞成功',
      likeCount,
    });
  } catch (error) {
    console.error('取消点赞失败:', error);
    return NextResponse.json(
      { error: '取消点赞失败' },
      { status: 500 }
    );
  }
}

// GET /api/photos/[id]/like - 获取点赞状态和数量
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const photoId = params.id;

    // 获取点赞总数
    const likeCount = await prisma.like.count({
      where: { photoId: photoId },
    });

    // 如果已登录,检查当前用户是否已点赞
    let isLiked = false;
    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: {
          userId_photoId: {
            userId: session.user.id,
            photoId: photoId,
          },
        },
      });
      isLiked = !!like;
    }

    return NextResponse.json({
      likeCount,
      isLiked,
    });
  } catch (error) {
    console.error('获取点赞状态失败:', error);
    return NextResponse.json(
      { error: '获取点赞状态失败' },
      { status: 500 }
    );
  }
}
