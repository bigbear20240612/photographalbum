import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/users/[id] - 获取用户公开信息 (支持 ID 或 username)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 尝试通过 ID 或 username 查找用户
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: id },
          { username: id },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        websiteUrl: true,
        instagramUrl: true,
        weiboUrl: true,
        photographyTags: true,
        createdAt: true,
        _count: {
          select: {
            albums: {
              where: {
                status: 'PUBLISHED',
              },
            },
            photos: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}
