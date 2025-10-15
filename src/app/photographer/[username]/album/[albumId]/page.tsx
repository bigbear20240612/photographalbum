'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import PhotoGrid from '@/components/features/PhotoGrid';
import Lightbox from '@/components/features/Lightbox';
import FollowButton from '@/components/ui/FollowButton';
import FavoriteButton from '@/components/ui/FavoriteButton';
import Button from '@/components/ui/Button';
import { userApi, albumApi } from '@/lib/apiService';
import { formatDate } from '@/lib/utils';
import type { User, Album, Photo } from '@/types';

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const username = params.username as string;
  const albumId = params.albumId as string;

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  // 检查是否是查看自己的专辑
  const isOwnAlbum = session?.user?.username === username;

  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载专辑信息（包含照片和用户信息）
        const albumResponse = await albumApi.getAlbumById(albumId);
        setAlbum(albumResponse.album);

        // 从专辑响应中获取用户信息
        if (albumResponse.album.user) {
          setUser(albumResponse.album.user as any);

          // 获取关注统计
          if (albumResponse.album.user.id) {
            try {
              const followApi = await import('@/lib/apiService').then(m => m.followApi);
              const followStatus = await followApi.getFollowStatus(albumResponse.album.user.id);
              setFollowerCount(followStatus.followerCount);
            } catch (error) {
              console.error('获取关注统计失败:', error);
            }
          }
        }

        // 从专辑响应中获取照片列表
        if (albumResponse.album.photos) {
          setPhotos(albumResponse.album.photos as any);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (albumId) {
      loadData();
    }
  }, [albumId]);

  if (isLoading) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-warm-gray">加载中...</p>
        </div>
      </Container>
    );
  }

  if (!user || !album) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold text-charcoal mb-4">
            专辑不存在
          </h1>
          <p className="text-warm-gray mb-6">该专辑不存在或已被删除</p>
          <button
            onClick={() => router.back()}
            className="text-terra-cotta hover:text-amber-gold transition-colors"
          >
            返回上一页
          </button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="min-h-screen py-12">
        <Container>
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href={`/photographer/${username}`}
              className="inline-flex items-center gap-2 text-warm-gray hover:text-terra-cotta transition-colors"
            >
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>返回 {user.displayName || user.username}</span>
            </Link>
          </div>

          {/* User Info Card */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {/* User Avatar */}
            <Link href={`/photographer/${username}`}>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&size=128&background=random`}
                  alt={user.displayName || user.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            {/* User Info and Actions */}
            <div className="flex flex-col items-start">
              <Link
                href={`/photographer/${username}`}
                className="text-lg font-semibold text-charcoal hover:text-terra-cotta transition-colors"
              >
                {user.displayName || user.username}
              </Link>
              <div className="flex items-center gap-2 text-sm text-warm-gray">
                <span>{followerCount} 关注者</span>
              </div>
            </div>

            {/* Action Buttons */}
            {user.id && !isOwnAlbum && (
              <div className="flex items-center gap-2 ml-4">
                <FollowButton
                  userId={user.id}
                  onFollowChange={(isFollowing) => {
                    setFollowerCount(prev => isFollowing ? prev + 1 : prev - 1);
                  }}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => router.push(`/messages/${username}`)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  私信
                </Button>
              </div>
            )}
          </div>

          {/* Album Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal">
                {album.title}
              </h1>
              <FavoriteButton albumId={album.id} />
            </div>

            {album.description && (
              <p className="text-lg text-warm-gray leading-relaxed mb-6">
                {album.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-6 text-sm text-light-gray">
              {album.categoryTags && (() => {
                try {
                  const tags = JSON.parse(album.categoryTags);
                  if (Array.isArray(tags) && tags.length > 0) {
                    return (
                      <div className="flex items-center gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-terra-cotta/10 text-terra-cotta rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    );
                  }
                } catch {
                  return null;
                }
                return null;
              })()}
              <span>{photos.length} 张照片</span>
              <span>{formatDate(album.createdAt)}</span>
            </div>
          </div>

          {/* Photos Grid */}
          {photos.length > 0 ? (
            <PhotoGrid
              photos={photos}
              onPhotoClick={(index) => {
                setLightboxIndex(index);
                setIsLightboxOpen(true);
              }}
            />
          ) : (
            <div className="text-center py-16 text-warm-gray">
              该专辑还没有照片
            </div>
          )}
        </Container>
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
