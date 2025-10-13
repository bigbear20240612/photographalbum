import Container from '@/components/layout/Container';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata = {
  title: '关于我们 - PhotoAlbum',
  description: '了解 PhotoAlbum - 画廊级摄影作品展示平台的愿景和使命',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* 页头 */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-4">
              关于 PhotoAlbum
            </h1>
            <p className="text-lg text-warm-gray">
              画廊级摄影作品展示平台
            </p>
          </div>

          {/* 使命愿景 */}
          <section className="mb-12 bg-warm-beige/30 rounded-2xl p-8 md:p-12">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-6">
              我们的使命
            </h2>
            <p className="text-lg text-warm-gray leading-relaxed mb-6">
              PhotoAlbum 致力于为摄影师提供一个专业、简洁、高品质的在线作品展示平台。我们相信每一张照片都值得被用心呈现，每一位摄影师都应该拥有属于自己的数字画廊。
            </p>
            <p className="text-lg text-warm-gray leading-relaxed">
              通过极简的设计语言和画廊级的展示效果，我们希望让作品成为舞台的主角，让摄影师的创作获得应有的关注和尊重。
            </p>
          </section>

          {/* 核心价值 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-8">
              核心价值
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-soft-white rounded-xl p-6 border border-border-light">
                <div className="w-12 h-12 rounded-xl bg-terra-cotta/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-terra-cotta"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  专业品质
                </h3>
                <p className="text-warm-gray">
                  高质量图片展示，无损压缩，保留每一个细节，让作品以最佳状态呈现。
                </p>
              </div>

              <div className="bg-soft-white rounded-xl p-6 border border-border-light">
                <div className="w-12 h-12 rounded-xl bg-desert-gold/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-desert-gold"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  极简设计
                </h3>
                <p className="text-warm-gray">
                  去除一切干扰元素，用最纯粹的方式展示作品，让摄影成为焦点。
                </p>
              </div>

              <div className="bg-soft-white rounded-xl p-6 border border-border-light">
                <div className="w-12 h-12 rounded-xl bg-savanna-green/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-savanna-green"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  摄影师优先
                </h3>
                <p className="text-warm-gray">
                  一切功能设计都以摄影师需求为出发点，提供最便捷的作品管理体验。
                </p>
              </div>

              <div className="bg-soft-white rounded-xl p-6 border border-border-light">
                <div className="w-12 h-12 rounded-xl bg-amber-gold/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-gold"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  个人品牌
                </h3>
                <p className="text-warm-gray">
                  独立的个人主页，专业的视觉呈现，帮助摄影师建立个人品牌形象。
                </p>
              </div>
            </div>
          </section>

          {/* 平台特色 */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-8">
              平台特色
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terra-cotta/10 flex items-center justify-center text-terra-cotta font-semibold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    画廊级展示体验
                  </h3>
                  <p className="text-warm-gray">
                    高分辨率图片展示，支持多种尺寸，确保在任何设备上都能完美呈现作品细节。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terra-cotta/10 flex items-center justify-center text-terra-cotta font-semibold">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    专业作品管理
                  </h3>
                  <p className="text-warm-gray">
                    按专辑组织作品，支持详细的 EXIF 信息展示，让每一张照片都有完整的故事。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terra-cotta/10 flex items-center justify-center text-terra-cotta font-semibold">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    独立个人主页
                  </h3>
                  <p className="text-warm-gray">
                    每位摄影师都有独立的个人主页，展示个人简介、作品集和联系方式。
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terra-cotta/10 flex items-center justify-center text-terra-cotta font-semibold">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-2">
                    发现优质作品
                  </h3>
                  <p className="text-warm-gray">
                    通过发现页浏览其他摄影师的优秀作品，获取灵感，交流创作心得。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-gradient-to-br from-terra-cotta/10 to-amber-gold/10 rounded-2xl p-8 md:p-12 border border-terra-cotta/20">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
              开始展示你的摄影作品
            </h2>
            <p className="text-lg text-warm-gray mb-8">
              加入 PhotoAlbum，让你的作品被更多人看见
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="large">
                  免费注册
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="secondary" size="large">
                  探索作品
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
