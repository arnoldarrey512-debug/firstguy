

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
  // Use previous segment's end to calculate final angle
  const prevSegment = route.length > 1 ? route[route.length - 2] : lastSegment;
  const prevPoint = route.length > 1 ? prevSegment.end : prevSegment.start;
  const angle = Math.atan2(lastSegment.end.lat - prevPoint.lat, lastSegment.end.lng - prevPoint.lng) * (180 / Math.PI);
  return { 
    position: { x: lng, y: lat, angle },
    currentStatus: `Arrived at ${lastSegment.end.name}`,
    nextDest: `Journey complete`,
    segmentProgress: 1
  };
}
