
"use client";

import VoyageVisualizer from '@/components/voyage/VoyageVisualizer';
import { Suspense } from 'react';
import Footer from '@/components/voyage/Footer';

function TrackingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-24">
        <VoyageVisualizer />
      </main>
      <Footer />
    </div>
  );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TrackingPageComponent />
        </Suspense>
    )
}
