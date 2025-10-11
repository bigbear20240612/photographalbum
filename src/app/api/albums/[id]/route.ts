import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/albums/[id] - 获取专辑详情
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        photos: {
          orderBy: [
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
          ],
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            mediumUrl: true,
            largeUrl: true,
            originalUrl: true,
            width: true,
            height: true,
            cameraModel: true,
            lensModel: true,
            iso: true,
            aperture: true,
            shutterSpeed: true,
            focalLength: true,
            shootDate: true,
            location: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            photos: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: '专辑不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ album }, { status: 200 });
  } catch (error) {
    console.error('获取专辑详情错误:', error);
    return NextResponse.json(
      { error: '获取专辑详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/albums/[id] - 更新专辑
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = context.params;

    // 检查专辑是否存在且属于当前用户
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingAlbum) {
      return NextResponse.json(
        { error: '专辑不存在' },
        { status: 404 }
      );
    }

    if (existingAlbum.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权限修改此专辑' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      categoryTags,
      shootDate,
      shootDateRangeStart,
      shootDateRangeEnd,
      status,
      sortOrder,
      coverPhotoId,
    } = body;

    // 更新专辑
    const album = await prisma.album.update({
      where: { id },
      data: {
        title,
        description,
        categoryTags,
        shootDate: shootDate ? new Date(shootDate) : undefined,
        shootDateRangeStart: shootDateRangeStart ? new Date(shootDateRangeStart) : undefined,
        shootDateRangeEnd: shootDateRangeEnd ? new Date(shootDateRangeEnd) : undefined,
        status,
        sortOrder,
        coverPhotoId,
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
        _count: {
          select: {
            photos: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: '更新成功',
        album,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新专辑错误:', error);
    return NextResponse.json(
      { error: '更新专辑失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/albums/[id] - 删除专辑
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = context.params;

    // 检查专辑是否存在且属于当前用户
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingAlbum) {
      return NextResponse.json(
        { error: '专辑不存在' },
        { status: 404 }
      );
    }

    if (existingAlbum.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权限删除此专辑' },
        { status: 403 }
      );
    }

    // 删除专辑（会级联删除所有照片）
    await prisma.album.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: '删除成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除专辑错误:', error);
    return NextResponse.json(
      { error: '删除专辑失败' },
      { status: 500 }
    );
  }
}
