'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Container from '@/components/layout/Container';
import { AlbumCard } from '@/components/ui/Card';
import type { Album, Photo, User } from '@/types';

// 收藏项类型
type FavoriteItem = {
  id: string;
  userId: string;
  photoId: string | null;
  albumId: string | null;
  createdAt: string;
  photo?: Photo & {
    user: User;
    album?: { id: string; title: string };
  };
  album?: Album & {
    user: User;
    _count: { photos: number };
  };
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photo' | 'album'>('photo');
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载收藏列表
  useEffect(() => {
    if (status === 'authenticated') {
      loadFavorites();
    }
  }, [status, activeTab]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/favorites?type=${activeTab}`);
      const data = await response.json();

      if (data.success) {
        setFavorites(data.favorites || []);
      } else {
        toast.error('加载收藏失败');
      }
    } catch (error) {
      console.error('加载收藏失败:', error);
      toast.error('加载收藏失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-soft-white pt-24 pb-16">
        <Container>
          <div className="text-center py-16">
            <p className="text-warm-gray">加载中...</p>
          </div>
        </Container>
      </div>
    );
  }

  // 从收藏项中提取照片或专辑
  const items = favorites
    .map((fav) => (activeTab === 'photo' ? fav.photo : fav.album))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
            我的收藏
          </h1>
          <p className="text-warm-gray">
            你收藏的照片和专辑
          </p>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-4 mb-8 border-b border-border-light">
          <button
            onClick={() => setActiveTab('photo')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'photo'
                ? 'text-terra-cotta border-b-2 border-terra-cotta'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            照片收藏 ({favorites.filter(f => f.photoId).length})
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'album'
                ? 'text-terra-cotta border-b-2 border-terra-cotta'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            专辑收藏 ({favorites.filter(f => f.albumId).length})
          </button>
        </div>

        {/* 照片收藏列表 */}
        {activeTab === 'photo' && (
          <div>
            {items.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-warm-gray">
                    共 {items.length} 张照片
                  </p>
                </div>

                {/* 照片网格 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.map((photo: any) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square bg-warm-beige rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          {photo.title && (
                            <p className="text-sm text-white font-medium line-clamp-1 mb-1">
                              {photo.title}
                            </p>
                          )}
                          {photo.user && (
                            <p className="text-xs text-white/80">
                              @{photo.user.username}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-warm-beige/50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-warm-gray"
                  >
                    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  还没有收藏照片
                </h3>
                <p className="text-warm-gray mb-6">
                  浏览照片时点击收藏按钮添加到这里
                </p>
                <Link href="/">
                  <button className="px-6 py-2 bg-terra-cotta text-white rounded-lg hover:bg-terra-cotta/90 transition-colors">
                    去浏览照片
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 专辑收藏列表 */}
        {activeTab === 'album' && (
          <div>
            {items.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-warm-gray">
                    共 {items.length} 个专辑
                  </p>
                </div>

                {/* 专辑网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((album: any) => (
                    <Link
                      key={album.id}
                      href={`/photographer/${album.user.username}/album/${album.id}`}
                    >
                      <AlbumCard
                        coverUrl={album.coverPhotoUrl || ''}
                        title={album.title}
                        photoCount={album._count?.photos ?? 0}
                      />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-warm-beige/50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-warm-gray"
                  >
                    <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  还没有收藏专辑
                </h3>
                <p className="text-warm-gray mb-6">
                  浏览专辑时点击收藏按钮添加到这里
                </p>
                <Link href="/">
                  <button className="px-6 py-2 bg-terra-cotta text-white rounded-lg hover:bg-terra-cotta/90 transition-colors">
                    去浏览专辑
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
