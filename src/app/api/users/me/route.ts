import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/me - 获取当前用户信息
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        websiteUrl: true,
        instagramUrl: true,
        weiboUrl: true,
        photographyTags: true,
        emailVerified: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            albums: true,
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

// PUT /api/users/me - 更新当前用户信息
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      displayName,
      bio,
      location,
      websiteUrl,
      instagramUrl,
      weiboUrl,
      photographyTags,
    } = body;

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        displayName,
        bio,
        location,
        websiteUrl,
        instagramUrl,
        weiboUrl,
        photographyTags,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        location: true,
        websiteUrl: true,
        instagramUrl: true,
        weiboUrl: true,
        photographyTags: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: '更新成功',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新用户信息错误:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
}
