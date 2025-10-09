import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 获取专辑详情 (管理员)
 * GET /api/admin/albums/[id]
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

    const album = await prisma.album.findUnique({
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
            role: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            createdAt: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: '专辑不存在' }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error('获取专辑详情失败:', error);
    return NextResponse.json(
      { error: '获取专辑详情失败' },
      { status: 500 }
    );
  }
}

/**
 * 更新专辑状态 (管理员)
 * PUT /api/admin/albums/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 验证管理员权限
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['DRAFT', 'PUBLISHED'].includes(status)) {
      return NextResponse.json(
        { error: '无效的状态值' },
        { status: 400 }
      );
    }

    const updatedAlbum = await prisma.album.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: '专辑状态已更新',
      album: updatedAlbum,
    });
  } catch (error) {
    console.error('更新专辑状态失败:', error);
    return NextResponse.json(
      { error: '更新专辑状态失败' },
      { status: 500 }
    );
  }
}

/**
 * 删除专辑 (管理员)
 * DELETE /api/admin/albums/[id]
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

    const album = await prisma.album.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!album) {
      return NextResponse.json({ error: '专辑不存在' }, { status: 404 });
    }

    // 删除专辑(会级联删除照片)
    await prisma.album.delete({
      where: { id },
    });

    return NextResponse.json({
      message: '专辑已删除',
      deletedAlbum: {
        id: album.id,
        title: album.title,
      },
    });
  } catch (error) {
    console.error('删除专辑失败:', error);
    return NextResponse.json(
      { error: '删除专辑失败' },
      { status: 500 }
    );
  }
}
