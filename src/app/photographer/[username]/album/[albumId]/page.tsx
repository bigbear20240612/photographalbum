'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import PhotoGrid from '@/components/features/PhotoGrid';
import Lightbox from '@/components/features/Lightbox';
import {
  getUserByUsername,
  getAlbumById,
  getPhotosByAlbumId,
} from '@/lib/mockData';
import { formatDate } from '@/lib/utils';

export default function AlbumPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const albumId = params.albumId as string;

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const user = getUserByUsername(username);
  const album = getAlbumById(albumId);
  const photos = getPhotosByAlbumId(albumId);

  if (!user || !album) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold text-charcoal mb-4">
            专辑不存在
          </h1>
          <p className="text-warm-gray mb-6">该专辑不存在或已被删除</p>
          <button
            onClick={() => router.back()}
            className="text-terra-cotta hover:text-amber-gold transition-colors"
          >
            返回上一页
          </button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="min-h-screen py-12">
        <Container>
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href={`/photographer/${username}`}
              className="inline-flex items-center gap-2 text-warm-gray hover:text-terra-cotta transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>返回 {user.displayName || user.username}</span>
            </Link>
          </div>

          {/* Album Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-charcoal mb-4">
              {album.title}
            </h1>

            {album.description && (
              <p className="text-lg text-warm-gray leading-relaxed mb-6">
                {album.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-6 text-sm text-light-gray">
              {album.categoryTags && (() => {
                try {
                  const tags = JSON.parse(album.categoryTags);
                  if (Array.isArray(tags) && tags.length > 0) {
                    return (
                      <div className="flex items-center gap-2">
                        {tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-terra-cotta/10 text-terra-cotta rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    );
                  }
                } catch {
                  return null;
                }
                return null;
              })()}
              <span>{photos.length} 张照片</span>
              <span>{formatDate(album.createdAt)}</span>
            </div>
          </div>

          {/* Photos Grid */}
          {photos.length > 0 ? (
            <PhotoGrid
              photos={photos}
              onPhotoClick={(index) => {
                setLightboxIndex(index);
                setIsLightboxOpen(true);
              }}
            />
          ) : (
            <div className="text-center py-16 text-warm-gray">
              该专辑还没有照片
            </div>
          )}
        </Container>
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
