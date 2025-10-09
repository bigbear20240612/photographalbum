'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { followApi } from '@/lib/apiService';
import { useToast } from './Toast';
import { ApiError } from '@/lib/api';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialIsFollowing = false,
  className = '',
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // 不能关注自己
  const isSelf = session?.user?.id === userId;

  // 获取关注状态
  useEffect(() => {
    if (isSelf) return;

    const fetchFollowStatus = async () => {
      try {
        const response = await followApi.getFollowStatus(userId);
        setIsFollowing(response.isFollowing);
      } catch (error) {
        console.error('获取关注状态失败:', error);
      }
    };

    fetchFollowStatus();
  }, [userId, isSelf]);

  // 处理关注
  const handleFollow = async () => {
    // 未登录,跳转到登录页
    if (!session) {
      showToast('info', '请先登录');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isFollowing) {
        // 取消关注
        await followApi.unfollowUser(userId);
        setIsFollowing(false);
        showToast('success', '已取消关注');
        onFollowChange?.(false);
      } else {
        // 关注
        await followApi.followUser(userId);
        setIsFollowing(true);
        showToast('success', '关注成功');
        onFollowChange?.(true);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        showToast('error', error.message);
      } else {
        showToast('error', '操作失败,请稍后重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 不显示关注自己的按钮
  if (isSelf) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`
        px-6 py-2 rounded-lg font-medium
        transition-all duration-200
        ${
          isFollowing
            ? 'bg-white/10 text-white hover:bg-white/20'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? '处理中...' : isFollowing ? '已关注' : '关注'}
    </button>
  );
}
