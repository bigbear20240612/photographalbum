import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';
import { SessionProvider } from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'PhotoAlbum - 画廊级摄影作品展示平台',
  description: '专为摄影师打造的画廊级作品展示平台,让摄影作品以最佳的视觉效果呈现',
  keywords: ['摄影', '作品集', '摄影师', '画廊', '展示平台'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <SessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
