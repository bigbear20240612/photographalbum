import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取照片详情 (管理员)
 * GET /api/admin/photos/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            email: true,
            status: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!photo) {
      return NextResponse.json({ error: '照片不存在' }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('获取照片详情失败:', error);
    return NextResponse.json(
      { error: '获取照片详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除照片 (管理员)
 * DELETE /api/admin/photos/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const photo = await prisma.photo.findUnique({
      where: { id },
      select: { id: true, title: true, albumId: true },
    });

    if (!photo) {
      return NextResponse.json({ error: '照片不存在' }, { status: 404 });
    }

    // 删除照片
    await prisma.photo.delete({
      where: { id },
    });

    // 更新专辑的照片数量
    await prisma.album.update({
      where: { id: photo.albumId },
      data: {
        photoCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      message: '照片已删除',
      deletedPhoto: {
        id: photo.id,
        title: photo.title,
      },
    });
  } catch (error) {
    console.error('删除照片失败:', error);
    return NextResponse.json(
      { error: '删除照片失败' },
      { status: 500 }
    );
  }
}
