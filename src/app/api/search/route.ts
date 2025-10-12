export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/search - 全局搜索
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, users, albums, photos
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: '搜索关键词至少需要2个字符' },
        { status: 400 }
      );
    }

    const searchTerm = `%${query.trim()}%`;
    const results: any = {};

    // 搜索用户
    if (type === 'all' || type === 'users') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query.trim() } },
            { displayName: { contains: query.trim() } },
            { bio: { contains: query.trim() } },
          ],
          status: 'ACTIVE',
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
          location: true,
        },
        take: limit,
      });
      results.users = users;
    }

    // 搜索专辑
    if (type === 'all' || type === 'albums') {
      const albums = await prisma.album.findMany({
        where: {
          OR: [
            { title: { contains: query.trim() } },
            { description: { contains: query.trim() } },
          ],
          status: 'PUBLISHED',
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
        },
        take: limit,
      });
      results.albums = albums;
    }

    // 搜索照片
    if (type === 'all' || type === 'photos') {
      const photos = await prisma.photo.findMany({
        where: {
          OR: [
            { title: { contains: query.trim() } },
            { description: { contains: query.trim() } },
            { location: { contains: query.trim() } },
          ],
          album: {
            status: 'PUBLISHED',
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          album: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        take: limit,
      });
      results.photos = photos;
    }

    // 计算总结果数
    const totalResults =
      (results.users?.length || 0) +
      (results.albums?.length || 0) +
      (results.photos?.length || 0);

    return NextResponse.json({
      query,
      totalResults,
      results,
    });
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json({ error: '搜索失败' }, { status: 500 });
  }
}
