import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// 配置Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/photos/upload - 批量上传照片
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const albumId = formData.get('albumId') as string;
    const files = formData.getAll('files') as File[];

    if (!albumId) {
      return NextResponse.json(
        { error: '专辑ID不能为空' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '请选择要上传的照片' },
        { status: 400 }
      );
    }

    // 检查专辑是否存在且属于当前用户
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      select: { userId: true },
    });

    if (!album) {
      return NextResponse.json(
        { error: '专辑不存在' },
        { status: 404 }
      );
    }

    if (album.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权限上传照片到此专辑' },
        { status: 403 }
      );
    }

    // 批量上传照片
    const uploadPromises = files.map(async (file, index) => {
      try {
        // 读取文件为Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 上传到Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `photographalbum/${session.user.id}/${albumId}`,
              resource_type: 'image',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        // 生成不同尺寸的URL
        const originalUrl = uploadResult.secure_url;
        const largeUrl = cloudinary.url(uploadResult.public_id, {
          width: 2048,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        });
        const mediumUrl = cloudinary.url(uploadResult.public_id, {
          width: 1024,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        });
        const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        });

        // 获取照片元数据
        const metadata = formData.get(`metadata_${index}`) as string;
        const photoData = metadata ? JSON.parse(metadata) : {};

        // 保存到数据库
        const photo = await prisma.photo.create({
          data: {
            albumId,
            userId: session.user.id,
            title: photoData.title || file.name.replace(/\.[^/.]+$/, ''),
            description: photoData.description || null,
            originalUrl,
            largeUrl,
            mediumUrl,
            thumbnailUrl,
            width: uploadResult.width,
            height: uploadResult.height,
            fileSize: uploadResult.bytes,
            mimeType: file.type,
            exifData: uploadResult.exif || null,
            cameraModel: photoData.cameraModel || null,
            lensModel: photoData.lensModel || null,
            iso: photoData.iso ? parseInt(photoData.iso) : null,
            aperture: photoData.aperture || null,
            shutterSpeed: photoData.shutterSpeed || null,
            focalLength: photoData.focalLength || null,
            shootDate: photoData.shootDate ? new Date(photoData.shootDate) : null,
            location: photoData.location || null,
            categoryTag: photoData.categoryTag || null,
            sortOrder: index,
          },
        });

        return { success: true, photo };
      } catch (error) {
        console.error('上传照片错误:', error);
        return { success: false, error: error instanceof Error ? error.message : '上传失败' };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    // 更新专辑的照片数量
    await prisma.album.update({
      where: { id: albumId },
      data: {
        photoCount: {
          increment: successCount,
        },
      },
    });

    return NextResponse.json(
      {
        message: `成功上传 ${successCount} 张照片${failCount > 0 ? `，${failCount} 张失败` : ''}`,
        results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('批量上传照片错误:', error);
    return NextResponse.json(
      { error: '批量上传照片失败' },
      { status: 500 }
    );
  }
}
