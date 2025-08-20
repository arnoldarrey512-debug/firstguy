export const TRACKING_ID = "US-DXB-KR-123";

export const LOCATIONS = {
  USA: { name: "Los Angeles, USA", x: 10, y: 40 },
  DUBAI: { name: "Dubai, UAE", x: 50, y: 60 },
  KOREA: { name: "Busan, South Korea", x: 90, y: 40 },
};

export const ROUTE = [
  { start: LOCATIONS.USA, end: LOCATIONS.DUBAI, duration: 40000 }, // 40 seconds
  { start: LOCATIONS.DUBAI, end: LOCATIONS.KOREA, duration: 20000 }, // 20 seconds
];

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function calculateShipPosition(segmentIndex: number, progress: number) {
  if (segmentIndex >= ROUTE.length) {
    const lastSegment = ROUTE[ROUTE.length - 1];
    if (!lastSegment) return { x: 0, y: 0, angle: 0 };
    const { x, y } = lastSegment.end;
    const prevSegment = ROUTE[ROUTE.length - 2] || lastSegment;
    const angle = Math.atan2(lastSegment.end.y - prevSegment.end.y, lastSegment.end.x - prevSegment.end.x) * (180 / Math.PI);
    return { x, y, angle };
  }

  const segment = ROUTE[segmentIndex];
  if (!segment) return null;

  const { start, end } = segment;
  const x = lerp(start.x, end.x, progress);
  const y = lerp(start.y, end.y, progress);
  
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);

  return { x, y, angle };
}
