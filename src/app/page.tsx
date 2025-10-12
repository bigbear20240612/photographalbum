import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { AlbumCard } from '@/components/ui/Card';
import { mockAlbums, mockUsers } from '@/lib/mockData';

export default function HomePage() {
  const featuredAlbums = mockAlbums.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-soft-white to-warm-beige/30 py-20 md:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-semibold text-charcoal mb-6">
              画廊级的
              <span className="text-terra-cotta"> 摄影作品 </span>
              展示平台
            </h1>
            <p className="text-lg md:text-xl text-warm-gray mb-8 leading-relaxed">
              专为摄影师打造的在线作品集平台
              <br className="hidden md:block" />
              极简设计,突出作品,展现你的摄影艺术
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="large">
                  立即开始
                </Button>
              </Link>
              <Link href="/photographer/john_photographer">
                <Button variant="secondary" size="large">
                  查看示例
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-4">
              为什么选择 PhotoAlbum
            </h2>
            <p className="text-lg text-warm-gray">
              专业、简洁、高品质的作品展示体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - 画廊级展示 */}
            <Link href="/discover">
              <div className="text-center p-8 cursor-pointer transition-all duration-300 hover:bg-warm-beige/30 rounded-2xl hover:shadow-glass-md hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-terra-cotta to-amber-gold flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  画廊级展示
                </h3>
                <p className="text-warm-gray">
                  高质量图片展示,无压缩损失,保留作品细节
                </p>
              </div>
            </Link>

            {/* Feature 2 - 专辑管理 */}
            <Link href="/dashboard">
              <div className="text-center p-8 cursor-pointer transition-all duration-300 hover:bg-warm-beige/30 rounded-2xl hover:shadow-glass-md hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-desert-gold to-sunset-orange flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  专辑管理
                </h3>
                <p className="text-warm-gray">
                  以专辑为单位组织作品,系统化展示你的创作
                </p>
              </div>
            </Link>

            {/* Feature 3 - 个人品牌 */}
            <Link href="/photographer/john_photographer">
              <div className="text-center p-8 cursor-pointer transition-all duration-300 hover:bg-warm-beige/30 rounded-2xl hover:shadow-glass-md hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-savanna-green to-earth-brown flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  个人品牌
                </h3>
                <p className="text-warm-gray">
                  独立的个人主页,专业的视觉呈现,提升品牌形象
                </p>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* Featured Albums Section */}
      <section className="py-16 md:py-24 bg-warm-beige/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-4">
              精选作品
            </h2>
            <p className="text-lg text-warm-gray">
              来自优秀摄影师的作品集
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAlbums.map((album) => {
              const user = mockUsers.find((u) => u.id === album.userId);
              return (
                <Link
                  key={album.id}
                  href={`/photographer/${user?.username}/album/${album.id}`}
                >
                  <AlbumCard
                    coverUrl={album.coverPhotoUrl || ''}
                    title={album.title}
                    photoCount={album.photoCount ?? 0}
                  />
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/discover">
              <Button variant="secondary" size="large">
                探索更多作品
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-terra-cotta/10 to-amber-gold/10 rounded-3xl p-12 border border-terra-cotta/20">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-charcoal mb-4">
              开始展示你的摄影作品
            </h2>
            <p className="text-lg text-warm-gray mb-8">
              加入我们,创建属于你的在线摄影作品集
            </p>
            <Link href="/register">
              <Button variant="primary" size="large">
                免费注册
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
