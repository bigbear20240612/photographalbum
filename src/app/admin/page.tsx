'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { adminApi } from '@/lib/apiService';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content'>('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getStats();
      setStats(response);
    } catch (error: any) {
      if (error.message?.includes('403') || error.message?.includes('权限不足')) {
        toast.error('您没有管理员权限');
        router.push('/');
      } else {
        toast.error('获取统计数据失败');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
              <p className="text-sm text-gray-600 mt-1">系统数据统计与管理</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              返回首页
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              数据概览
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              用户管理
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              内容管理
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} />
        )}
        {activeTab === 'users' && (
          <UsersTab stats={stats} router={router} />
        )}
        {activeTab === 'content' && (
          <ContentTab stats={stats} router={router} />
        )}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }: { stats: any }) {
  const { overview, growth, recent } = stats;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Users Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总用户数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{overview.users.total}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      +{growth.users} (30天)
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Albums Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总专辑数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{overview.albums.total}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      +{growth.albums} (30天)
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">总照片数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{overview.photos.total}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      +{growth.photos} (30天)
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">互动数据</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{overview.social.likes}</div>
                    <div className="text-xs text-gray-500">
                      {overview.social.comments} 评论 · {overview.social.follows} 关注
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近注册用户</h3>
            <ul className="space-y-3">
              {recent.users.map((user: any) => (
                <li key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.displayName || user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Albums */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近创建专辑</h3>
            <ul className="space-y-3">
              {recent.albums.map((album: any) => (
                <li key={album.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{album.title}</p>
                    <p className="text-xs text-gray-500">by {album.user.displayName || album.user.username}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    album.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {album.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Photos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近上传照片</h3>
            <ul className="space-y-3">
              {recent.photos.map((photo: any) => (
                <li key={photo.id} className="flex items-center space-x-3">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title || '照片'}
                    className="h-12 w-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {photo.title || '无标题'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      by {photo.user.displayName || photo.user.username}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ stats, router }: { stats: any; router: any }) {
  const { overview } = stats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">用户管理</h2>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">总用户</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{overview.users.total}</dd>
        </div>
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">活跃用户</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{overview.users.active}</dd>
        </div>
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">未激活</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600">{overview.users.inactive}</dd>
        </div>
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">已封禁</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">{overview.users.suspended}</dd>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 text-center">
          完整的用户管理功能正在开发中...
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          将包括用户搜索、状态管理、权限修改等功能
        </p>
      </div>
    </div>
  );
}

// Content Tab Component
function ContentTab({ stats, router }: { stats: any; router: any }) {
  const { overview } = stats;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">内容管理</h2>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">总专辑</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{overview.albums.total}</dd>
        </div>
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">已发布</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">{overview.albums.published}</dd>
        </div>
        <div className="bg-white px-4 py-5 shadow rounded-lg">
          <dt className="text-sm font-medium text-gray-500 truncate">草稿</dt>
          <dd className="mt-1 text-3xl font-semibold text-yellow-600">{overview.albums.draft}</dd>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 text-center">
          完整的内容管理功能正在开发中...
        </p>
        <p className="text-sm text-gray-500 text-center mt-2">
          将包括专辑审核、照片审核、批量管理等功能
        </p>
      </div>
    </div>
  );
}
