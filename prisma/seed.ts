import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 开始种子数据...")

  // ========================================
  // 1. 创建分类数据
  // ========================================
  console.log("📂 创建分类数据...")

  const categories = [
    {
      nameZh: "人像",
      nameEn: "Portrait",
      slug: "portrait",
      icon: "👤",
      sortOrder: 1,
    },
    {
      nameZh: "风光",
      nameEn: "Landscape",
      slug: "landscape",
      icon: "🏔️",
      sortOrder: 2,
    },
    {
      nameZh: "街拍",
      nameEn: "Street",
      slug: "street",
      icon: "🚶",
      sortOrder: 3,
    },
    {
      nameZh: "纪实",
      nameEn: "Documentary",
      slug: "documentary",
      icon: "📸",
      sortOrder: 4,
    },
    {
      nameZh: "静物",
      nameEn: "Still Life",
      slug: "still-life",
      icon: "🎨",
      sortOrder: 5,
    },
    {
      nameZh: "建筑",
      nameEn: "Architecture",
      slug: "architecture",
      icon: "🏛️",
      sortOrder: 6,
    },
    {
      nameZh: "野生动物",
      nameEn: "Wildlife",
      slug: "wildlife",
      icon: "🦁",
      sortOrder: 7,
    },
    {
      nameZh: "时尚",
      nameEn: "Fashion",
      slug: "fashion",
      icon: "👗",
      sortOrder: 8,
    },
    {
      nameZh: "商业",
      nameEn: "Commercial",
      slug: "commercial",
      icon: "💼",
      sortOrder: 9,
    },
    {
      nameZh: "婚礼",
      nameEn: "Wedding",
      slug: "wedding",
      icon: "💒",
      sortOrder: 10,
    },
    {
      nameZh: "黑白",
      nameEn: "Black & White",
      slug: "black-white",
      icon: "⚫",
      sortOrder: 11,
    },
    {
      nameZh: "胶片",
      nameEn: "Film",
      slug: "film",
      icon: "🎞️",
      sortOrder: 12,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log(`✅ 创建了 ${categories.length} 个分类`)

  // ========================================
  // 2. 创建测试用户（仅开发环境）
  // ========================================
  if (process.env.NODE_ENV === "development") {
    console.log("👤 创建测试用户...")

    // 测试用户1：普通摄影师
    const testUser1 = await prisma.user.upsert({
      where: { email: "photographer@example.com" },
      update: {},
      create: {
        email: "photographer@example.com",
        username: "photographer",
        passwordHash: await bcrypt.hash("Test123456!", 10),
        displayName: "专业摄影师",
        bio: "我是一名专业摄影师，擅长人像和风光摄影。欢迎浏览我的作品集。",
        location: "北京, 中国",
        websiteUrl: "https://example.com",
        instagramUrl: "https://instagram.com/photographer",
        photographyTags: JSON.stringify(["Portrait", "Landscape", "Street"]),
        status: "ACTIVE",
        emailVerified: true,
      },
    })

    console.log(`✅ 创建测试用户: ${testUser1.username} (${testUser1.email})`)

    // 测试用户2：业余摄影爱好者
    const testUser2 = await prisma.user.upsert({
      where: { email: "hobbyist@example.com" },
      update: {},
      create: {
        email: "hobbyist@example.com",
        username: "hobbyist",
        passwordHash: await bcrypt.hash("Test123456!", 10),
        displayName: "摄影爱好者",
        bio: "周末喜欢拍照，记录生活美好瞬间。",
        location: "上海, 中国",
        photographyTags: JSON.stringify(["Street", "Documentary"]),
        status: "ACTIVE",
        emailVerified: true,
      },
    })

    console.log(`✅ 创建测试用户: ${testUser2.username} (${testUser2.email})`)

    // ========================================
    // 3. 创建测试专辑（可选）
    // ========================================
    console.log("📸 创建测试专辑...")

    const album1 = await prisma.album.create({
      data: {
        userId: testUser1.id,
        title: "2024春日人像",
        description:
          "这是一组拍摄于2024年春天的人像作品，捕捉了春日午后的温暖光线。",
        categoryTags: JSON.stringify(["Portrait", "Spring"]),
        status: "PUBLISHED",
        sortOrder: 0,
        shootDate: new Date("2024-03-15"),
      },
    })

    const album2 = await prisma.album.create({
      data: {
        userId: testUser1.id,
        title: "城市街拍系列",
        description: "记录城市生活的点点滴滴，捕捉街头的动人瞬间。",
        categoryTags: JSON.stringify(["Street"]),
        status: "PUBLISHED",
        sortOrder: 1,
        shootDateRangeStart: new Date("2024-01-01"),
        shootDateRangeEnd: new Date("2024-03-31"),
      },
    })

    const album3 = await prisma.album.create({
      data: {
        userId: testUser2.id,
        title: "周末随拍",
        description: "周末外出拍摄的作品集合。",
        categoryTags: JSON.stringify(["Street", "Documentary"]),
        status: "DRAFT",
        sortOrder: 0,
      },
    })

    console.log(`✅ 创建了 3 个测试专辑`)

    // ========================================
    // 4. 创建测试照片（占位符）
    // ========================================
    console.log("🖼️ 创建测试照片占位符...")

    // 注意：这些是示例URL，实际使用时需要上传真实图片到Cloudinary
    const placeholderPhotos = [
      {
        albumId: album1.id,
        userId: testUser1.id,
        title: "午后阳光",
        description: "春日午后，阳光洒在脸上的温暖瞬间。",
        originalUrl: "https://via.placeholder.com/4000x3000",
        largeUrl: "https://via.placeholder.com/2000x1500",
        mediumUrl: "https://via.placeholder.com/1000x750",
        thumbnailUrl: "https://via.placeholder.com/300x225",
        width: 4000,
        height: 3000,
        fileSize: 5242880,
        mimeType: "image/jpeg",
        cameraModel: "Canon EOS 5D Mark IV",
        lensModel: "Canon EF 50mm f/1.4",
        iso: 400,
        aperture: "f/2.8",
        shutterSpeed: "1/200s",
        focalLength: "50mm",
        location: "北京朝阳公园",
        categoryTag: "Portrait",
        sortOrder: 0,
      },
      {
        albumId: album1.id,
        userId: testUser1.id,
        title: "侧面剪影",
        description: "逆光下的侧面剪影，展现人物的轮廓美。",
        originalUrl: "https://via.placeholder.com/3000x4000",
        largeUrl: "https://via.placeholder.com/1500x2000",
        mediumUrl: "https://via.placeholder.com/750x1000",
        thumbnailUrl: "https://via.placeholder.com/225x300",
        width: 3000,
        height: 4000,
        fileSize: 4194304,
        mimeType: "image/jpeg",
        cameraModel: "Canon EOS 5D Mark IV",
        lensModel: "Canon EF 85mm f/1.8",
        iso: 200,
        aperture: "f/1.8",
        shutterSpeed: "1/500s",
        focalLength: "85mm",
        location: "北京朝阳公园",
        categoryTag: "Portrait",
        sortOrder: 1,
      },
      {
        albumId: album2.id,
        userId: testUser1.id,
        title: "街头瞬间",
        description: "城市街头，行人匆匆而过的瞬间。",
        originalUrl: "https://via.placeholder.com/4000x2667",
        largeUrl: "https://via.placeholder.com/2000x1333",
        mediumUrl: "https://via.placeholder.com/1000x667",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        width: 4000,
        height: 2667,
        fileSize: 6291456,
        mimeType: "image/jpeg",
        cameraModel: "Sony A7III",
        lensModel: "Sony FE 35mm f/1.8",
        iso: 800,
        aperture: "f/2.8",
        shutterSpeed: "1/250s",
        focalLength: "35mm",
        location: "北京三里屯",
        categoryTag: "Street",
        sortOrder: 0,
      },
    ]

    for (const photoData of placeholderPhotos) {
      await prisma.photo.create({ data: photoData })
    }

    // 更新专辑的照片数量
    await prisma.album.update({
      where: { id: album1.id },
      data: { photoCount: 2, coverPhotoId: (await prisma.photo.findFirst({ where: { albumId: album1.id } }))?.id },
    })

    await prisma.album.update({
      where: { id: album2.id },
      data: { photoCount: 1, coverPhotoId: (await prisma.photo.findFirst({ where: { albumId: album2.id } }))?.id },
    })

    console.log(`✅ 创建了 ${placeholderPhotos.length} 张测试照片`)

    console.log("\n" + "=".repeat(50))
    console.log("🎉 种子数据完成！")
    console.log("=".repeat(50))
    console.log("\n测试账户：")
    console.log("1. 专业摄影师")
    console.log("   邮箱: photographer@example.com")
    console.log("   密码: Test123456!")
    console.log("\n2. 业余爱好者")
    console.log("   邮箱: hobbyist@example.com")
    console.log("   密码: Test123456!")
    console.log("\n请使用这些账户登录测试系统功能。")
    console.log("=".repeat(50) + "\n")
  } else {
    console.log("⚠️ 生产环境，跳过创建测试用户")
  }

  console.log("\n✅ 种子数据脚本执行完成！")
}

main()
  .catch((e) => {
    console.error("❌ 种子数据失败:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
