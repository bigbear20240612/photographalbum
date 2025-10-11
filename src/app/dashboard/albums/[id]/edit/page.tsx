'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { albumApi } from '@/lib/apiService';
import type { Album } from '@/types';

const CATEGORIES = [
  '人像摄影',
  '风光摄影',
  '街拍摄影',
  '纪实摄影',
  '建筑摄影',
  '静物摄影',
  '野生动物',
  '运动摄影',
  '婚礼摄影',
  '美食摄影',
  '时尚摄影',
  '其他',
];

export default function EditAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 加载专辑数据
  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const response = await albumApi.getAlbumById(id);
        setAlbum(response.album);
        setFormData({
          title: response.album.title,
          description: response.album.description || '',
          category: response.album.categoryTags?.[0] || '',
        });
      } catch (error: any) {
        console.error('加载专辑失败:', error);
        toast.error('加载专辑失败');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlbum();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft-white pt-24 pb-16">
        <Container>
          <div className="text-center py-16">
            <p className="text-warm-gray">加载中...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-soft-white pt-24 pb-16">
        <Container>
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-charcoal mb-4">
              专辑不存在
            </h2>
            <Button variant="primary" onClick={() => router.push('/dashboard')}>
              返回工作台
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 调用真实的 API 更新专辑
      await albumApi.updateAlbum(id, {
        title: formData.title,
        description: formData.description || undefined,
        categoryTags: formData.category ? [formData.category] : [],
      });

      toast.success('专辑更新成功！');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('更新专辑失败:', error);
      toast.error(error.message || '更新专辑失败，请稍后重试');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      // 调用真实的 API 删除专辑
      await albumApi.deleteAlbum(id);

      toast.success('专辑删除成功！');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('删除专辑失败:', error);
      toast.error(error.message || '删除专辑失败，请稍后重试');
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
              编辑专辑
            </h1>
            <p className="text-warm-gray">更新专辑信息</p>
          </div>

          {/* 表单卡片 */}
          <div className="glass-light rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 专辑标题 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  专辑标题 <span className="text-terra-cotta">*</span>
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="例如：云南旅拍、城市夜景、人像作品集"
                  required
                />
              </div>

              {/* 专辑描述 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  专辑描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="描述这个专辑的主题、拍摄时间、地点或创作理念..."
                  className="w-full px-4 py-3 rounded-xl border border-border-light bg-white focus:border-terra-cotta focus:outline-none focus:ring-2 focus:ring-terra-cotta/20 transition-colors"
                />
              </div>

              {/* 专辑分类 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  专辑分类 <span className="text-terra-cotta">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border-light bg-white focus:border-terra-cotta focus:outline-none focus:ring-2 focus:ring-terra-cotta/20 transition-colors"
                >
                  <option value="">选择分类</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 按钮组 */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>

            {/* 危险区域 */}
            <div className="mt-8 pt-8 border-t border-border-light">
              <h3 className="text-lg font-semibold text-charcoal mb-4">
                危险操作
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-charcoal mb-1">删除专辑</p>
                    <p className="text-sm text-warm-gray">
                      删除后将无法恢复，专辑内的所有照片也会被删除
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-deep-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-light max-w-md w-full rounded-2xl p-6 animate-slideUp">
            <h3 className="text-xl font-semibold text-charcoal mb-4">
              确认删除专辑？
            </h3>
            <p className="text-warm-gray mb-6">
              此操作无法撤销。删除后，专辑 &quot;{album.title}&quot; 及其所有照片都将永久删除。
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
              >
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
