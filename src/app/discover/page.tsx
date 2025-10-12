'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import AlbumGrid from '@/components/features/AlbumGrid';
import { albumApi, categoryApi } from '@/lib/apiService';
import type { Album } from '@/types';

export default function DiscoverPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // 加载分类和专辑
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 获取分类
        const categoriesResponse = await categoryApi.getCategories();
        setCategories(categoriesResponse.categories);

        // 获取专辑
        const albumsResponse = await albumApi.getAlbums({
          status: 'PUBLISHED',
          page: 1,
          limit: 50,
        });
        setAlbums(albumsResponse.albums);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 筛选专辑
  const filteredAlbums = albums.filter((album) => {
    if (selectedCategory === 'all') return true;

    // 检查专辑的分类标签
    try {
      const tags = typeof album.categoryTags === 'string'
        ? JSON.parse(album.categoryTags)
        : album.categoryTags;

      return tags && tags.includes(selectedCategory);
    } catch {
      return false;
    }
  });

  // 排序专辑
  const sortedAlbums = [...filteredAlbums].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // 按热度排序(照片数量)
      return (b.photoCount ?? 0) - (a.photoCount ?? 0);
    }
  });

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
            发现作品
          </h1>
          <p className="text-warm-gray">
            浏览来自优秀摄影师的精彩作品集
          </p>
        </div>

        {/* 筛选选项 */}
        <div className="mb-8 space-y-4">
          {/* 排序选项 */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-charcoal">排序：</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-charcoal text-white'
                    : 'bg-warm-beige text-warm-gray hover:bg-warm-beige/70'
                }`}
              >
                最新发布
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-charcoal text-white'
                    : 'bg-warm-beige text-warm-gray hover:bg-warm-beige/70'
                }`}
              >
                最受欢迎
              </button>
            </div>
          </div>

          {/* 分类筛选 */}
          <div>
            <span className="text-sm font-medium text-charcoal mb-3 block">分类：</span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-terra-cotta to-amber-gold text-white'
                    : 'bg-warm-beige/50 text-warm-gray hover:bg-warm-beige hover:text-terra-cotta'
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.nameZh)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.nameZh
                      ? 'bg-gradient-to-r from-terra-cotta to-amber-gold text-white'
                      : 'bg-warm-beige/50 text-warm-gray hover:bg-warm-beige hover:text-terra-cotta'
                  }`}
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.nameZh}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-4 text-sm text-warm-gray">
          共 {sortedAlbums.length} 个专辑
        </div>

        {/* 专辑网格 */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-warm-gray">加载中...</p>
          </div>
        ) : sortedAlbums.length > 0 ? (
          <AlbumGrid
            albums={sortedAlbums}
            onAlbumClick={(album) => {
              // 需要找到专辑作者的username
              const username = (album as any).user?.username;
              if (username) {
                router.push(`/photographer/${username}/album/${(album as any).id}`);
              }
            }}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-warm-gray">暂无符合条件的专辑</p>
          </div>
        )}
      </Container>
    </div>
  );
}
