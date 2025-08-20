"use client";

import { Ship, Anchor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LOCATIONS } from '@/lib/voyage';

type MapProps = {
  shipPosition: { x: number; y: number; angle: number } | null;
  locations: typeof LOCATIONS;
};

export default function Map({ shipPosition, locations }: MapProps) {
  const pathData = `M ${locations.USA.x} ${locations.USA.y} L ${locations.DUBAI.x} ${locations.DUBAI.y} L ${locations.KOREA.x} ${locations.KOREA.y}`;

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-2">
        <div className="relative w-full aspect-[10/6] bg-primary/5 rounded-md overflow-hidden" data-ai-hint="world map">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0">
            <path d={pathData} stroke="hsl(var(--primary))" strokeOpacity="0.5" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
          
          {Object.values(locations).map(loc => (
            <div key={loc.name} className="absolute flex flex-col items-center" style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}>
              <div className="relative flex justify-center items-center">
                <Anchor className="w-5 h-5 text-primary" />
              </div>
              <span className="mt-2 text-xs font-semibold text-primary/80 whitespace-nowrap bg-background/50 px-2 py-0.5 rounded-full">{loc.name}</span>
            </div>
          ))}

          {shipPosition && (
            <div
              className="absolute transition-all duration-100 ease-linear"
              style={{
                left: `${shipPosition.x}%`,
                top: `${shipPosition.y}%`,
                transform: `translate(-50%, -50%) rotate(${shipPosition.angle}deg)`,
              }}
            >
              <Ship className="w-6 h-6 text-accent drop-shadow-lg" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
