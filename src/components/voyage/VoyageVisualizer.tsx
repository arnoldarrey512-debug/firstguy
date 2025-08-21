
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Map from './Map';
import TrackingStatus from './TrackingStatus';
import { TRACKING_ID, ROUTE, calculateShipPosition } from '@/lib/voyage';
import Logo from './Logo';

export default function VoyageVisualizer() {
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
    setStartTime(Date.now());
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
  };

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

    const updatePosition = () => {
      const elapsedTime = Date.now() - startTime;
      const totalProgress = Math.min(elapsedTime / totalDuration, 1);
      
      const { position, currentStatus, nextDest, segmentProgress } = calculateShipPosition(totalProgress);
      
      setShipPosition(position);
      setStatusText(currentStatus);
      setNextDestination(nextDest);
      setProgress(segmentProgress * 100);

      if (totalProgress < 1) {
        requestAnimationFrame(updatePosition);
      } else {
        const finalDestination = ROUTE[ROUTE.length - 1]?.end.name || 'final destination';
        setStatusText(`Shipment has arrived at ${finalDestination}.`);
        setNextDestination('Journey complete');
        setProgress(100);
      }
    };
    
    const animationFrameId = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isTracking, startTime]);
  

  if (!isTracking) {
    return (
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="flex justify-center">
            <Logo className="w-12 h-12" />
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
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Logo className="w-12 h-12" />
        </h1>
        <Button variant="outline" onClick={resetTracking}>Track Another Shipment</Button>
      </div>
      <Map shipPosition={shipPosition} />
      <TrackingStatus 
        trackingId={TRACKING_ID}
        statusText={statusText}
        nextDestination={nextDestination}
        progress={progress}
      />
    </div>
  );
}
