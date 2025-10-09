'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Container from '@/components/layout/Container';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // 验证
    const newErrors: Record<string, string> = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 使用 NextAuth 登录
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // 登录失败
        showToast('error', result.error);
        if (result.error.includes('邮箱')) {
          setErrors({ email: result.error });
        } else if (result.error.includes('密码')) {
          setErrors({ password: result.error });
        }
        setIsLoading(false);
      } else if (result?.ok) {
        // 登录成功
        showToast('success', '登录成功！');

        // 跳转到用户仪表板
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // 刷新以获取最新会话状态
        }, 1000);
      }
    } catch (error) {
      showToast('error', '登录失败，请稍后重试');
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
                欢迎回来
              </h1>
              <p className="text-warm-gray">登录你的账号继续使用</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                label="密码"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                disabled={isLoading}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border-light text-terra-cotta focus:ring-terra-cotta"
                  />
                  <span className="text-warm-gray">记住我</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-terra-cotta hover:text-amber-gold transition-colors"
                >
                  忘记密码?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-warm-gray">
                还没有账号?{' '}
                <Link
                  href="/register"
                  className="text-terra-cotta hover:text-amber-gold font-medium transition-colors"
                >
                  立即注册
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
