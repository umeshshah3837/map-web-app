import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useAppDispatch } from '@/app/hooks';
import { markerSelected } from '@/features/map/slice/markersSlice';
import type { MarkerFeature } from '@/features/map/slice/types';

/**
 * Keeps `mapboxgl.Marker` DOM objects on the map in sync with the
 * `markers` array from Redux: adds new ones, removes deleted ones,
 * and toggles a "selected" class on click.
 */
export function useMarkerLayer(
  mapRef: React.RefObject<mapboxgl.Map | null>,
  markers: MarkerFeature[],
  selectedMarkerId: string | null,
) {
  const dispatch = useAppDispatch();
  const markerObjectsRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  // Add / remove marker DOM objects as the underlying data changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const existing = markerObjectsRef.current;

    for (const [id, markerObj] of existing) {
      if (!markers.find((m) => m.id === id)) {
        markerObj.remove();
        existing.delete(id);
      }
    }

    for (const m of markers) {
      if (existing.has(m.id)) continue;
      const el = document.createElement('div');
      el.className = 'map-marker-pin';
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 20,
      }).setHTML(`
    <strong>Coordinates</strong><br/>
    Lat: ${m.coordinates[1].toFixed(6)}<br/>
    Lng: ${m.coordinates[0].toFixed(6)}
  `);

      el.addEventListener('mouseenter', () => {
        popup.setLngLat(m.coordinates).addTo(map);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
      const markerObj = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(m.coordinates)
        .addTo(map);
      el.addEventListener('click', (evt) => {
        evt.stopPropagation();
        dispatch(markerSelected(m.id));
      });
      existing.set(m.id, markerObj);
    }
  }, [mapRef, markers, dispatch]);

  // Reflect the current selection with a CSS class
  useEffect(() => {
    for (const [id, markerObj] of markerObjectsRef.current) {
      markerObj.getElement().classList.toggle('map-marker-pin--selected', id === selectedMarkerId);
    }
  }, [selectedMarkerId]);
}
