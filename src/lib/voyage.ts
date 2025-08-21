
export const TRACKING_ID = "US-DXB-KR-123";

export const LOCATIONS = {
  USA: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 },
  PACIFIC_OCEAN_NORTH: { name: "N. Pacific Ocean", lng: 180, lat: 45 },
  JAPAN_EAST: { name: "East of Japan", lng: 155, lat: 35 },
  SOUTH_CHINA_SEA_NORTH: { name: "S. China Sea (N)", lng: 120, lat: 20 },
  STRAIT_OF_MALACCA_NORTH: { name: "Strait of Malacca (N)", lng: 105, lat: 10 },
  INDIAN_OCEAN_NORTH: { name: "N. Indian Ocean", lng: 85, lat: 10 },
  ARABIAN_SEA: { name: "Arabian Sea", lng: 65, lat: 20 },
  DUBAI: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 },
  KOREA: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 },
};

export const ROUTE = [
  // From USA to Dubai
  { start: LOCATIONS.USA, end: LOCATIONS.PACIFIC_OCEAN_NORTH, duration: 12000 },
  { start: LOCATIONS.PACIFIC_OCEAN_NORTH, end: LOCATIONS.JAPAN_EAST, duration: 8000 },
  { start: LOCATIONS.JAPAN_EAST, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 6000 },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.STRAIT_OF_MALACCA_NORTH, duration: 5000 },
  { start: LOCATIONS.STRAIT_OF_MALACCA_NORTH, end: LOCATIONS.INDIAN_OCEAN_NORTH, duration: 4000 },
  { start: LOCATIONS.INDIAN_OCEAN_NORTH, end: LOCATIONS.ARABIAN_SEA, duration: 5000 },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.DUBAI, duration: 3000 },
  
  // From Dubai to Korea
  { start: LOCATIONS.DUBAI, end: LOCATIONS.ARABIAN_SEA, duration: 3000 },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.INDIAN_OCEAN_NORTH, duration: 5000 },
  { start: LOCATIONS.INDIAN_OCEAN_NORTH, end: LOCATIONS.STRAIT_OF_MALACCA_NORTH, duration: 4000 },
  { start: LOCATIONS.STRAIT_OF_MALACCA_NORTH, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 5000 },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.KOREA, duration: 7000 },
];

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function calculateShipPosition(segmentIndex: number, progress: number) {
  // Start simulation closer to Dubai
  const segmentOffset = 5; 
  const effectiveSegmentIndex = segmentIndex + segmentOffset;

  if (effectiveSegmentIndex >= ROUTE.length) {
    const lastSegment = ROUTE[ROUTE.length - 1];
    if (!lastSegment) return { x: 0, y: 0, angle: 0 };
    const { lng, lat } = lastSegment.end;
    const prevSegment = ROUTE[ROUTE.length - 2] || lastSegment;
    const angle = Math.atan2(lastSegment.end.lat - prevSegment.end.lat, lastSegment.end.lng - prevSegment.end.lng) * (180 / Math.PI);
    return { x: lng, y: lat, angle };
  }

  const segment = ROUTE[effectiveSegmentIndex];
  if (!segment) return null;

  const { start, end } = segment;
  const x = lerp(start.lng, end.lng, progress);
  const y = lerp(start.lat, end.lat, progress);
  
  const angle = Math.atan2(end.lat - start.lat, end.lng - start.lng) * (180 / Math.PI);

  return { x, y, angle };
}
