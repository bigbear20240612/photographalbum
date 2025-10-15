'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

interface FavoriteButtonProps {
  photoId?: string;
  albumId?: string;
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  photoId,
  albumId,
  showLabel = false,
  className = '',
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = photoId
    ? `/api/photos/${photoId}/favorite`
    : albumId
    ? `/api/albums/${albumId}/favorite`
    : null;

  // 获取收藏状态
  useEffect(() => {
    if (!apiUrl || !session) return;

    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.success) {
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error('获取收藏状态失败:', error);
      }
    };

    fetchFavoriteStatus();
  }, [apiUrl, session]);

  // 处理收藏切换
  const toggleFavorite = async () => {
    // 未登录,跳转到登录页
    if (!session) {
      showToast('info', '请先登录');
      router.push('/login');
      return;
    }

    if (!apiUrl) return;

    setIsLoading(true);

    try {
      const response = await fetch(apiUrl, { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        setIsFavorited(data.isFavorited);
        showToast('success', data.message);
      } else {
        showToast('error', data.error || '操作失败');
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      showToast('error', '操作失败,请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        transition-all duration-200
        ${
          isFavorited
            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
            : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <svg
        className={`w-5 h-5 transition-transform duration-200 ${
          isFavorited ? 'scale-110' : ''
        }`}
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {showLabel && (
        <span className="font-medium">{isFavorited ? '已收藏' : '收藏'}</span>
      )}
    </button>
  );
}
