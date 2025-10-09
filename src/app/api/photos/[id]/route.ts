import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/photos/[id] - 获取照片详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({
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
        album: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    if (!photo) {
      return NextResponse.json(
        { error: '照片不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ photo }, { status: 200 });
  } catch (error) {
    console.error('获取照片详情错误:', error);
    return NextResponse.json(
      { error: '获取照片详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/photos/[id] - 更新照片信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查照片是否存在且属于当前用户
    const existingPhoto = await prisma.photo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { error: '照片不存在' },
        { status: 404 }
      );
    }

    if (existingPhoto.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权限修改此照片' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      cameraModel,
      lensModel,
      iso,
      aperture,
      shutterSpeed,
      focalLength,
      shootDate,
      location,
      categoryTag,
      sortOrder,
    } = body;

    // 更新照片
    const photo = await prisma.photo.update({
      where: { id },
      data: {
        title,
        description,
        cameraModel,
        lensModel,
        iso: iso ? parseInt(iso) : undefined,
        aperture,
        shutterSpeed,
        focalLength,
        shootDate: shootDate ? new Date(shootDate) : undefined,
        location,
        categoryTag,
        sortOrder,
      },
    });

    return NextResponse.json(
      {
        message: '更新成功',
        photo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新照片错误:', error);
    return NextResponse.json(
      { error: '更新照片失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/photos/[id] - 删除照片
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查照片是否存在且属于当前用户
    const existingPhoto = await prisma.photo.findUnique({
      where: { id },
      select: { userId: true, albumId: true },
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { error: '照片不存在' },
        { status: 404 }
      );
    }

    if (existingPhoto.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权限删除此照片' },
        { status: 403 }
      );
    }

    // 删除照片
    await prisma.photo.delete({
      where: { id },
    });

    // 更新专辑的照片数量
    await prisma.album.update({
      where: { id: existingPhoto.albumId },
      data: {
        photoCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      { message: '删除成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除照片错误:', error);
    return NextResponse.json(
      { error: '删除照片失败' },
      { status: 500 }
    );
  }
}
