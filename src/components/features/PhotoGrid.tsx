'use client';

import Masonry from 'react-masonry-css';
import { Photo } from '@/types';
import { PhotoCard } from '../ui/Card';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick?: (photoIndex: number) => void;
}

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  const breakpointColumns = {
    default: 3,
    1024: 2,
    768: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-5 w-auto"
      columnClassName="pl-5 bg-clip-padding"
    >
      {photos.map((photo, index) => (
        <div key={photo.id} className="mb-5">
          <PhotoCard
            photoUrl={photo.mediumUrl}
            title={photo.title}
            onClick={() => onPhotoClick?.(index)}
          />
        </div>
      ))}
    </Masonry>
  );
}
