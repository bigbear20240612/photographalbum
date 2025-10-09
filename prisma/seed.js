const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据导入...');

  // 清空现有数据（可选，用于开发环境）
  console.log('清空现有数据...');
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // 创建分类数据
  console.log('创建分类数据...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        nameZh: '人像',
        nameEn: 'Portrait',
        slug: 'portrait',
        icon: '👤',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '风光',
        nameEn: 'Landscape',
        slug: 'landscape',
        icon: '🏔️',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '街拍',
        nameEn: 'Street',
        slug: 'street',
        icon: '🏙️',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '建筑',
        nameEn: 'Architecture',
        slug: 'architecture',
        icon: '🏛️',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '动物',
        nameEn: 'Wildlife',
        slug: 'wildlife',
        icon: '🦁',
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '美食',
        nameEn: 'Food',
        slug: 'food',
        icon: '🍽️',
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '静物',
        nameEn: 'Still Life',
        slug: 'still-life',
        icon: '🌺',
        sortOrder: 7,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '抽象',
        nameEn: 'Abstract',
        slug: 'abstract',
        icon: '🎨',
        sortOrder: 8,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '黑白',
        nameEn: 'Black & White',
        slug: 'black-white',
        icon: '⚫',
        sortOrder: 9,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '微距',
        nameEn: 'Macro',
        slug: 'macro',
        icon: '🔍',
        sortOrder: 10,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '夜景',
        nameEn: 'Night',
        slug: 'night',
        icon: '🌃',
        sortOrder: 11,
      },
    }),
    prisma.category.create({
      data: {
        nameZh: '婚礼',
        nameEn: 'Wedding',
        slug: 'wedding',
        icon: '💒',
        sortOrder: 12,
      },
    }),
  ]);

  console.log(`✅ 已创建 ${categories.length} 个分类`);

  // 创建测试用户
  console.log('创建测试用户...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'john_photographer',
      passwordHash,
      displayName: 'John Doe',
      bio: '专业人像和风光摄影师，热爱用镜头捕捉生活中的美好瞬间。',
      location: '北京',
      websiteUrl: 'https://johndoe.com',
      instagramUrl: 'https://instagram.com/johndoe',
      photographyTags: JSON.stringify(['人像', '风光', '街拍']),
      emailVerified: true,
      status: 'ACTIVE',
      role: 'ADMIN', // 设置为管理员
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'jane_photos',
      passwordHash,
      displayName: 'Jane Smith',
      bio: '自由摄影师，擅长捕捉自然之美。',
      location: '上海',
      photographyTags: JSON.stringify(['风光', '动物', '微距']),
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log(`✅ 已创建 2 个测试用户`);

  // 创建测试专辑
  console.log('创建测试专辑...');

  const album1 = await prisma.album.create({
    data: {
      userId: user1.id,
      title: '2024春日人像',
      description: '在温暖的春日拍摄的一组人像作品，捕捉自然光下的美好瞬间。',
      categoryTags: JSON.stringify(['人像', '春天']),
      photoCount: 12,
      sortOrder: 1,
      status: 'PUBLISHED',
      shootDate: new Date('2024-04-15'),
    },
  });

  const album2 = await prisma.album.create({
    data: {
      userId: user1.id,
      title: '城市夜景',
      description: '城市夜晚的光影交错，展现现代都市的魅力。',
      categoryTags: JSON.stringify(['夜景', '建筑']),
      photoCount: 18,
      sortOrder: 2,
      status: 'PUBLISHED',
      shootDate: new Date('2024-03-20'),
    },
  });

  const album3 = await prisma.album.create({
    data: {
      userId: user1.id,
      title: '自然风光',
      description: '大自然的壮丽景色，山川湖海的无尽美景。',
      categoryTags: JSON.stringify(['风光', '自然']),
      photoCount: 24,
      sortOrder: 3,
      status: 'PUBLISHED',
      shootDateRangeStart: new Date('2024-05-01'),
      shootDateRangeEnd: new Date('2024-05-07'),
    },
  });

  const album4 = await prisma.album.create({
    data: {
      userId: user2.id,
      title: '胶片记忆',
      description: '用胶片相机记录的日常瞬间，怀旧而温暖。',
      categoryTags: JSON.stringify(['街拍', '黑白']),
      photoCount: 15,
      sortOrder: 1,
      status: 'PUBLISHED',
      shootDate: new Date('2024-02-10'),
    },
  });

  const album5 = await prisma.album.create({
    data: {
      userId: user2.id,
      title: '花间微距',
      description: '细腻的微距摄影，展现花朵的细节之美。',
      categoryTags: JSON.stringify(['微距', '静物']),
      photoCount: 20,
      sortOrder: 2,
      status: 'PUBLISHED',
      shootDate: new Date('2024-06-05'),
    },
  });

  const album6 = await prisma.album.create({
    data: {
      userId: user1.id,
      title: '草稿专辑',
      description: '这是一个草稿专辑，尚未发布。',
      categoryTags: JSON.stringify(['测试']),
      photoCount: 0,
      sortOrder: 4,
      status: 'DRAFT',
    },
  });

  console.log(`✅ 已创建 6 个测试专辑`);

  // 创建测试照片（为每个专辑创建几张示例照片）
  console.log('创建测试照片...');

  const photos = [];

  // 为album1创建12张照片
  for (let i = 1; i <= 12; i++) {
    photos.push(
      await prisma.photo.create({
        data: {
          albumId: album1.id,
          userId: user1.id,
          title: `春日人像 ${i}`,
          description: `春日人像系列的第${i}张照片`,
          originalUrl: `https://picsum.photos/seed/portrait${i}/2400/1600`,
          largeUrl: `https://picsum.photos/seed/portrait${i}/1920/1280`,
          mediumUrl: `https://picsum.photos/seed/portrait${i}/1200/800`,
          thumbnailUrl: `https://picsum.photos/seed/portrait${i}/600/400`,
          width: 2400,
          height: 1600,
          fileSize: 3 * 1024 * 1024, // 3MB
          mimeType: 'image/jpeg',
          cameraModel: 'Canon EOS R5',
          lensModel: 'RF 85mm F1.2 L USM',
          iso: 100,
          aperture: 'f/1.2',
          shutterSpeed: '1/250',
          focalLength: '85mm',
          shootDate: new Date('2024-04-15'),
          location: '北京',
          categoryTag: '人像',
          sortOrder: i,
        },
      })
    );
  }

  // 为album2创建5张照片（示例）
  for (let i = 1; i <= 5; i++) {
    photos.push(
      await prisma.photo.create({
        data: {
          albumId: album2.id,
          userId: user1.id,
          title: `城市夜景 ${i}`,
          description: `城市夜景系列的第${i}张照片`,
          originalUrl: `https://picsum.photos/seed/night${i}/2400/1600`,
          largeUrl: `https://picsum.photos/seed/night${i}/1920/1280`,
          mediumUrl: `https://picsum.photos/seed/night${i}/1200/800`,
          thumbnailUrl: `https://picsum.photos/seed/night${i}/600/400`,
          width: 2400,
          height: 1600,
          fileSize: 4 * 1024 * 1024,
          mimeType: 'image/jpeg',
          cameraModel: 'Sony A7III',
          lensModel: 'FE 24-70mm F2.8 GM',
          iso: 3200,
          aperture: 'f/2.8',
          shutterSpeed: '1/60',
          focalLength: '35mm',
          shootDate: new Date('2024-03-20'),
          location: '上海',
          categoryTag: '夜景',
          sortOrder: i,
        },
      })
    );
  }

  // 设置album1的封面照片
  await prisma.album.update({
    where: { id: album1.id },
    data: { coverPhotoId: photos[0].id },
  });

  // 设置album2的封面照片
  await prisma.album.update({
    where: { id: album2.id },
    data: { coverPhotoId: photos[12].id },
  });

  console.log(`✅ 已创建 ${photos.length} 张测试照片`);

  console.log('\n========================================');
  console.log('✅ 种子数据导入完成！');
  console.log('========================================');
  console.log('\n测试账户信息：');
  console.log('1. Email: john@example.com');
  console.log('   Password: password123');
  console.log('   Username: john_photographer');
  console.log('\n2. Email: jane@example.com');
  console.log('   Password: password123');
  console.log('   Username: jane_photos');
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('种子数据导入失败：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
