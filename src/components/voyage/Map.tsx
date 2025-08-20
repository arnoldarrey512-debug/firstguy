"use client";

import { useEffect, useRef, useState } from 'react';
import mapboxgl, { LngLatLike, Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Ship, Anchor, TriangleAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LOCATIONS } from '@/lib/voyage';
import ReactDOMServer from 'react-dom/server';

type MapProps = {
  shipPosition: { x: number; y: number; angle: number } | null;
  locations: typeof LOCATIONS;
};

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export default function Map({ shipPosition, locations }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const shipMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routeColor] = useState('#e53e3e'); // Using a static color for the route

  const routeCoordinates = Object.values(locations).map(l => [l.lng, l.lat]);

  useEffect(() => {
    if (!MAPBOX_TOKEN || map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [85, 30], // Centered between locations
      zoom: 1.5,
      interactive: false,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    
    // Add route line
    if (!map.current.getSource('route')) {
      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': routeColor,
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });
    }

    // Add location markers
    Object.values(locations).forEach(loc => {
      const el = document.createElement('div');
      el.innerHTML = ReactDOMServer.renderToString(
        <div className="relative flex flex-col items-center">
          <Anchor className="w-5 h-5 text-primary" />
          <span className="mt-2 text-xs font-semibold text-primary/80 whitespace-nowrap bg-background/50 px-2 py-0.5 rounded-full">{loc.name}</span>
        </div>
      );
      
      new mapboxgl.Marker(el)
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current!);
    });

  }, [mapLoaded, locations, routeCoordinates, routeColor]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !shipPosition) return;
    
    const shipEl = document.createElement('div');
    shipEl.style.transform = `rotate(${shipPosition.angle}deg)`;
    shipEl.innerHTML = ReactDOMServer.renderToString(<Ship className="w-6 h-6 text-accent drop-shadow-lg" />);

    const coordinates: LngLatLike = [shipPosition.x, shipPosition.y];

    if (!shipMarker.current) {
      shipMarker.current = new mapboxgl.Marker(shipEl)
        .setLngLat(coordinates)
        .addTo(map.current);
    } else {
      shipMarker.current.setLngLat(coordinates);
      shipMarker.current.getElement().style.transform = `rotate(${shipPosition.angle}deg)`;
    }

  }, [mapLoaded, shipPosition]);

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-2">
        <div ref={mapContainer} className="relative w-full aspect-[10/6] bg-muted/20 rounded-md overflow-hidden" data-ai-hint="world map">
          {!MAPBOX_TOKEN && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
              <TriangleAlert className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-destructive">Map Not Configured</h3>
              <p className="text-sm text-muted-foreground">
                Please provide a Mapbox access token in your environment variables to display the map.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
