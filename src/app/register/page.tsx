'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { authApi } from '@/lib/apiService';
import { ApiError } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // 验证
    const newErrors: Record<string, string> = {};

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符';
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名最多20个字符';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    if (!formData.email) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 调用注册API
      const response = await authApi.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        displayName: formData.displayName || formData.username,
      });

      showToast('success', response.message || '注册成功！');

      // 注册成功后跳转到登录页
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      if (error instanceof ApiError) {
        showToast('error', error.message);
        // 根据错误信息设置表单错误
        if (error.message.includes('邮箱')) {
          setErrors({ email: error.message });
        } else if (error.message.includes('用户名')) {
          setErrors({ username: error.message });
        }
      } else {
        showToast('error', '注册失败，请稍后重试');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-semibold text-charcoal mb-2">
                加入 PhotoAlbum
              </h1>
              <p className="text-warm-gray">创建账号开始展示你的作品</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="用户名"
                type="text"
                placeholder="3-20个字符，字母数字下划线"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                error={errors.username}
                helperText="用户名将作为你的个人主页网址"
                disabled={isLoading}
              />

              <Input
                label="邮箱地址"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                disabled={isLoading}
              />

              <Input
                label="显示名称（可选）"
                type="text"
                placeholder="你的昵称"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                helperText="留空则使用用户名"
                disabled={isLoading}
              />

              <Input
                label="密码"
                type="password"
                placeholder="至少6个字符"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                disabled={isLoading}
              />

              <Input
                label="确认密码"
                type="password"
                placeholder="再次输入密码"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
                disabled={isLoading}
              />

              <div className="text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 w-4 h-4 rounded border-border-light text-terra-cotta focus:ring-terra-cotta"
                  />
                  <span className="text-warm-gray">
                    我已阅读并同意{' '}
                    <Link
                      href="/terms"
                      className="text-terra-cotta hover:text-amber-gold"
                    >
                      服务条款
                    </Link>{' '}
                    和{' '}
                    <Link
                      href="/privacy"
                      className="text-terra-cotta hover:text-amber-gold"
                    >
                      隐私政策
                    </Link>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-warm-gray">
                已有账号?{' '}
                <Link
                  href="/login"
                  className="text-terra-cotta hover:text-amber-gold font-medium transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
