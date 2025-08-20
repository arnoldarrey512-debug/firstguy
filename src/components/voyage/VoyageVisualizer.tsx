"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Map from './Map';
import TrackingStatus from './TrackingStatus';
import { TRACKING_ID, LOCATIONS, ROUTE, calculateShipPosition } from '@/lib/voyage';
import Logo from './Logo';

export default function VoyageVisualizer() {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [nextDestination, setNextDestination] = useState('');
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [segmentIndex, setSegmentIndex] = useState(0);

  const startTracking = () => {
    setIsTracking(true);
    setSegmentIndex(0);
    setSegmentProgress(0);
    const initialPos = calculateShipPosition(0, 0);
    setShipPosition(initialPos);
  };

  const resetTracking = () => {
    setIsTracking(false);
    setError(null);
    setInputValue('');
    setShipPosition(null);
    setStatusText('');
    setNextDestination('');
    setSegmentProgress(0);
    setSegmentIndex(0);
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
    if (!isTracking) return;

    const currentSegment = ROUTE[segmentIndex];
    if (!currentSegment) {
      setStatusText(`Shipment has arrived at ${LOCATIONS.KOREA.name}.`);
      setNextDestination('Journey complete');
      setShipPosition(calculateShipPosition(ROUTE.length, 1));
      return;
    }
    
    setStatusText(`In transit to ${currentSegment.end.name}`);
    setNextDestination(`Next stop: ${currentSegment.end.name}`);

    const interval = setInterval(() => {
      setSegmentProgress(prev => {
        const updateRate = 100; // ms
        const progressIncrement = (updateRate / currentSegment.duration);
        const newProgress = prev + progressIncrement;

        if (newProgress >= 1) {
          setSegmentIndex(idx => idx + 1);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isTracking, segmentIndex]);

  useEffect(() => {
    if (!isTracking) return;
    
    const pos = calculateShipPosition(segmentIndex, segmentProgress);
    setShipPosition(pos);
  }, [isTracking, segmentIndex, segmentProgress]);
  

  if (!isTracking) {
    return (
      <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
            <Logo className="w-12 h-12" />
          </CardTitle>
          <CardDescription>Enter the tracking ID to view your shipment's journey.</CardDescription>
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
      <Map shipPosition={shipPosition} locations={LOCATIONS} />
      <TrackingStatus 
        trackingId={TRACKING_ID}
        statusText={statusText}
        nextDestination={nextDestination}
        progress={segmentProgress * 100}
      />
    </div>
  );
}
