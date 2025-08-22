
"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Map from './Map';
import TrackingStatus from './TrackingStatus';
import { calculateShipPosition } from '@/lib/voyage';
import Logo from './Logo';
import { useSearchParams } from 'next/navigation';

function VoyageVisualizerContent() {
  const searchParams = useSearchParams();

  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [nextDestination, setNextDestination] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const { route, trackingId } = useMemo(() => {
    // Default hardcoded route if no URL params are provided
    const defaultRoute = [
        { start: { name: "New York, USA", lng: -74.0060, lat: 40.7128 }, end: { name: "Gander, CA", lng: -54.6089, lat: 48.9569 }, duration: 20000 },
        { start: { name: "Gander, CA", lng: -54.6089, lat: 48.9569 }, end: { name: "Shannon, IE", lng: -8.9248, lat: 52.6998 }, duration: 50000 },
        { start: { name: "Shannon, IE", lng: -8.9248, lat: 52.6998 }, end: { name: "Frankfurt, DE", lng: 8.6821, lat: 50.1109 }, duration: 15000 },
    ];
    const defaultTrackingId = "US-FR-DE-456";

    try {
      const urlRoute = searchParams.get('route');
      const urlTrackingId = searchParams.get('trackingId');
      const urlCurrentPos = searchParams.get('currentPos');

      if (urlRoute && urlTrackingId && urlCurrentPos) {
        const parsedRoute = JSON.parse(decodeURIComponent(urlRoute));
        if (Array.isArray(parsedRoute) && parsedRoute.length > 0) {
          return {
            route: parsedRoute,
            trackingId: decodeURIComponent(urlTrackingId),
            currentPos: parseFloat(urlCurrentPos)
          };
        }
      }
    } catch (e) {
      console.error("Failed to parse route from URL", e);
      // Fallback to default
    }
    
    return { route: defaultRoute, trackingId: defaultTrackingId, currentPos: 0.85 };
  }, [searchParams]);

  useEffect(() => {
    // If URL contains route info, start tracking immediately
    if (searchParams.get('route')) {
      startTracking();
    }
  }, [searchParams]);

  const startTracking = () => {
    setIsTracking(true);
    let timeToFrankfurtApproach = 0;
    // Calculate time elapsed to be near Frankfurt
    const totalDuration = route.reduce((acc, leg) => acc + leg.duration, 0);
    const progressToSet = searchParams.get('currentPos') ? parseFloat(searchParams.get('currentPos')!) : 0.85;
    timeToFrankfurtApproach = totalDuration * progressToSet;
    setStartTime(Date.now() - timeToFrankfurtApproach);
  };
  
  const resetTracking = () => {
      setIsTracking(false);
      setError(null);
      setInputValue('');
      setShipPosition(null);
      setStatusText('');
      setNextDestination('');
      setProgress(0);
      setStartTime(null);
      // Clear URL params
      window.history.pushState({}, '', '/tracking');
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === trackingId) {
      setError(null);
      startTracking();
    } else {
      setError('Invalid tracking ID. Please try again.');
    }
  };

  useEffect(() => {
    if (!isTracking || !startTime) return;

    const totalDuration = route.reduce((acc, segment) => acc + segment.duration, 0);
    let animationFrameId: number;

    const updatePosition = () => {
      const elapsedTime = Date.now() - startTime;
      const totalProgress = Math.min(elapsedTime / totalDuration, 1);
      
      const { position, currentStatus, nextDest, segmentProgress } = calculateShipPosition(totalProgress, route);
      
      setShipPosition(position);
      setStatusText(currentStatus);
      setNextDestination(nextDest);
      setProgress(segmentProgress * 100);

      if (totalProgress < 1) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        const finalDestination = route[route.length - 1]?.end.name || 'final destination';
        setStatusText(`Shipment has arrived at ${finalDestination}.`);
        setNextDestination('Journey complete');
        setProgress(100);
      }
    };
    
    updatePosition();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTracking, startTime, route]);
  

  if (!isTracking) {
    return (
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center gap-2">
            <Logo className="w-16 h-16" />
            <span className="text-2xl font-bold text-primary">UN Air Cargo</span>
          </CardTitle>
          <CardDescription className="text-center pt-2">Enter the tracking ID to view your shipment's journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input 
                id="trackingId" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder={`e.g., ${trackingId}`}
              />
            </div>
            <Button type="submit" className="w-full">Track Shipment</Button>
          </form>
          {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl flex flex-col items-center gap-8 animate-in fade-in zoom-in-95">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <Logo className="w-16 h-16" />
            <h1 className="text-3xl font-bold text-primary">UN Air Cargo</h1>
        </div>
        <Button variant="outline" onClick={resetTracking}>Track Another Shipment</Button>
      </div>
      <Map shipPosition={shipPosition} route={route} />
      <TrackingStatus 
        trackingId={trackingId}
        statusText={statusText}
        nextDestination={nextDestination}
        progress={progress}
        route={route}
      />
    </div>
  );
}

export default function VoyageVisualizer() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
          <VoyageVisualizerContent />
      </Suspense>
    )
}
