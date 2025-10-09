import { User, Album, Photo } from '@/types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john_photographer',
    displayName: '约翰·摄影师',
    avatarUrl: 'https://picsum.photos/seed/user1/200/200',
    bio: '专注于人像和风光摄影，用镜头记录生活中的美好瞬间。',
    location: '北京, 中国',
    websiteUrl: 'https://example.com',
    instagramUrl: 'https://instagram.com/john',
    photographyTags: ['人像', '风光', '街拍'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'jane_photos',
    displayName: '简·艺术摄影',
    avatarUrl: 'https://picsum.photos/seed/user2/200/200',
    bio: '自由摄影师，热爱捕捉自然光影的变化。',
    location: '上海, 中国',
    photographyTags: ['风光', '纪实', '胶片'],
    createdAt: new Date('2024-02-20'),
  },
];

// 模拟专辑数据
export const mockAlbums: Album[] = [
  {
    id: '1',
    userId: '1',
    title: '2024春日人像',
    description: '春天里的人像摄影作品集，记录温暖的阳光和生机勃勃的氛围。',
    coverPhotoUrl: 'https://picsum.photos/seed/album1/800/600',
    photoCount: 12,
    categoryTags: ['人像', '春天'],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: '2',
    userId: '1',
    title: '城市夜景',
    description: '城市夜晚的光影交织，展现现代都市的魅力。',
    coverPhotoUrl: 'https://picsum.photos/seed/album2/800/600',
    photoCount: 18,
    categoryTags: ['街拍', '夜景'],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-25'),
  },
  {
    id: '3',
    userId: '1',
    title: '自然风光',
    description: '山川湖海,壮丽的自然景观。',
    coverPhotoUrl: 'https://picsum.photos/seed/album3/800/600',
    photoCount: 24,
    categoryTags: ['风光'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-30'),
  },
  {
    id: '4',
    userId: '2',
    title: '胶片记忆',
    description: '用胶片相机记录的温暖时光。',
    coverPhotoUrl: 'https://picsum.photos/seed/album4/800/600',
    photoCount: 15,
    categoryTags: ['胶片', '纪实'],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-15'),
  },
];

// 模拟照片数据
export const mockPhotos: Photo[] = [
  // 专辑1的照片
  {
    id: '1',
    albumId: '1',
    userId: '1',
    title: '春日午后',
    description: '阳光透过树叶洒在脸上的温暖瞬间。',
    originalUrl: 'https://picsum.photos/seed/photo1/2000/1500',
    largeUrl: 'https://picsum.photos/seed/photo1/2000/1500',
    mediumUrl: 'https://picsum.photos/seed/photo1/1000/750',
    thumbnailUrl: 'https://picsum.photos/seed/photo1/300/225',
    width: 2000,
    height: 1500,
    cameraModel: 'Sony A7III',
    lensModel: '85mm f/1.8',
    iso: 400,
    aperture: 'f/2.0',
    shutterSpeed: '1/200s',
    focalLength: '85mm',
    location: '北京·朝阳公园',
    categoryTag: '人像',
    createdAt: new Date('2024-03-05'),
  },
  {
    id: '2',
    albumId: '1',
    userId: '1',
    title: '微笑瞬间',
    originalUrl: 'https://picsum.photos/seed/photo2/2000/2500',
    largeUrl: 'https://picsum.photos/seed/photo2/2000/2500',
    mediumUrl: 'https://picsum.photos/seed/photo2/1000/1250',
    thumbnailUrl: 'https://picsum.photos/seed/photo2/300/375',
    width: 2000,
    height: 2500,
    cameraModel: 'Sony A7III',
    lensModel: '85mm f/1.8',
    iso: 200,
    aperture: 'f/1.8',
    shutterSpeed: '1/500s',
    focalLength: '85mm',
    categoryTag: '人像',
    createdAt: new Date('2024-03-06'),
  },
  {
    id: '3',
    albumId: '1',
    userId: '1',
    originalUrl: 'https://picsum.photos/seed/photo3/2000/1333',
    largeUrl: 'https://picsum.photos/seed/photo3/2000/1333',
    mediumUrl: 'https://picsum.photos/seed/photo3/1000/666',
    thumbnailUrl: 'https://picsum.photos/seed/photo3/300/200',
    width: 2000,
    height: 1333,
    createdAt: new Date('2024-03-07'),
  },
  // 更多照片
  {
    id: '4',
    albumId: '2',
    userId: '1',
    title: '霓虹灯下',
    description: '城市的夜晚，霓虹灯映照着匆匆的行人。',
    originalUrl: 'https://picsum.photos/seed/photo4/2000/1500',
    largeUrl: 'https://picsum.photos/seed/photo4/2000/1500',
    mediumUrl: 'https://picsum.photos/seed/photo4/1000/750',
    thumbnailUrl: 'https://picsum.photos/seed/photo4/300/225',
    width: 2000,
    height: 1500,
    cameraModel: 'Sony A7III',
    iso: 1600,
    aperture: 'f/2.8',
    shutterSpeed: '1/60s',
    location: '北京·三里屯',
    categoryTag: '街拍',
    createdAt: new Date('2024-02-12'),
  },
  {
    id: '5',
    albumId: '2',
    userId: '1',
    originalUrl: 'https://picsum.photos/seed/photo5/2000/2000',
    largeUrl: 'https://picsum.photos/seed/photo5/2000/2000',
    mediumUrl: 'https://picsum.photos/seed/photo5/1000/1000',
    thumbnailUrl: 'https://picsum.photos/seed/photo5/300/300',
    width: 2000,
    height: 2000,
    createdAt: new Date('2024-02-13'),
  },
  {
    id: '6',
    albumId: '2',
    userId: '1',
    originalUrl: 'https://picsum.photos/seed/photo6/2000/1200',
    largeUrl: 'https://picsum.photos/seed/photo6/2000/1200',
    mediumUrl: 'https://picsum.photos/seed/photo6/1000/600',
    thumbnailUrl: 'https://picsum.photos/seed/photo6/300/180',
    width: 2000,
    height: 1200,
    createdAt: new Date('2024-02-14'),
  },
  // 专辑3的照片
  {
    id: '7',
    albumId: '3',
    userId: '1',
    title: '山巅日出',
    description: '清晨的第一缕阳光洒在雪山之巅。',
    originalUrl: 'https://picsum.photos/seed/photo7/2500/1667',
    largeUrl: 'https://picsum.photos/seed/photo7/2500/1667',
    mediumUrl: 'https://picsum.photos/seed/photo7/1000/667',
    thumbnailUrl: 'https://picsum.photos/seed/photo7/300/200',
    width: 2500,
    height: 1667,
    cameraModel: 'Canon EOS R5',
    lensModel: '24-70mm f/2.8',
    iso: 100,
    aperture: 'f/8.0',
    shutterSpeed: '1/250s',
    focalLength: '35mm',
    location: '四川·贡嘎雪山',
    categoryTag: '风光',
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '8',
    albumId: '3',
    userId: '1',
    originalUrl: 'https://picsum.photos/seed/photo8/2000/3000',
    largeUrl: 'https://picsum.photos/seed/photo8/2000/3000',
    mediumUrl: 'https://picsum.photos/seed/photo8/1000/1500',
    thumbnailUrl: 'https://picsum.photos/seed/photo8/300/450',
    width: 2000,
    height: 3000,
    createdAt: new Date('2024-01-23'),
  },
];

// 根据用户ID获取专辑
export function getAlbumsByUserId(userId: string): Album[] {
  return mockAlbums.filter((album) => album.userId === userId);
}

// 根据专辑ID获取照片
export function getPhotosByAlbumId(albumId: string): Photo[] {
  return mockPhotos.filter((photo) => photo.albumId === albumId);
}

// 根据用户名获取用户
export function getUserByUsername(username: string): User | undefined {
  return mockUsers.find((user) => user.username === username);
}

// 根据ID获取专辑
export function getAlbumById(albumId: string): Album | undefined {
  return mockAlbums.find((album) => album.id === albumId);
}
