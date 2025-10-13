'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import { searchApi, type SearchResult } from '@/lib/apiService';
import { useToast } from '@/components/ui/Toast';

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = (searchParams.get('type') as 'all' | 'users' | 'albums' | 'photos') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // 执行搜索
  useEffect(() => {
    if (initialQuery && initialQuery.length >= 2) {
      performSearch(initialQuery, initialType);
    }
  }, [initialQuery, initialType]);

  const performSearch = async (searchQuery: string, searchType: typeof type) => {
    if (searchQuery.trim().length < 2) {
      showToast('error', '搜索关键词至少需要2个字符');
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchApi.search(searchQuery, searchType, 20);
      setResults(response);
    } catch (error) {
      showToast('error', '搜索失败,请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${type}`);
      performSearch(query, type);
    }
  };

  // 切换类型
  const handleTypeChange = (newType: typeof type) => {
    setType(newType);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
      performSearch(query, newType);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-12 md:pb-16">
      <Container>
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索用户、专辑或照片..."
              className="flex-1 px-4 py-3 rounded-lg border border-warm-gray/30 focus:border-terra-cotta focus:outline-none bg-white/80"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-terra-cotta text-white rounded-lg hover:bg-terra-cotta/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </form>

        {/* Type Tabs */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { value: 'all', label: '全部' },
            { value: 'users', label: '用户' },
            { value: 'albums', label: '专辑' },
            { value: 'photos', label: '照片' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTypeChange(tab.value as typeof type)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                type === tab.value
                  ? 'bg-charcoal text-white'
                  : 'bg-warm-beige text-warm-gray hover:bg-warm-beige/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-warm-gray">搜索中...</p>
          </div>
        ) : results ? (
          <div>
            <p className="text-sm text-warm-gray mb-6">
              找到 {results.totalResults} 个结果
            </p>

            {/* Users */}
            {results.results.users && results.results.users.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-charcoal mb-4">用户</h2>
                <div className="space-y-4">
                  {results.results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/photographer/${user.username}`}
                      className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center text-white font-medium">
                          {user.displayName?.[0] || user.username?.[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-charcoal">
                            {user.displayName || user.username}
                          </h3>
                          {user.bio && (
                            <p className="text-sm text-warm-gray line-clamp-1">{user.bio}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {results.results.albums && results.results.albums.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-charcoal mb-4">专辑</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.results.albums.map((album) => (
                    <Link
                      key={album.id}
                      href={`/photographer/${album.user.username}/album/${album.id}`}
                      className="group"
                    >
                      <div className="aspect-[4/3] bg-warm-beige rounded-lg overflow-hidden mb-3">
                        {album.coverPhotoId ? (
                          <img
                            src={`/api/photos/${album.coverPhotoId}`}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-warm-gray">
                            暂无封面
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-charcoal mb-1">{album.title}</h3>
                      <p className="text-sm text-warm-gray">
                        {album.user.displayName || album.user.username} · {album.photoCount ?? 0} 张照片
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {results.results.photos && results.results.photos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-charcoal mb-4">照片</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.results.photos.map((photo) => (
                    <div key={photo.id} className="group cursor-pointer">
                      <div className="aspect-square bg-warm-beige rounded-lg overflow-hidden mb-2">
                        <img
                          src={photo.thumbnailUrl}
                          alt={photo.title || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {photo.title && (
                        <p className="text-sm text-charcoal line-clamp-1">{photo.title}</p>
                      )}
                      <p className="text-xs text-warm-gray">
                        {photo.user.displayName || photo.user.username}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.totalResults === 0 && (
              <div className="text-center py-20">
                <p className="text-warm-gray">未找到相关结果</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-warm-gray">输入关键词开始搜索</p>
          </div>
        )}
      </Container>
    </div>
  );
}
