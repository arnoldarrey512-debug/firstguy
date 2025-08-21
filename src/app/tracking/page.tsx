
"use client";

import VoyageVisualizer from '@/components/voyage/VoyageVisualizer';
import { Suspense } from 'react';

function TrackingPageComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-background">
      <VoyageVisualizer />
    </main>
  );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackingPageComponent />
        </Suspense>
    )
}
