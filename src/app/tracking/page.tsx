import VoyageVisualizer from '@/components/voyage/VoyageVisualizer';

export default function TrackingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-background">
      <VoyageVisualizer />
    </main>
  );
}
