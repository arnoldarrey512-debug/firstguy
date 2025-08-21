export const TRACKING_ID = "US-DXB-KR-123";

export const LOCATIONS = {
  USA: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 },
  PACIFIC_OCEAN: { name: "Pacific Ocean", lng: 180, lat: 25 },
  ARABIAN_SEA: { name: "Arabian Sea", lng: 65, lat: 20 },
  DUBAI: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 },
  KOREA: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 },
};

export const ROUTE = [
  { start: LOCATIONS.USA, end: LOCATIONS.PACIFIC_OCEAN, duration: 25000 }, // 25 seconds
  { start: LOCATIONS.PACIFIC_OCEAN, end: LOCATIONS.ARABIAN_SEA, duration: 25000 }, // 25 seconds
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.DUBAI, duration: 10000 }, // 10 seconds
  { start: LOCATIONS.DUBAI, end: LOCATIONS.KOREA, duration: 20000 }, // 20 seconds
];

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function calculateShipPosition(segmentIndex: number, progress: number) {
  if (segmentIndex >= ROUTE.length) {
    const lastSegment = ROUTE[ROUTE.length - 1];
    if (!lastSegment) return { x: 0, y: 0, angle: 0 };
    const { lng, lat } = lastSegment.end;
    const prevSegment = ROUTE[ROUTE.length - 2] || lastSegment;
    const angle = Math.atan2(lastSegment.end.lat - prevSegment.end.lat, lastSegment.end.lng - prevSegment.end.lng) * (180 / Math.PI);
    return { x: lng, y: lat, angle };
  }

  const segment = ROUTE[segmentIndex];
  if (!segment) return null;

  const { start, end } = segment;
  const x = lerp(start.lng, end.lng, progress);
  const y = lerp(start.lat, end.lat, progress);
  
  const angle = Math.atan2(end.lat - start.lat, end.lng - start.lng) * (180 / Math.PI);

  return { x, y, angle };
}
