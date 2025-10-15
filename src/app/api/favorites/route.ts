import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 强制动态渲染
export const dynamic = 'force-dynamic';

// GET - 获取当前用户的所有收藏
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'photo' | 'album' | null

    let favorites;

    if (type === 'photo') {
      // 只获取照片收藏
      favorites = await prisma.favorite.findMany({
        where: {
          userId,
          photoId: { not: null }
        },
        include: {
          photo: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              album: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (type === 'album') {
      // 只获取专辑收藏
      favorites = await prisma.favorite.findMany({
        where: {
          userId,
          albumId: { not: null }
        },
        include: {
          album: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              _count: {
                select: {
                  photos: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // 获取所有收藏
      favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          photo: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              album: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          },
          album: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              },
              _count: {
                select: {
                  photos: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    return NextResponse.json(
      { success: false, error: '获取收藏列表失败' },
      { status: 500 }
    );
  }
}
