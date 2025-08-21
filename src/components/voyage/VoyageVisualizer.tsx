
"use client";

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Map from './Map';
import TrackingStatus from './TrackingStatus';
import { TRACKING_ID, ROUTE, calculateShipPosition } from '@/lib/voyage';
import Logo from './Logo';


function VoyageVisualizerContent() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [nextDestination, setNextDestination] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startTracking = () => {
    setIsTracking(true);
    let timeToDubaiApproach = 0;
    // Calculate time elapsed to be near Dubai
    for (let i = 0; i < ROUTE.length; i++) {
        if (ROUTE[i].end.name === "Dubai, UAE") {
            // We'll set it to be 85% of the way through the leg before Dubai
            timeToDubaiApproach += (ROUTE[i].duration * 0.85);
            break;
        }
        timeToDubaiApproach += ROUTE[i].duration;
    }
    setStartTime(Date.now() - timeToDubaiApproach);
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === TRACKING_ID) {
      setError(null);
      startTracking();
    } else {
      setError('Invalid tracking ID. Please try again.');
    }
  };

  useEffect(() => {
    if (!isTracking || !startTime) return;

    const totalDuration = ROUTE.reduce((acc, segment) => acc + segment.duration, 0);
    let animationFrameId: number;

    const updatePosition = () => {
      const elapsedTime = Date.now() - startTime;
      const totalProgress = Math.min(elapsedTime / totalDuration, 1);
      
      const { position, currentStatus, nextDest, segmentProgress } = calculateShipPosition(totalProgress, ROUTE);
      
      setShipPosition(position);
      setStatusText(currentStatus);
      setNextDestination(nextDest);
      setProgress(segmentProgress * 100);

      if (totalProgress < 1) {
        animationFrameId = requestAnimationFrame(updatePosition);
      } else {
        const finalDestination = ROUTE[ROUTE.length - 1]?.end.name || 'final destination';
        setStatusText(`Shipment has arrived at ${finalDestination}.`);
        setNextDestination('Journey complete');
        setProgress(100);
      }
    };
    
    updatePosition();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTracking, startTime]);
  

  if (!isTracking) {
    return (
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="flex flex-col items-center justify-center gap-2">
            <Logo className="w-16 h-16" />
            <span className="text-2xl font-bold text-primary">UN shipping line</span>
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
            <h1 className="text-3xl font-bold text-primary">UN shipping line</h1>
        </div>
        <Button variant="outline" onClick={resetTracking}>Track Another Shipment</Button>
      </div>
      <Map shipPosition={shipPosition} route={ROUTE} />
      <TrackingStatus 
        trackingId={TRACKING_ID}
        statusText={statusText}
        nextDestination={nextDestination}
        progress={progress}
        route={ROUTE}
      />
    </div>
  );
}

export default function VoyageVisualizer() {
    return (
        <Suspense fallback={<div>Loading map...</div>}>
            <VoyageVisualizerContent />
        </Suspense>
    )
}
