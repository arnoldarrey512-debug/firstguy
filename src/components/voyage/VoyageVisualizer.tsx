
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Map from './Map';
import TrackingStatus from './TrackingStatus';
import { TRACKING_ID as DEFAULT_TRACKING_ID, calculateShipPosition } from '@/lib/voyage';
import Logo from './Logo';

// Default hardcoded route if no URL params are provided
const DEFAULT_ROUTE = [
    { start: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 }, end: { name: "N. Pacific", lng: -140, lat: 45 }, duration: 120000 },
    { start: { name: "N. Pacific", lng: -140, lat: 45 }, end: { name: "Aleutian Islands", lng: 178, lat: 52 }, duration: 80000 },
    { start: { name: "Aleutian Islands", lng: 178, lat: 52 }, end: { name: "East of Japan", lng: 155, lat: 35 }, duration: 60000 },
    { start: { name: "East of Japan", lng: 155, lat: 35 }, end: { name: "S. China Sea", lng: 118, lat: 20 }, duration: 50000 },
    { start: { name: "S. China Sea", lng: 118, lat: 20 }, end: { name: "Strait of Malacca", lng: 100, lat: 4 }, duration: 40000 },
    { start: { name: "Strait of Malacca", lng: 100, lat: 4 }, end: { name: "South of Sri Lanka", lng: 80, lat: 5 }, duration: 50000 },
    { start: { name: "South of Sri Lanka", lng: 80, lat: 5 }, end: { name: "Arabian Sea", lng: 65, lat: 18 }, duration: 50000 },
    { start: { name: "Arabian Sea", lng: 65, lat: 18 }, end: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 }, duration: 50000 },
    { start: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 }, end: { name: "Arabian Sea", lng: 65, lat: 18 }, duration: 50000 },
    { start: { name: "Arabian Sea", lng: 65, lat: 18 }, end: { name: "South of Sri Lanka", lng: 80, lat: 5 }, duration: 50000 },
    { start: { name: "South of Sri Lanka", lng: 80, lat: 5 }, end: { name: "Strait of Malacca", lng: 100, lat: 4 }, duration: 50000 },
    { start: { name: "Strait of Malacca", lng: 100, lat: 4 }, end: { name: "S. China Sea", lng: 118, lat: 20 }, duration: 60000 },
    { start: { name: "S. China Sea", lng: 118, lat: 20 }, end: { name: "East of Japan", lng: 155, lat: 35 }, duration: 100000 },
    { start: { name: "East of Japan", lng: 155, lat: 35 }, end: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 }, duration: 190000 },
];

async function geocode(locationName: string): Promise<{lng: number, lat: number} | null> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) return null;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?access_token=${accessToken}&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            return { lng, lat };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}


function VoyageVisualizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [statusText, setStatusText] = useState('');
  const [nextDestination, setNextDestination] = useState('');
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [trackingId, setTrackingId] = useState(DEFAULT_TRACKING_ID);
  const [route, setRoute] = useState(DEFAULT_ROUTE);

  useEffect(() => {
    const id = searchParams.get('id');
    const start = searchParams.get('start');
    const stops = searchParams.getAll('stops');
    const end = searchParams.get('end');
    const current = searchParams.get('current');

    if (id && start && end && current) {
      const buildRoute = async () => {
        const allStops = [start, ...stops, end];
        const coordinates = await Promise.all(allStops.map(async (name) => ({ name, coords: await geocode(name) })));
        
        const newRoute = [];
        for(let i = 0; i < coordinates.length - 1; i++) {
            if (coordinates[i].coords && coordinates[i+1].coords) {
                 newRoute.push({
                    start: { name: coordinates[i].name, ...coordinates[i].coords! },
                    end: { name: coordinates[i+1].name, ...coordinates[i+1].coords! },
                    duration: 100000 // Arbitrary duration for now
                 });
            }
        }
        setRoute(newRoute);
        setTrackingId(id);
        
        // Find which leg the "current" position is on
        const currentLegIndex = allStops.findIndex(stop => current.includes(stop));

        let timeToCurrentLeg = 0;
        for (let i = 0; i < newRoute.length; i++) {
            if (i >= currentLegIndex && currentLegIndex !== -1) {
                break;
            }
            timeToCurrentLeg += newRoute[i].duration;
        }

        setStartTime(Date.now() - timeToCurrentLeg);
        setIsTracking(true);
      };
      
      buildRoute();
    } else if (searchParams.toString()) {
        // If there are any params but not the full set, maybe show an error or reset
        console.warn("Incomplete tracking data in URL.");
        // Optional: redirect to a clean URL
        // router.push('/tracking');
    }
  }, [searchParams, router]);


  const startDefaultTracking = () => {
    setIsTracking(true);
    setRoute(DEFAULT_ROUTE);
    setTrackingId(DEFAULT_TRACKING_ID);
    
    let timeToDubaiApproach = 0;
    for (let i = 0; i < DEFAULT_ROUTE.length; i++) {
        if (DEFAULT_ROUTE[i].end.name === "Dubai, UAE") {
            break;
        }
        timeToDubaiApproach += DEFAULT_ROUTE[i].duration;
    }
    setStartTime(Date.now() - timeToDubaiApproach);
  };

  const resetTracking = () => {
    window.location.href = '/tracking';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === DEFAULT_TRACKING_ID) {
      setError(null);
      startDefaultTracking();
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
        <Suspense fallback={<div>Loading map...</div>}>
            <VoyageVisualizerContent />
        </Suspense>
    )
}

    