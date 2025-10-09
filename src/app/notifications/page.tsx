'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { notificationApi, type Notification } from '@/lib/apiService';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // 未登录跳转
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载通知
  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session, filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications(
        1,
        50,
        filter === 'unread'
      );
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error('获取通知失败:', error);
      showToast('error', '获取通知失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 标记单个通知已读
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      showToast('error', '操作失败');
    }
  };

  // 全部标记已读
  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) {
      showToast('info', '没有未读通知');
      return;
    }

    try {
      await notificationApi.markMultipleAsRead(unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast('success', '已全部标记为已读');
    } catch (error) {
      showToast('error', '操作失败');
    }
  };

  // 删除通知
  const handleDelete = async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      showToast('success', '已删除');
    } catch (error) {
      showToast('error', '删除失败');
    }
  };

  // 处理通知点击
  const handleNotificationClick = (notification: Notification) => {
    // 标记为已读
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // 根据通知类型跳转
    try {
      const data = notification.data ? JSON.parse(notification.data) : null;

      if (data) {
        if (notification.type === 'LIKE' || notification.type === 'COMMENT') {
          // 跳转到照片(TODO: 需要获取照片所属专辑)
          if (data.photoId) {
            showToast('info', '照片详情页功能开发中');
          }
        } else if (notification.type === 'FOLLOW') {
          // 跳转到用户主页
          if (data.username) {
            router.push(`/photographer/${data.username}`);
          }
        }
      }
    } catch (error) {
      console.error('解析通知数据失败:', error);
    }
  };

  // 获取通知图标
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return (
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        );
      case 'COMMENT':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'FOLLOW':
        return (
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <Container>
        <div className="py-20 text-center">
          <p className="text-warm-gray">加载中...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold text-charcoal mb-4">
            通知中心
          </h1>

          {/* Filter Tabs */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-charcoal text-white'
                  : 'bg-warm-beige text-warm-gray hover:bg-warm-beige/70'
              }`}
            >
              全部 ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-charcoal text-white'
                  : 'bg-warm-beige text-warm-gray hover:bg-warm-beige/70'
              }`}
            >
              未读 ({unreadCount})
            </button>

            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={handleMarkAllAsRead}>
                全部标记已读
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray">
              {filter === 'unread' ? '没有未读通知' : '暂无通知'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  p-4 rounded-lg transition-all cursor-pointer
                  ${
                    notification.read
                      ? 'bg-white/50 hover:bg-white/70'
                      : 'bg-amber-50 hover:bg-amber-100'
                  }
                `}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-warm-gray mb-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-light-gray">
                      {new Date(notification.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="text-xs text-blue-500 hover:text-blue-600"
                      >
                        标记已读
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="text-xs text-red-400 hover:text-red-500"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
