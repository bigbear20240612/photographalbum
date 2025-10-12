'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { AlbumCard } from '@/components/ui/Card';
import { albumApi, userApi, photoApi } from '@/lib/apiService';
import type { Album, User, Photo } from '@/types';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>('albums');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载用户信息和专辑
  useEffect(() => {
    if (status === 'authenticated') {
      loadUserData();
    }
  }, [status]);

  const loadUserData = async () => {
    try {
      // 获取当前用户信息
      const userResponse = await userApi.getCurrentUser();
      setCurrentUser(userResponse.user);

      // 获取用户的专辑列表
      const albumsResponse = await albumApi.getAlbums({
        username: userResponse.user.username,
      });
      setUserAlbums(albumsResponse.albums);
    } catch (error: any) {
      console.error('加载数据失败:', error);
      toast.error('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 加载用户所有照片
  const loadUserPhotos = async () => {
    if (!currentUser) return;

    setPhotosLoading(true);
    try {
      // 遍历用户所有专辑获取照片
      const allPhotos: (Photo & { album?: { title: string } })[] = [];

      for (const album of userAlbums) {
        const response = await fetch(`/api/albums/${album.id}`);
        if (response.ok) {
          const data = await response.json();
          // 为每张照片添加专辑信息
          const photosWithAlbum = (data.album.photos || []).map((photo: Photo) => ({
            ...photo,
            album: { title: album.title }
          }));
          allPhotos.push(...photosWithAlbum);
        }
      }

      setUserPhotos(allPhotos);
    } catch (error: any) {
      console.error('加载照片失败:', error);
      toast.error('加载照片失败');
    } finally {
      setPhotosLoading(false);
    }
  };

  // 当切换到照片标签时加载照片
  useEffect(() => {
    if (activeTab === 'photos' && userPhotos.length === 0 && !photosLoading) {
      loadUserPhotos();
    }
  }, [activeTab]);

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

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
            我的工作台
          </h1>
          <p className="text-warm-gray">
            管理你的专辑和作品
          </p>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-4 mb-8 border-b border-border-light">
          <button
            onClick={() => setActiveTab('albums')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'albums'
                ? 'text-terra-cotta border-b-2 border-terra-cotta'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            我的专辑 ({userAlbums.length})
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-4 px-2 font-medium transition-colors ${
              activeTab === 'photos'
                ? 'text-terra-cotta border-b-2 border-terra-cotta'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            所有照片
          </button>
        </div>

        {/* 专辑列表 */}
        {activeTab === 'albums' && (
          <div>
            {/* 操作栏 */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-warm-gray">
                共 {userAlbums.length} 个专辑
              </p>
              <Link href="/dashboard/albums/create">
                <Button variant="primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  创建专辑
                </Button>
              </Link>
            </div>

            {/* 专辑网格 */}
            {userAlbums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAlbums.map((album) => (
                  <div key={album.id} className="group relative">
                    <Link href={`/photographer/${currentUser.username}/album/${album.id}`}>
                      <AlbumCard
                        coverUrl={album.coverPhotoUrl || ''}
                        title={album.title}
                        photoCount={album.photoCount ?? 0}
                      />
                    </Link>

                    {/* 操作按钮（悬停显示） */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Link href={`/dashboard/albums/${album.id}/edit`}>
                        <button className="glass-light p-2 rounded-lg hover:bg-white/90 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                      </Link>
                      <Link href={`/dashboard/albums/${album.id}/upload`}>
                        <button className="glass-light p-2 rounded-lg hover:bg-white/90 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
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
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  还没有专辑
                </h3>
                <p className="text-warm-gray mb-6">
                  创建你的第一个专辑，开始展示作品
                </p>
                <Link href="/dashboard/albums/create">
                  <Button variant="primary">创建专辑</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 照片列表 */}
        {activeTab === 'photos' && (
          <div>
            {photosLoading ? (
              <div className="text-center py-16">
                <p className="text-warm-gray">加载中...</p>
              </div>
            ) : userPhotos.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-warm-gray">
                    共 {userPhotos.length} 张照片
                  </p>
                </div>

                {/* 照片网格 */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {userPhotos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square bg-warm-beige rounded-lg overflow-hidden cursor-pointer">
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
                          <p className="text-xs text-white/80">
                            {photo.album?.title || '未分类'}
                          </p>
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
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  还没有照片
                </h3>
                <p className="text-warm-gray mb-6">
                  创建专辑并上传照片开始展示作品
                </p>
                <Link href="/dashboard/albums/create">
                  <Button variant="primary">创建专辑</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
