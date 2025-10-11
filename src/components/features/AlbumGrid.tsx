'use client';

import Masonry from 'react-masonry-css';
import { Album } from '@/types';
import { AlbumCard } from '../ui/Card';

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick?: (albumId: string) => void;
}

export default function AlbumGrid({ albums, onAlbumClick }: AlbumGridProps) {
  const breakpointColumns = {
    default: 3,
    1024: 2,
    768: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-6 w-auto"
      columnClassName="pl-6 bg-clip-padding"
    >
      {albums.map((album) => (
        <div key={album.id} className="mb-6">
          <AlbumCard
            coverUrl={album.coverPhotoUrl || ''}
            title={album.title}
            photoCount={album.photoCount ?? 0}
            onClick={() => onAlbumClick?.(album.id)}
          />
        </div>
      ))}
    </Masonry>
  );
}
