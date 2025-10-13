import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/conversations - 获取当前用户的所有对话
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 获取用户参与的所有对话
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            read: true,
            senderId: true,
            receiverId: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });

    // 为每个对话获取对方用户信息和未读消息数
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId =
          conversation.participant1Id === userId
            ? conversation.participant2Id
            : conversation.participant1Id;

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        });

        // 计算未读消息数
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            receiverId: userId,
            read: false,
          },
        });

        const lastMessage = conversation.messages[0] || null;

        return {
          id: conversation.id,
          otherUser,
          lastMessage,
          unreadCount,
          lastMessageAt: conversation.lastMessageAt,
          createdAt: conversation.createdAt,
        };
      })
    );

    return NextResponse.json({
      success: true,
      conversations: conversationsWithDetails,
    });
  } catch (error) {
    console.error('获取对话列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取对话列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - 创建或获取与指定用户的对话
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '未授权访问' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { otherUserId } = body;

    if (!otherUserId) {
      return NextResponse.json(
        { success: false, error: '缺少对方用户ID' },
        { status: 400 }
      );
    }

    if (userId === otherUserId) {
      return NextResponse.json(
        { success: false, error: '不能与自己创建对话' },
        { status: 400 }
      );
    }

    // 检查对方用户是否存在
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 查找是否已存在对话（双向查找）
    let conversation = await prisma.conversation.findFirst({
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

    // 如果不存在，创建新对话
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: userId,
          participant2Id: otherUserId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      conversation: {
        id: conversation.id,
        otherUser: {
          id: otherUser.id,
          username: otherUser.username,
          displayName: otherUser.displayName,
          avatarUrl: otherUser.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('创建对话失败:', error);
    return NextResponse.json(
      { success: false, error: '创建对话失败' },
      { status: 500 }
    );
  }
}
