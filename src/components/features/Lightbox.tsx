'use client';

import { useEffect, useState, useRef } from 'react';
import { Photo } from '@/types';
import { cn } from '@/lib/utils';
import LikeButton from '../ui/LikeButton';
import CommentSection from '../ui/CommentSection';

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentPhoto = photos[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < photos.length - 1;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (canGoPrev) setCurrentIndex((prev) => prev - 1);
          break;
        case 'ArrowRight':
          if (canGoNext) setCurrentIndex((prev) => prev + 1);
          break;
        case 'i':
        case 'I':
          setIsInfoOpen((prev) => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, canGoPrev, canGoNext]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-deep-charcoal/95 backdrop-blur-sm animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
        aria-label="Close"
      >
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
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Photo Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Info Toggle Button */}
      <button
        onClick={() => setIsInfoOpen(!isInfoOpen)}
        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
        aria-label="Toggle info"
      >
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
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      </button>

      {/* Main Image */}
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
        <img
          ref={imageRef}
          src={currentPhoto.largeUrl}
          alt={currentPhoto.title || 'Photo'}
          className="max-w-full max-h-full object-contain animate-zoomIn"
        />
      </div>

      {/* Previous Button */}
      {canGoPrev && (
        <button
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
          aria-label="Previous"
        >
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
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {canGoNext && (
        <button
          onClick={() => setCurrentIndex((prev) => prev + 1)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm"
          aria-label="Next"
        >
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
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Info Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-warm-beige/95 backdrop-blur-2xl overflow-y-auto transition-transform duration-400',
          'shadow-[-8px_0_32px_rgba(0,0,0,0.2)]',
          isInfoOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-warm-beige/95 backdrop-blur-sm border-b border-charcoal/10">
          <div className="flex">
            <button
              onClick={() => setShowComments(false)}
              className={cn(
                'flex-1 px-6 py-4 text-sm font-semibold transition-colors',
                !showComments
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-warm-gray hover:text-charcoal'
              )}
            >
              照片信息
            </button>
            <button
              onClick={() => setShowComments(true)}
              className={cn(
                'flex-1 px-6 py-4 text-sm font-semibold transition-colors',
                showComments
                  ? 'text-charcoal border-b-2 border-charcoal'
                  : 'text-warm-gray hover:text-charcoal'
              )}
            >
              评论
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {!showComments ? (
            <div className="space-y-6">
              {/* Like Button */}
              <div>
                <LikeButton photoId={currentPhoto.id} />
              </div>

              {/* Title */}
              {currentPhoto.title && (
                <div>
                  <h3 className="text-2xl font-semibold text-charcoal mb-2">
                    {currentPhoto.title}
                  </h3>
                </div>
              )}

              {/* Description */}
              {currentPhoto.description && (
                <div>
                  <p className="text-warm-gray leading-relaxed">
                    {currentPhoto.description}
                  </p>
                </div>
              )}

              {/* Camera Info */}
              {(currentPhoto.cameraModel ||
                currentPhoto.lensModel ||
                currentPhoto.iso ||
                currentPhoto.aperture ||
                currentPhoto.shutterSpeed ||
                currentPhoto.focalLength) && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal mb-3 uppercase tracking-wide">
                    拍摄参数
                  </h4>
                  <div className="space-y-2 text-sm">
                    {currentPhoto.cameraModel && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">相机</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.cameraModel}
                        </span>
                      </div>
                    )}
                    {currentPhoto.lensModel && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">镜头</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.lensModel}
                        </span>
                      </div>
                    )}
                    {currentPhoto.iso && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">ISO</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.iso}
                        </span>
                      </div>
                    )}
                    {currentPhoto.aperture && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">光圈</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.aperture}
                        </span>
                      </div>
                    )}
                    {currentPhoto.shutterSpeed && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">快门</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.shutterSpeed}
                        </span>
                      </div>
                    )}
                    {currentPhoto.focalLength && (
                      <div className="flex justify-between">
                        <span className="text-warm-gray">焦距</span>
                        <span className="text-charcoal font-medium">
                          {currentPhoto.focalLength}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              {currentPhoto.location && (
                <div>
                  <h4 className="text-sm font-semibold text-charcoal mb-2 uppercase tracking-wide">
                    拍摄地点
                  </h4>
                  <p className="text-warm-gray">{currentPhoto.location}</p>
                </div>
              )}

              {/* Dimensions */}
              <div>
                <h4 className="text-sm font-semibold text-charcoal mb-2 uppercase tracking-wide">
                  尺寸
                </h4>
                <p className="text-warm-gray">
                  {currentPhoto.width} × {currentPhoto.height} px
                </p>
              </div>
            </div>
          ) : (
            <CommentSection photoId={currentPhoto.id} />
          )}
        </div>
      </div>
    </div>
  );
}
