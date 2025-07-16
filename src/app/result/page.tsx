'use client';

import dynamic from 'next/dynamic';

const ResultClient = dynamic(() => import('./ResultClient'), { ssr: false });

export default function Page() {
  return <ResultClient />;
}