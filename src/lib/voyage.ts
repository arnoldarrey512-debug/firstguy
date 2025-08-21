


export const TRACKING_ID = "US-DXB-KR-123";

// Default hardcoded route if no URL params are provided
export const ROUTE = [
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

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

type RouteSegment = {
    start: { name: string; lng: number; lat: number };
    end: { name:string; lng: number; lat: number };
    duration: number;
}

export function calculateShipPosition(totalProgress: number, route: RouteSegment[]) {
  if (!route || route.length === 0) {
      return { 
          position: null,
          currentStatus: 'No route data',
          nextDest: 'N/A',
          segmentProgress: 0
      };
  }

  const totalDuration = route.reduce((acc, segment) => acc + segment.duration, 0);
  const elapsedTime = totalDuration * totalProgress;

  let accumulatedDuration = 0;
  for (const segment of route) {
    const segmentEndTime = accumulatedDuration + segment.duration;
    if (elapsedTime <= segmentEndTime) {
      const segmentProgress = segment.duration > 0 ? (elapsedTime - accumulatedDuration) / segment.duration : 1;
      const { start, end } = segment;
      const x = lerp(start.lng, end.lng, segmentProgress);
      const y = lerp(start.lat, end.lat, segmentProgress);
      const angle = Math.atan2(end.lat - start.lat, end.lng - start.lng) * (180 / Math.PI);
      
      return {
        position: { x, y, angle },
        currentStatus: `In transit to ${end.name}`,
        nextDest: `Next stop: ${end.name}`,
        segmentProgress: segmentProgress,
      };
    }
    accumulatedDuration += segment.duration;
  }

  // If progress is 100% or more, lock to the final destination
  const lastSegment = route[route.length - 1];
  const { lng, lat } = lastSegment.end;
  const prevSegment = route[route.length - 2] || lastSegment;
  const angle = Math.atan2(lastSegment.end.lat - prevSegment.end.lat, lastSegment.end.lng - prevSegment.end.lng) * (180 / Math.PI);
  return { 
    position: { x: lng, y: lat, angle },
    currentStatus: `Arrived at ${lastSegment.end.name}`,
    nextDest: `Journey complete`,
    segmentProgress: 1
  };
}
