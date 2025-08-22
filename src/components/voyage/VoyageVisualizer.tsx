
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

type Location = { name: string; lng: number; lat: number };
type Route = {
    start: Location,
    end: Location,
    duration: number
}[];

const routes: Record<string, Route> = {
    "US-FR-DE-456": [
        { start: { name: "New York, USA", lng: -74.0060, lat: 40.7128 }, end: { name: "Gander, CA", lng: -54.6089, lat: 48.9569 }, duration: 20000 },
        { start: { name: "Gander, CA", lng: -54.6089, lat: 48.9569 }, end: { name: "Shannon, IE", lng: -8.9248, lat: 52.6998 }, duration: 50000 },
        { start: { name: "Shannon, IE", lng: -8.9248, lat: 52.6998 }, end: { name: "Frankfurt, DE", lng: 8.6821, lat: 50.1109 }, duration: 15000 },
    ],
    "US-DXB-KR-123": [
        { start: { name: "Washington D.C., USA", lng: -77.0369, lat: 38.9072 }, end: { name: "Dubai, UAE", lng: 55.3657, lat: 25.2532 }, duration: 60000 },
        { start: { name: "Dubai, UAE", lng: 55.3657, lat: 25.2532 }, end: { name: "Seoul, KR", lng: 126.4407, lat: 37.4602 }, duration: 40000 },
    ]
};

const FIVE_DAYS_IN_MS = 5 * 24 * 60 * 60 * 1000;


function VoyageVisualizerContent() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [nextDestination, setNextDestination] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  const startTracking = (trackingId: string) => {
    const route = routes[trackingId];
    if (route) {
        setCurrentRoute(route);
        setIsTracking(true);
        setError(null);
        setInputValue(trackingId);
        // Simulate a progress point for demonstration
        const totalDuration = route.reduce((acc, leg) => acc + leg.duration, 0);
        
        let timeToStart;
        if (trackingId === "US-DXB-KR-123") {
            // Start 99.9% into the first leg to appear 'stuck' before Dubai
            const firstLegDuration = route[0].duration;
            timeToStart = firstLegDuration * 0.999;
        } else {
            // Default start time
            timeToStart = totalDuration * 0.1; // Start 10% into the journey
        }
        
        setStartTime(Date.now() - timeToStart);
    } else {
        setError('Invalid tracking ID. Please try again.');
    }
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
      setCurrentRoute(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTracking(inputValue);
  };

  useEffect(() => {
    if (!isTracking || !startTime || !currentRoute) return;

    const totalDuration = currentRoute.reduce((acc, segment) => acc + segment.duration, 0);
    let animationFrameId: number;

    const updatePosition = () => {
      let elapsedTime = Date.now() - startTime;
      
      // Special logic for the "stuck" flight
      if (inputValue === "US-DXB-KR-123") {
          const firstLegDuration = currentRoute[0].duration;
          const stuckTime = firstLegDuration * 0.999;
          
          if (elapsedTime >= stuckTime && elapsedTime < stuckTime + FIVE_DAYS_IN_MS) {
              // Freeze time at the stuck point
              elapsedTime = stuckTime;
              setStatusText("Delayed - Awaiting Landing Slot");
          } else if (elapsedTime >= stuckTime + FIVE_DAYS_IN_MS) {
              // Resume journey after 5 days, adjust elapsed time to account for delay
              elapsedTime -= FIVE_DAYS_IN_MS;
          }
      }

      const totalProgress = Math.min(elapsedTime / totalDuration, 1);
      
      const { position, currentStatus, nextDest, segmentProgress } = calculateShipPosition(totalProgress, currentRoute);
      
      if (statusText !== "Delayed - Awaiting Landing Slot") {
        setStatusText(currentStatus);
      }
      setShipPosition(position);
      setNextDestination(nextDest);
      setProgress(segmentProgress * 100);

      if (totalProgress < 1) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        const finalDestination = currentRoute[currentRoute.length - 1]?.end.name || 'final destination';
        setStatusText(`Shipment has arrived at ${finalDestination}.`);
        setNextDestination('Journey complete');
        setProgress(100);
      }
    };
    
    updatePosition();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTracking, startTime, currentRoute, inputValue, statusText]);
  

  if (!isTracking || !currentRoute) {
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
                placeholder="e.g., US-DXB-KR-123"
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
      <Map shipPosition={shipPosition} route={currentRoute} />
      <TrackingStatus 
        trackingId={inputValue}
        statusText={statusText}
        nextDestination={nextDestination}
        progress={progress}
        route={currentRoute}
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
