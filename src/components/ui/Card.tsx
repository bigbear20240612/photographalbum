import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'warm';
  children: React.ReactNode;
}

export function Card({ variant = 'light', className, children, ...props }: CardProps) {
  const variants = {
    light: 'bg-soft-white/75 border-border-light/40',
    dark: 'bg-deep-charcoal/60 border-white/10',
    warm: 'bg-warm-beige/80 border-terra-cotta/20',
  };

  return (
    <div
      className={cn(
        'backdrop-blur-xl backdrop-saturate-150',
        'rounded-2xl border',
        'shadow-glass-md',
        'transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface AlbumCardProps {
  coverUrl: string;
  title: string;
  photoCount: number;
  onClick?: () => void;
  className?: string;
}

export function AlbumCard({ coverUrl, title, photoCount, onClick, className }: AlbumCardProps) {
  // 如果没有封面，使用占位图
  const displayCoverUrl = coverUrl || '/images/placeholder-album.jpg';

  return (
    <div
      className={cn(
        'card group cursor-pointer',
        'bg-white shadow-glass-sm',
        'hover:translate-y-[-8px] hover:shadow-glass-lg',
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-warm-beige/30">
        {coverUrl ? (
          <img
            src={displayCoverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            onError={(e) => {
              // 图片加载失败时显示占位内容
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          // 没有封面时显示占位内容
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-beige/50 to-terra-cotta/20">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-warm-gray/40 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-warm-gray/60">暂无照片</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/80 via-deep-charcoal/20 to-transparent backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-medium text-white mb-1">{title}</h3>
            <p className="text-sm text-white/80">{photoCount} 张</p>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="btn bg-white/90 text-terra-cotta px-6 py-2 rounded-full shadow-lg backdrop-blur-sm">
            查看专辑
          </div>
        </div>
      </div>
    </div>
  );
}

interface PhotoCardProps {
  photoUrl: string;
  title?: string;
  onClick?: () => void;
  className?: string;
}

export function PhotoCard({ photoUrl, title, onClick, className }: PhotoCardProps) {
  return (
    <div
      className={cn(
        'card group cursor-pointer',
        'bg-white shadow-glass-sm',
        'hover:shadow-glass-md',
        className
      )}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={photoUrl}
          alt={title || 'Photo'}
          className="w-full h-auto block transition-transform duration-300 group-hover:scale-105"
        />
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-warm-beige/90 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-medium text-charcoal">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
