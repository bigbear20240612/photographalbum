'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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

export default function CreateAlbumPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟API请求
    setTimeout(() => {
      console.log('创建专辑:', formData);
      alert('专辑创建成功！（这是模拟功能，实际需要连接后端API）');
      router.push('/dashboard');
    }, 1000);
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
              创建新专辑
            </h1>
            <p className="text-warm-gray">
              填写专辑信息，开始上传你的作品
            </p>
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
                <p className="mt-1 text-sm text-warm-gray">
                  为你的专辑起一个吸引人的名字
                </p>
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
                <p className="mt-1 text-sm text-warm-gray">
                  让观众了解你的创作背景和想法
                </p>
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
                <p className="mt-1 text-sm text-warm-gray">
                  帮助用户更容易找到你的作品
                </p>
              </div>

              {/* 提示信息 */}
              <div className="bg-warm-beige/30 rounded-xl p-4">
                <div className="flex gap-3">
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
                    className="text-desert-gold flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div className="text-sm text-warm-gray">
                    <p className="font-medium text-charcoal mb-1">提示</p>
                    <p>创建专辑后，你可以立即上传照片。专辑创建后仍可以编辑标题和描述。</p>
                  </div>
                </div>
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
                  {isSubmitting ? '创建中...' : '创建专辑'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
