// API请求工具函数

// 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用请求函数
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // 如果是204 No Content，直接返回
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Request failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// GET请求
export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'GET' });
}

// POST请求
export async function post<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT请求
export async function put<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  return request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE请求
export async function del<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}

// FormData请求（用于文件上传）
export async function uploadFormData<T>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    method: 'POST',
    body: formData,
    // 不设置Content-Type，让浏览器自动设置multipart/form-data边界
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.error || 'Upload failed',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Upload error',
      0
    );
  }
}

// API响应类型定义
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
