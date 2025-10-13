import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/messages?conversationId=xxx&otherUserId=xxx - 获取对话中的消息
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
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const otherUserId = searchParams.get('otherUserId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 如果提供了 otherUserId，先找到或创建对话
    let actualConversationId = conversationId;

    if (!conversationId && otherUserId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            {
              participant1Id: userId,
              participant2Id: otherUserId,
            },
            {
              participant1Id: otherUserId,
              participant2Id: userId,
            },
          ],
        },
      });

      if (conversation) {
        actualConversationId = conversation.id;
      } else {
        // 没有对话历史，返回空数组
        return NextResponse.json({
          success: true,
          messages: [],
          hasMore: false,
        });
      }
    }

    if (!actualConversationId) {
      return NextResponse.json(
        { success: false, error: '缺少对话ID' },
        { status: 400 }
      );
    }

    // 验证用户是否是对话参与者
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: actualConversationId,
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: '对话不存在或无权访问' },
        { status: 403 }
      );
    }

    // 获取消息
    const messages = await prisma.message.findMany({
      where: {
        conversationId: actualConversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 标记接收到的消息为已读
    await prisma.message.updateMany({
      where: {
        conversationId: actualConversationId,
        receiverId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    // 检查是否还有更多消息
    const totalCount = await prisma.message.count({
      where: {
        conversationId: actualConversationId,
      },
    });

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // 按时间正序返回
      hasMore: offset + limit < totalCount,
      conversationId: actualConversationId,
    });
  } catch (error) {
    console.error('获取消息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取消息失败' },
      { status: 500 }
    );
  }
}

// POST /api/messages - 发送新消息
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (userId === receiverId) {
      return NextResponse.json(
        { success: false, error: '不能给自己发消息' },
        { status: 400 }
      );
    }

    // 验证内容长度
    if (content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { success: false, error: '消息内容过长（最多2000字符）' },
        { status: 400 }
      );
    }

    // 检查接收者是否存在
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { success: false, error: '接收者不存在' },
        { status: 404 }
      );
    }

    // 查找或创建对话
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          {
            participant1Id: userId,
            participant2Id: receiverId,
          },
          {
            participant1Id: receiverId,
            participant2Id: userId,
          },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: receiverId,
        },
      });
    }

    // 创建消息
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        receiverId: receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // 更新对话的最后消息时间
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageId: message.id,
        lastMessageAt: message.createdAt,
      },
    });

    // 创建通知
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE',
        title: '新消息',
        content: `${session.user.name || session.user.username} 给你发送了一条消息`,
        data: JSON.stringify({
          messageId: message.id,
          conversationId: conversation.id,
          senderId: userId,
          preview: content.slice(0, 50),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    return NextResponse.json(
      { success: false, error: '发送消息失败' },
      { status: 500 }
    );
  }
}
