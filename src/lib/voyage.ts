
export const TRACKING_ID = "US-DXB-KR-123";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const LOCATIONS = {
  USA: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 },
  PACIFIC_OCEAN_NORTH: { name: "N. Pacific Ocean", lng: 180, lat: 45 },
  JAPAN_EAST: { name: "East of Japan", lng: 155, lat: 35 },
  SOUTH_CHINA_SEA_NORTH: { name: "S. China Sea (N)", lng: 120, lat: 20 },
  STRAIT_OF_MALACCA_NORTH: { name: "Strait of Malacca (N)", lng: 100, lat: 6 },
  INDIAN_OCEAN_NORTH: { name: "N. Indian Ocean", lng: 85, lat: 10 },
  ARABIAN_SEA: { name: "Arabian Sea", lng: 65, lat: 20 },
  DUBAI: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 },
  KOREA: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 },
};

export const ROUTE = [
  // From USA to Dubai (approx 2.5 days)
  { start: LOCATIONS.USA, end: LOCATIONS.PACIFIC_OCEAN_NORTH, duration: 1.2 * DAY_IN_MS },
  { start: LOCATIONS.PACIFIC_OCEAN_NORTH, end: LOCATIONS.JAPAN_EAST, duration: 0.8 * DAY_IN_MS },
  { start: LOCATIONS.JAPAN_EAST, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 0.6 * DAY_IN_MS },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.STRAIT_OF_MALACCA_NORTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.STRAIT_OF_MALACCA_NORTH, end: LOCATIONS.INDIAN_OCEAN_NORTH, duration: 0.4 * DAY_IN_MS },
  { start: LOCATIONS.INDIAN_OCEAN_NORTH, end: LOCATIONS.ARABIAN_SEA, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.DUBAI, duration: 1 * DAY_IN_MS }, // Total ~5 days to Dubai
  
  // From Dubai to Korea (another ~5 days)
  { start: LOCATIONS.DUBAI, end: LOCATIONS.ARABIAN_SEA, duration: 1 * DAY_IN_MS },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.INDIAN_OCEAN_NORTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.INDIAN_OCEAN_NORTH, end: LOCATIONS.STRAIT_OF_MALACCA_NORTH, duration: 0.4 * DAY_IN_MS },
  { start: LOCATIONS.STRAIT_OF_MALACCA_NORTH, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.KOREA, duration: 2.6 * DAY_IN_MS },
];

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function calculateShipPosition(totalProgress: number) {
  const totalDuration = ROUTE.reduce((acc, segment) => acc + segment.duration, 0);
  const elapsedTime = totalDuration * totalProgress;

  let accumulatedDuration = 0;
  for (const segment of ROUTE) {
    const segmentEndTime = accumulatedDuration + segment.duration;
    if (elapsedTime <= segmentEndTime) {
      const segmentProgress = (elapsedTime - accumulatedDuration) / segment.duration;
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
  const lastSegment = ROUTE[ROUTE.length - 1];
  const { lng, lat } = lastSegment.end;
  const prevSegment = ROUTE[ROUTE.length - 2] || lastSegment;
  const angle = Math.atan2(lastSegment.end.lat - prevSegment.end.lat, lastSegment.end.lng - prevSegment.end.lng) * (180 / Math.PI);
  return { 
    position: { x: lng, y: lat, angle },
    currentStatus: `Arrived at ${lastSegment.end.name}`,
    nextDest: `Journey complete`,
    segmentProgress: 1
  };
}
