'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { likeApi } from '@/lib/apiService';
import { useToast } from './Toast';
import { ApiError } from '@/lib/api';

interface LikeButtonProps {
  photoId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  className?: string;
}

export default function LikeButton({
  photoId,
  initialLikeCount = 0,
  initialIsLiked = false,
  className = '',
}: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  // 获取点赞状态
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await likeApi.getLikeStatus(photoId);
        setIsLiked(response.isLiked);
        setLikeCount(response.likeCount);
      } catch (error) {
        console.error('获取点赞状态失败:', error);
      }
    };

    fetchLikeStatus();
  }, [photoId]);

  // 处理点赞
  const handleLike = async () => {
    // 未登录,跳转到登录页
    if (!session) {
      showToast('info', '请先登录');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      if (isLiked) {
        // 取消点赞
        const response = await likeApi.unlikePhoto(photoId);
        setIsLiked(false);
        setLikeCount(response.likeCount);
        showToast('success', '已取消点赞');
      } else {
        // 点赞
        const response = await likeApi.likePhoto(photoId);
        setIsLiked(true);
        setLikeCount(response.likeCount);
        showToast('success', '点赞成功');
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

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200
        ${
          isLiked
            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${
          isLiked ? 'scale-110 fill-current' : 'stroke-current fill-none'
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="font-medium">{likeCount}</span>
    </button>
  );
}
