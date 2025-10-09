'use client';

import { useState } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { AlbumCard } from '@/components/ui/Card';
import { mockAlbums, mockUsers } from '@/lib/mockData';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>('albums');

  // 模拟当前用户（实际应从session获取）
  const currentUser = mockUsers[0];
  const userAlbums = mockAlbums.filter(album => album.userId === currentUser.id);

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
                        photoCount={album.photoCount}
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
          <div className="text-center py-16">
            <p className="text-warm-gray">照片管理功能开发中...</p>
          </div>
        )}
      </Container>
    </div>
  );
}
