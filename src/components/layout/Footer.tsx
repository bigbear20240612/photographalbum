import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-warm-beige/50 border-t border-border-light py-8 mt-20 mb-16 md:mb-0">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <p className="text-sm text-warm-gray">
              © 2024 PhotoAlbum. 画廊级摄影作品展示平台
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-warm-gray hover:text-terra-cotta transition-colors"
            >
              关于我们
            </a>
            <a
              href="#"
              className="text-sm text-warm-gray hover:text-terra-cotta transition-colors"
            >
              使用条款
            </a>
            <a
              href="#"
              className="text-sm text-warm-gray hover:text-terra-cotta transition-colors"
            >
              隐私政策
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
