
export const TRACKING_ID = "US-DXB-KR-123";

export const LOCATIONS = {
  USA: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 },
  PACIFIC_OCEAN_NORTH: { name: "North Pacific Ocean", lng: -150, lat: 40 },
  WEST_PACIFIC: { name: "West Pacific", lng: 145, lat: 20 },
  SOUTH_CHINA_SEA: { name: "South China Sea", lng: 110, lat: 10 },
  STRAIT_OF_MALACCA: { name: "Strait of Malacca", lng: 100, lat: 5 },
  INDIAN_OCEAN: { name: "Indian Ocean", lng: 80, lat: 10 },
  ARABIAN_SEA: { name: "Arabian Sea", lng: 65, lat: 20 },
  DUBAI: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 },
  KOREA: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 },
};

export const ROUTE = [
  // From USA to Dubai
  { start: LOCATIONS.USA, end: LOCATIONS.PACIFIC_OCEAN_NORTH, duration: 10000 },
  { start: LOCATIONS.PACIFIC_OCEAN_NORTH, end: LOCATIONS.WEST_PACIFIC, duration: 15000 },
  { start: LOCATIONS.WEST_PACIFIC, end: LOCATIONS.SOUTH_CHINA_SEA, duration: 8000 },
  { start: LOCATIONS.SOUTH_CHINA_SEA, end: LOCATIONS.STRAIT_OF_MALACCA, duration: 5000 },
  { start: LOCATIONS.STRAIT_OF_MALACCA, end: LOCATIONS.INDIAN_OCEAN, duration: 7000 },
  { start: LOCATIONS.INDIAN_OCEAN, end: LOCATIONS.ARABIAN_SEA, duration: 5000 },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.DUBAI, duration: 3000 },
  
  // From Dubai to Korea
  { start: LOCATIONS.DUBAI, end: LOCATIONS.ARABIAN_SEA, duration: 3000 },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.INDIAN_OCEAN, duration: 5000 },
  { start: LOCATIONS.INDIAN_OCEAN, end: LOCATIONS.STRAIT_OF_MALACCA, duration: 7000 },
  { start: LOCATIONS.STRAIT_OF_MALACCA, end: LOCATIONS.SOUTH_CHINA_SEA, duration: 5000 },
  { start: LOCATIONS.SOUTH_CHINA_SEA, end: LOCATIONS.KOREA, duration: 10000 },
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
