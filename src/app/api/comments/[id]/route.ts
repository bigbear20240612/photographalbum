import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/comments/[id] - 更新评论
export async function PUT(
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

    const commentId = params.id;
    const body = await request.json();
    const { content } = body;

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

    // 检查评论是否存在
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    // 检查权限(只能更新自己的评论)
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权更新此评论' },
        { status: 403 }
      );
    }

    // 更新评论
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
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

    return NextResponse.json({
      message: '评论更新成功',
      comment: updatedComment,
    });
  } catch (error) {
    console.error('更新评论失败:', error);
    return NextResponse.json(
      { error: '更新评论失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - 删除评论
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

    const commentId = params.id;

    // 检查评论是否存在
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    // 检查权限(只能删除自己的评论)
    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权删除此评论' },
        { status: 403 }
      );
    }

    // 删除评论(级联删除所有回复)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      message: '评论删除成功',
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
}
