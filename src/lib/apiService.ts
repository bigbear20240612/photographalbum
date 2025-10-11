import { get, post, put, del, uploadFormData } from './api';
import type { User, Album, Photo } from '@/types';

// ==================== 认证相关 ====================

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  // 用户注册
  register: (data: RegisterData) =>
    post<{ message: string; user: User }>('/auth/register', data),

  // 用户登录（使用NextAuth）
  signIn: (data: LoginData) =>
    post('/auth/signin', data),

  // 用户登出
  signOut: () =>
    post('/auth/signout'),
};

// ==================== 用户相关 ====================

export interface UpdateUserData {
  displayName?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  weiboUrl?: string;
  photographyTags?: string[];
}

export const userApi = {
  // 获取当前用户信息
  getCurrentUser: () =>
    get<{ user: User }>('/users/me'),

  // 更新用户资料
  updateProfile: (data: UpdateUserData) =>
    put<{ message: string; user: User }>('/users/me', data),

  // 获取用户公开信息
  getUserByUsername: (username: string) =>
    get<{ user: User }>(`/users/${username}`),
};

// ==================== 专辑相关 ====================

export interface CreateAlbumData {
  title: string;
  description?: string;
  categoryTags?: string; // JSON string, not array
  shootDate?: string;
  shootDateRangeStart?: string;
  shootDateRangeEnd?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface UpdateAlbumData extends Partial<CreateAlbumData> {
  sortOrder?: number;
  coverPhotoId?: string;
}

export interface GetAlbumsParams {
  username?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  page?: number;
  limit?: number;
}

export const albumApi = {
  // 获取专辑列表
  getAlbums: (params?: GetAlbumsParams) => {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return get<{
      albums: Album[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/albums${queryString}`);
  },

  // 创建专辑
  createAlbum: (data: CreateAlbumData) =>
    post<{ message: string; album: Album }>('/albums', data),

  // 获取专辑详情
  getAlbumById: (id: string) =>
    get<{ album: Album }>(`/albums/${id}`),

  // 更新专辑
  updateAlbum: (id: string, data: UpdateAlbumData) =>
    put<{ message: string; album: Album }>(`/albums/${id}`, data),

  // 删除专辑
  deleteAlbum: (id: string) =>
    del<{ message: string }>(`/albums/${id}`),
};

// ==================== 照片相关 ====================

export interface PhotoMetadata {
  title?: string;
  description?: string;
  cameraModel?: string;
  lensModel?: string;
  iso?: string;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  shootDate?: string;
  location?: string;
  categoryTag?: string;
}

export interface UploadPhotosData {
  albumId: string;
  files: File[];
  metadata: PhotoMetadata[];
}

export interface UpdatePhotoData {
  title?: string;
  description?: string;
  cameraModel?: string;
  lensModel?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  shootDate?: string;
  location?: string;
  categoryTag?: string;
  sortOrder?: number;
}

export const photoApi = {
  // 批量上传照片
  uploadPhotos: (data: UploadPhotosData) => {
    const formData = new FormData();
    formData.append('albumId', data.albumId);

    // 添加文件
    data.files.forEach((file) => {
      formData.append('files', file);
    });

    // 添加元数据
    data.metadata.forEach((meta, index) => {
      formData.append(`metadata_${index}`, JSON.stringify(meta));
    });

    return uploadFormData<{
      message: string;
      results: Array<{
        success: boolean;
        photo?: Photo;
        error?: string;
      }>;
    }>('/photos/upload', formData);
  },

  // 获取照片详情
  getPhotoById: (id: string) =>
    get<{ photo: Photo }>(`/photos/${id}`),

  // 更新照片信息
  updatePhoto: (id: string, data: UpdatePhotoData) =>
    put<{ message: string; photo: Photo }>(`/photos/${id}`, data),

  // 删除照片
  deletePhoto: (id: string) =>
    del<{ message: string }>(`/photos/${id}`),
};

// ==================== 分类相关 ====================

export const categoryApi = {
  // 获取所有分类
  getCategories: () =>
    get<{ categories: any[] }>('/categories'),
};

// ==================== 社交功能相关 ====================

// 点赞相关
export interface LikeResponse {
  message: string;
  like?: any;
  likeCount: number;
}

export interface LikeStatusResponse {
  likeCount: number;
  isLiked: boolean;
}

export const likeApi = {
  // 点赞照片
  likePhoto: (photoId: string) =>
    post<LikeResponse>(`/photos/${photoId}/like`),

  // 取消点赞
  unlikePhoto: (photoId: string) =>
    del<LikeResponse>(`/photos/${photoId}/like`),

  // 获取点赞状态
  getLikeStatus: (photoId: string) =>
    get<LikeStatusResponse>(`/photos/${photoId}/like`),
};

// 评论相关
export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  replies?: Comment[];
}

export interface CommentData {
  content: string;
  parentId?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

export const commentApi = {
  // 获取评论列表
  getComments: (photoId: string) =>
    get<CommentsResponse>(`/photos/${photoId}/comments`),

  // 发表评论
  createComment: (photoId: string, data: CommentData) =>
    post<{ message: string; comment: Comment }>(`/photos/${photoId}/comments`, data),

  // 更新评论
  updateComment: (commentId: string, content: string) =>
    put<{ message: string; comment: Comment }>(`/comments/${commentId}`, { content }),

  // 删除评论
  deleteComment: (commentId: string) =>
    del<{ message: string }>(`/comments/${commentId}`),
};

// 关注相关
export interface FollowResponse {
  message: string;
  follow?: any;
  followerCount: number;
  followingCount: number;
}

export interface FollowStatusResponse {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface FollowerUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
}

export interface FollowersResponse {
  followers: FollowerUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FollowingResponse {
  following: FollowerUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const followApi = {
  // 关注用户
  followUser: (userId: string) =>
    post<FollowResponse>(`/users/${userId}/follow`),

  // 取消关注
  unfollowUser: (userId: string) =>
    del<FollowResponse>(`/users/${userId}/follow`),

  // 获取关注状态
  getFollowStatus: (userId: string) =>
    get<FollowStatusResponse>(`/users/${userId}/follow`),

  // 获取关注者列表
  getFollowers: (userId: string, page = 1, limit = 20) =>
    get<FollowersResponse>(`/users/${userId}/followers?page=${page}&limit=${limit}`),

  // 获取关注列表
  getFollowing: (userId: string, page = 1, limit = 20) =>
    get<FollowingResponse>(`/users/${userId}/following?page=${page}&limit=${limit}`),
};

// 通知相关
export interface Notification {
  id: string;
  userId: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'SYSTEM';
  title: string;
  content: string;
  data?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const notificationApi = {
  // 获取通知列表
  getNotifications: (page = 1, limit = 20, unreadOnly = false) =>
    get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`),

  // 标记单个通知为已读
  markAsRead: (notificationId: string) =>
    put<{ message: string; notification: Notification }>(`/notifications/${notificationId}`),

  // 批量标记为已读
  markMultipleAsRead: (notificationIds: string[]) =>
    put<{ message: string; count: number }>('/notifications', { notificationIds }),

  // 删除单个通知
  deleteNotification: (notificationId: string) =>
    del<{ message: string }>(`/notifications/${notificationId}`),

  // 批量删除通知
  deleteMultipleNotifications: (notificationIds: string[]) =>
    del<{ message: string; count: number }>(`/notifications?ids=${notificationIds.join(',')}`),
};

// ==================== 搜索相关 ====================

export interface SearchResult {
  query: string;
  totalResults: number;
  results: {
    users?: Array<{
      id: string;
      username: string;
      displayName: string;
      avatarUrl?: string;
      bio?: string;
      location?: string;
    }>;
    albums?: Array<{
      id: string;
      title: string;
      description?: string;
      coverPhotoId?: string;
      photoCount: number;
      user: {
        id: string;
        username: string;
        displayName: string;
        avatarUrl?: string;
      };
    }>;
    photos?: Array<{
      id: string;
      title?: string;
      description?: string;
      thumbnailUrl: string;
      user: {
        id: string;
        username: string;
        displayName: string;
      };
      album: {
        id: string;
        title: string;
      };
    }>;
  };
}

export const searchApi = {
  // 全局搜索
  search: (query: string, type: 'all' | 'users' | 'albums' | 'photos' = 'all', limit = 10) =>
    get<SearchResult>(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`),
};

// ==================== 管理员相关 ====================

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  status: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    albums: number;
    photos: number;
    likes: number;
    comments: number;
    followers: number;
    following: number;
  };
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateUserByAdminData {
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  role?: 'USER' | 'ADMIN';
  emailVerified?: boolean;
}

export const adminApi = {
  // 获取用户列表
  getUsers: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    role?: string;
    search?: string;
  }) => {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return get<AdminUsersResponse>(`/admin/users${queryString}`);
  },

  // 获取单个用户详情
  getUserById: (id: string) =>
    get<AdminUser>(`/admin/users/${id}`),

  // 更新用户信息
  updateUser: (id: string, data: UpdateUserByAdminData) =>
    put<{ message: string; user: AdminUser }>(`/admin/users/${id}`, data),

  // 删除用户
  deleteUser: (id: string) =>
    del<{ message: string; deletedUser: { id: string; username: string } }>(`/admin/users/${id}`),

  // 获取专辑列表
  getAlbums: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return get<{
      albums: Array<Album & { user: any; _count: { photos: number } }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/admin/albums${queryString}`);
  },

  // 获取专辑详情
  getAlbumById: (id: string) =>
    get<Album & { user: any; photos: any[] }>(`/admin/albums/${id}`),

  // 更新专辑状态
  updateAlbum: (id: string, data: { status: 'DRAFT' | 'PUBLISHED' }) =>
    put<{ message: string; album: Album }>(`/admin/albums/${id}`, data),

  // 删除专辑
  deleteAlbum: (id: string) =>
    del<{ message: string; deletedAlbum: { id: string; title: string } }>(`/admin/albums/${id}`),

  // 获取照片列表
  getPhotos: (params?: {
    page?: number;
    limit?: number;
    albumId?: string;
    search?: string;
  }) => {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return get<{
      photos: Array<Photo & { user: any; album: any }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/admin/photos${queryString}`);
  },

  // 获取照片详情
  getPhotoById: (id: string) =>
    get<Photo & { user: any; album: any; _count: { likes: number; comments: number } }>(`/admin/photos/${id}`),

  // 删除照片
  deletePhoto: (id: string) =>
    del<{ message: string; deletedPhoto: { id: string; title: string } }>(`/admin/photos/${id}`),

  // 获取统计数据
  getStats: () =>
    get<{
      overview: {
        users: {
          total: number;
          active: number;
          inactive: number;
          suspended: number;
        };
        albums: {
          total: number;
          published: number;
          draft: number;
        };
        photos: {
          total: number;
        };
        social: {
          likes: number;
          comments: number;
          follows: number;
        };
      };
      growth: {
        users: number;
        albums: number;
        photos: number;
      };
      recent: {
        users: any[];
        albums: any[];
        photos: any[];
      };
    }>('/admin/stats'),
};
