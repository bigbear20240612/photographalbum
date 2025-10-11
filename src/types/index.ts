// 用户类型
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  weiboUrl?: string;
  photographyTags?: string[];
  createdAt: Date;
}

// 专辑类型
export interface Album {
  id: string;
  userId: string;
  title: string;
  description?: string;
  coverPhotoUrl?: string;
  photoCount?: number;
  categoryTags?: string; // JSON string, not array
  createdAt: Date;
  updatedAt: Date;
  // 可选的关联数据（从 API include 返回）
  user?: Partial<User>;
  photos?: Photo[];
  _count?: {
    photos: number;
  };
}

// 照片类型
export interface Photo {
  id: string;
  albumId: string;
  userId: string;
  title?: string;
  description?: string;
  originalUrl: string;
  largeUrl: string;
  mediumUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  cameraModel?: string;
  lensModel?: string;
  iso?: number;
  aperture?: string;
  shutterSpeed?: string;
  focalLength?: string;
  shootDate?: Date;
  location?: string;
  categoryTag?: string;
  createdAt: Date;
}

// EXIF 数据类型
export interface ExifData {
  Make?: string;
  Model?: string;
  LensModel?: string;
  ISO?: number;
  FNumber?: string;
  ExposureTime?: string;
  FocalLength?: string;
  DateTimeOriginal?: string;
}
