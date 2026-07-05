import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { INITIAL_CENTER, INITIAL_ZOOM, MAP_STYLE } from '@/constant';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN ?? '';

/**
 * Creates a Mapbox GL map instance scoped to the given container ref,
 * and Returns a ref to the live `mapboxgl.Map` instance.
 */
export function useMapboxMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: true }), 'top-right');
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return { mapRef };
}
