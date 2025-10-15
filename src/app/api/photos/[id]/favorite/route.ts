import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 强制动态渲染
export const dynamic = 'force-dynamic';

// GET - 检查是否已收藏
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ isFavorited: false });
    }

    const photoId = params.id;
    const userId = session.user.id;

    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        photoId
      }
    });

    return NextResponse.json({
      success: true,
      isFavorited: !!favorite
    });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json(
      { success: false, error: '检查收藏状态失败' },
      { status: 500 }
    );
  }
}

// POST - 收藏/取消收藏照片
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const photoId = params.id;
    const userId = session.user.id;

    // 检查照片是否存在
    const photo = await prisma.photo.findUnique({
      where: { id: photoId }
    });

    if (!photo) {
      return NextResponse.json(
        { success: false, error: '照片不存在' },
        { status: 404 }
      );
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        photoId
      }
    });

    if (existingFavorite) {
      // 取消收藏
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });

      return NextResponse.json({
        success: true,
        isFavorited: false,
        message: '已取消收藏'
      });
    } else {
      // 添加收藏
      await prisma.favorite.create({
        data: {
          userId,
          photoId
        }
      });

      return NextResponse.json({
        success: true,
        isFavorited: true,
        message: '已收藏'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json(
      { success: false, error: '收藏操作失败' },
      { status: 500 }
    );
  }
}
