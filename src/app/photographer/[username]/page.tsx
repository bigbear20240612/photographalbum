'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Container from '@/components/layout/Container';
import AlbumGrid from '@/components/features/AlbumGrid';
import FollowButton from '@/components/ui/FollowButton';
import Button from '@/components/ui/Button';
import { userApi, albumApi } from '@/lib/apiService';
import type { User, Album } from '@/types';

export default function PhotographerPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // 检查是否是查看自己的页面
  const isOwnProfile = session?.user?.username === username;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取用户信息
        const userResponse = await userApi.getUserByUsername(username);
        setUser(userResponse.user);

        // 获取用户专辑
        const albumsResponse = await albumApi.getAlbums({ username, status: 'PUBLISHED' });
        setAlbums(albumsResponse.albums);

        // 如果有用户ID,获取关注统计
        if (userResponse.user?.id) {
          const followApi = await import('@/lib/apiService').then(m => m.followApi);
          const followStatus = await followApi.getFollowStatus(userResponse.user.id);
          setFollowerCount(followStatus.followerCount);
          setFollowingCount(followStatus.followingCount);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (isLoading) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-warm-gray">加载中...</p>
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold text-charcoal mb-4">
            用户不存在
          </h1>
          <p className="text-warm-gray">该摄影师页面不存在或已被删除</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <Container>
        {/* User Profile Header */}
        <div className="text-center mb-12">
          {/* Avatar */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-glass-md">
            <img
              src={user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.username) + '&size=200&background=random'}
              alt={user.displayName || user.username}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h1 className="font-serif text-4xl font-semibold text-charcoal mb-3">
            {user.displayName || user.username}
          </h1>

          {/* Bio */}
          {user.bio && (
            <p className="text-lg text-warm-gray max-w-2xl mx-auto mb-4">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6 text-sm text-warm-gray">
            <div>
              <span className="font-semibold text-charcoal">{albums.length}</span> 专辑
            </div>
            <div>
              <span className="font-semibold text-charcoal">{followerCount}</span> 关注者
            </div>
            <div>
              <span className="font-semibold text-charcoal">{followingCount}</span> 关注中
            </div>
          </div>

          {/* Action Buttons */}
          {user.id && !isOwnProfile && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <FollowButton
                userId={user.id}
                onFollowChange={(isFollowing) => {
                  // 更新关注者数量
                  setFollowerCount(prev => isFollowing ? prev + 1 : prev - 1);
                }}
              />
              <Button
                variant="secondary"
                size="medium"
                onClick={() => router.push(`/messages/${username}`)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                发私信
              </Button>
            </div>
          )}

          {/* Location */}
          {user.location && (
            <div className="flex items-center justify-center gap-2 text-light-gray mb-4">
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
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{user.location}</span>
            </div>
          )}

          {/* Tags */}
          {user.photographyTags && user.photographyTags.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
              {typeof user.photographyTags === 'string'
                ? JSON.parse(user.photographyTags).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-terra-cotta/10 text-terra-cotta text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))
                : user.photographyTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-terra-cotta/10 text-terra-cotta text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {user.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-beige hover:bg-terra-cotta/10 text-warm-gray hover:text-terra-cotta transition-all"
                aria-label="Website"
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            )}

            {user.instagramUrl && (
              <a
                href={user.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-beige hover:bg-terra-cotta/10 text-warm-gray hover:text-terra-cotta transition-all"
                aria-label="Instagram"
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
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}

            {user.weiboUrl && (
              <a
                href={user.weiboUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-warm-beige hover:bg-terra-cotta/10 text-warm-gray hover:text-terra-cotta transition-all"
                aria-label="Weibo"
              >
                <span className="text-sm font-semibold">微</span>
              </a>
            )}
          </div>
        </div>

        {/* Albums Section */}
        <div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal mb-8 text-center">
            {albums.length > 0 ? '作品集' : '暂无作品'}
          </h2>

          {albums.length > 0 ? (
            <AlbumGrid
              albums={albums}
              onAlbumClick={(album) =>
                router.push(`/photographer/${username}/album/${album.id}`)
              }
            />
          ) : (
            <p className="text-center text-warm-gray py-12">
              该摄影师还没有发布作品
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
