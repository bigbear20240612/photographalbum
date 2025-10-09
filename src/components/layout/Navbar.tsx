'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Container from './Container';
import Button from '../ui/Button';
import { useToast } from '../ui/Toast';
import { notificationApi } from '@/lib/apiService';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const isAuthenticated = status === 'authenticated';

  // 获取未读通知数量
  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnreadCount = async () => {
        try {
          const response = await notificationApi.getNotifications(1, 1, false);
          setUnreadCount(response.unreadCount);
        } catch (error) {
          console.error('获取未读通知数量失败:', error);
        }
      };

      fetchUnreadCount();

      // 每30秒更新一次
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      showToast('success', '已成功登出');
      setShowUserMenu(false);
    } catch (error) {
      showToast('error', '登出失败，请重试');
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'hidden md:block',
          isScrolled
            ? 'bg-soft-white/90 backdrop-blur-xl backdrop-saturate-[180%] border-b border-border-light/30 shadow-glass-md'
            : 'bg-white/70 backdrop-blur-lg backdrop-saturate-[180%] border-b border-border-light/30 shadow-glass-sm'
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="font-serif text-2xl font-semibold text-terra-cotta">
                PhotoAlbum
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-base font-medium text-warm-gray hover:text-terra-cotta transition-colors"
              >
                首页
              </Link>
              <Link
                href="/discover"
                className="text-base font-medium text-warm-gray hover:text-terra-cotta transition-colors"
              >
                发现
              </Link>
              <Link
                href="/search"
                className="text-base font-medium text-warm-gray hover:text-terra-cotta transition-colors"
              >
                搜索
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="text-base font-medium text-warm-gray hover:text-terra-cotta transition-colors"
                >
                  工作台
                </Link>
              )}
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-lg hover:bg-soft-white/50 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-warm-gray hover:text-terra-cotta transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-soft-white/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center text-white font-medium">
                      {session?.user?.displayName?.[0]?.toUpperCase() ||
                       session?.user?.username?.[0]?.toUpperCase() ||
                       'U'}
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      {session?.user?.displayName || session?.user?.username}
                    </span>
                    <svg
                      className={cn(
                        'w-4 h-4 text-warm-gray transition-transform',
                        showUserMenu && 'rotate-180'
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white/95 backdrop-blur-xl border border-border-light shadow-glass-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-border-light">
                        <p className="text-sm font-medium text-charcoal">
                          {session?.user?.displayName || session?.user?.username}
                        </p>
                        <p className="text-xs text-warm-gray">
                          {session?.user?.email}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-warm-gray hover:bg-soft-white/50 hover:text-terra-cotta transition-colors"
                        >
                          工作台
                        </Link>
                        {(session?.user as any)?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium"
                          >
                            管理后台
                          </Link>
                        )}
                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-warm-gray hover:bg-soft-white/50 hover:text-terra-cotta transition-colors"
                        >
                          设置
                        </Link>
                        <Link
                          href={`/photographer/${session?.user?.username}`}
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-warm-gray hover:bg-soft-white/50 hover:text-terra-cotta transition-colors"
                        >
                          我的主页
                        </Link>
                      </div>
                      <div className="border-t border-border-light py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-warm-gray hover:bg-soft-white/50 hover:text-terra-cotta transition-colors"
                        >
                          登出
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="text" size="medium">
                      登录
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="medium">
                      注册
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile Navbar (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl backdrop-saturate-[180%] border-t border-border-light/30 shadow-[0_-2px_12px_rgba(139,111,71,0.08)] py-2">
        <div className="flex justify-around items-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-4 py-2 text-light-gray hover:text-terra-cotta transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs font-medium">首页</span>
          </Link>

          <Link
            href="/discover"
            className="flex flex-col items-center gap-1 px-4 py-2 text-light-gray hover:text-terra-cotta transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="text-xs font-medium">发现</span>
          </Link>

          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 px-4 py-2 text-light-gray hover:text-terra-cotta transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span className="text-xs font-medium">工作台</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center gap-1 px-4 py-2 text-light-gray hover:text-terra-cotta transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span className="text-xs font-medium">登录</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-18 hidden md:block" />
      <div className="h-16 md:hidden" />
    </>
  );
}
