'use client';

import { Suspense } from 'react';
import SearchContent from './SearchContent';
import Container from '@/components/layout/Container';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-12">
        <Container>
          <div className="text-center py-20">
            <p className="text-warm-gray">加载中...</p>
          </div>
        </Container>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
