'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { userApi } from '@/lib/apiService';
import type { User } from '@/types';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    websiteUrl: '',
    instagramUrl: '',
    weiboUrl: '',
  });

  // 检查登录状态
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 加载用户信息
  useEffect(() => {
    if (status === 'authenticated') {
      loadUserData();
    }
  }, [status]);

  const loadUserData = async () => {
    try {
      const response = await userApi.getCurrentUser();
      setUser(response.user);
      setFormData({
        displayName: response.user.displayName || '',
        bio: response.user.bio || '',
        location: response.user.location || '',
        websiteUrl: response.user.websiteUrl || '',
        instagramUrl: response.user.instagramUrl || '',
        weiboUrl: response.user.weiboUrl || '',
      });
    } catch (error: any) {
      console.error('加载用户信息失败:', error);
      toast.error('加载用户信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await userApi.updateProfile(formData);
      toast.success('设置保存成功！');
      await loadUserData(); // 重新加载用户信息
    } catch (error: any) {
      console.error('保存设置失败:', error);
      toast.error(error.message || '保存设置失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-soft-white pt-24 pb-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">
              账户设置
            </h1>
            <p className="text-warm-gray">
              管理你的个人信息和社交链接
            </p>
          </div>

          {/* 表单卡片 */}
          <div className="glass-light rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 用户名（只读） */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  用户名
                </label>
                <Input
                  type="text"
                  value={user.username}
                  disabled
                  className="bg-warm-beige/30"
                />
                <p className="mt-1 text-xs text-warm-gray">
                  用户名不可修改
                </p>
              </div>

              {/* 邮箱（只读） */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  邮箱
                </label>
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-warm-beige/30"
                />
                <p className="mt-1 text-xs text-warm-gray">
                  邮箱不可修改
                </p>
              </div>

              {/* 显示名称 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  显示名称
                </label>
                <Input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="你的显示名称"
                />
              </div>

              {/* 个人简介 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  个人简介
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="介绍一下你自己..."
                  className="w-full px-4 py-3 rounded-xl border border-border-light bg-white focus:border-terra-cotta focus:outline-none focus:ring-2 focus:ring-terra-cotta/20 transition-colors"
                />
              </div>

              {/* 所在地 */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  所在地
                </label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="例如：北京, 中国"
                />
              </div>

              {/* 社交链接 */}
              <div className="pt-4 border-t border-border-light">
                <h3 className="text-lg font-semibold text-charcoal mb-4">
                  社交链接
                </h3>

                <div className="space-y-4">
                  {/* 个人网站 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      个人网站
                    </label>
                    <Input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Instagram
                    </label>
                    <Input
                      type="url"
                      name="instagramUrl"
                      value={formData.instagramUrl}
                      onChange={handleChange}
                      placeholder="https://instagram.com/username"
                    />
                  </div>

                  {/* 微博 */}
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      微博
                    </label>
                    <Input
                      type="url"
                      name="weiboUrl"
                      value={formData.weiboUrl}
                      onChange={handleChange}
                      placeholder="https://weibo.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* 按钮组 */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
