export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ResultClient from './ResultClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultClient />
    </Suspense>
  );
}