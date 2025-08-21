
export const TRACKING_ID = "US-DXB-KR-123";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const LOCATIONS = {
  USA: { name: "Seattle, USA", lng: -122.3321, lat: 47.6062 },
  PACIFIC_NORTH_WEST: { name: "N. Pacific", lng: -140, lat: 45 },
  ALEUTIAN_PASS: { name: "Aleutian Islands", lng: 178, lat: 52 },
  JAPAN_EAST: { name: "East of Japan", lng: 155, lat: 35 },
  SOUTH_CHINA_SEA_NORTH: { name: "S. China Sea", lng: 118, lat: 20 },
  STRAIT_OF_MALACCA: { name: "Strait of Malacca", lng: 100, lat: 4 },
  SRI_LANKA_SOUTH: { name: "South of Sri Lanka", lng: 80, lat: 5 },
  ARABIAN_SEA: { name: "Arabian Sea", lng: 65, lat: 18 },
  DUBAI: { name: "Dubai, UAE", lng: 55.2708, lat: 25.2048 },
  KOREA: { name: "Busan, South Korea", lng: 129.0756, lat: 35.1796 },
};

// More detailed, over-water route
export const ROUTE = [
  // From USA to Dubai (approx 5 days)
  { start: LOCATIONS.USA, end: LOCATIONS.PACIFIC_NORTH_WEST, duration: 1.2 * DAY_IN_MS },
  { start: LOCATIONS.PACIFIC_NORTH_WEST, end: LOCATIONS.ALEUTIAN_PASS, duration: 0.8 * DAY_IN_MS },
  { start: LOCATIONS.ALEUTIAN_PASS, end: LOCATIONS.JAPAN_EAST, duration: 0.6 * DAY_IN_MS },
  { start: LOCATIONS.JAPAN_EAST, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.STRAIT_OF_MALACCA, duration: 0.4 * DAY_IN_MS },
  { start: LOCATIONS.STRAIT_OF_MALACCA, end: LOCATIONS.SRI_LANKA_SOUTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.SRI_LANKA_SOUTH, end: LOCATIONS.ARABIAN_SEA, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.DUBAI, duration: 0.5 * DAY_IN_MS }, // Arrives in Dubai
  
  // From Dubai to Korea (another ~5 days)
  { start: LOCATIONS.DUBAI, end: LOCATIONS.ARABIAN_SEA, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.ARABIAN_SEA, end: LOCATIONS.SRI_LANKA_SOUTH, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.SRI_LANKA_SOUTH, end: LOCATIONS.STRAIT_OF_MALACCA, duration: 0.5 * DAY_IN_MS },
  { start: LOCATIONS.STRAIT_OF_MALACCA, end: LOCATIONS.SOUTH_CHINA_SEA_NORTH, duration: 0.6 * DAY_IN_MS },
  { start: LOCATIONS.SOUTH_CHINA_SEA_NORTH, end: LOCATIONS.JAPAN_EAST, duration: 1 * DAY_IN_MS },
  { start: LOCATIONS.JAPAN_EAST, end: LOCATIONS.KOREA, duration: 1.9 * DAY_IN_MS },
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
