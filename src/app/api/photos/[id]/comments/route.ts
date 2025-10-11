import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';



// GET /api/photos/[id]/comments - 获取评论列表
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photoId = params.id;

    // 获取所有评论(包括回复)
    const comments = await prisma.comment.findMany({
      where: { photoId: photoId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        replies: {
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
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 只返回顶级评论(没有parentId的)
    const topLevelComments = comments.filter(c => !c.parentId);

    return NextResponse.json({
      comments: topLevelComments,
      total: topLevelComments.length,
    });
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 }
    );
  }
}

// POST /api/photos/[id]/comments - 发表评论
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
    const body = await request.json();
    const { content, parentId } = body;

    // 验证评论内容
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: '评论内容不能超过500字' },
        { status: 400 }
      );
    }

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

    // 如果是回复,检查父评论是否存在
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: '父评论不存在' },
          { status: 404 }
        );
      }

      if (parentComment.photoId !== photoId) {
        return NextResponse.json(
          { error: '父评论不属于当前照片' },
          { status: 400 }
        );
      }
    }

    // 创建评论
    const comment = await prisma.comment.create({
      data: {
        photoId: photoId,
        userId: session.user.id,
        content: content.trim(),
        parentId: parentId || null,
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

    // 创建通知
    // 如果是回复,通知被回复的用户
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        include: { user: true },
      });

      if (parentComment && parentComment.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            type: 'COMMENT',
            title: '新的回复',
            content: `${session.user.displayName || session.user.username} 回复了你的评论`,
            data: JSON.stringify({
              photoId: photoId,
              commentId: comment.id,
              userId: session.user.id,
              username: session.user.username,
            }),
          },
        });
      }
    } else {
      // 如果是评论照片,通知照片作者
      if (photo.userId !== session.user.id) {
        await prisma.notification.create({
          data: {
            userId: photo.userId,
            type: 'COMMENT',
            title: '新的评论',
            content: `${session.user.displayName || session.user.username} 评论了你的照片`,
            data: JSON.stringify({
              photoId: photoId,
              commentId: comment.id,
              userId: session.user.id,
              username: session.user.username,
            }),
          },
        });
      }
    }

    return NextResponse.json({
      message: '评论成功',
      comment,
    });
  } catch (error) {
    console.error('评论失败:', error);
    return NextResponse.json(
      { error: '评论失败' },
      { status: 500 }
    );
  }
}
