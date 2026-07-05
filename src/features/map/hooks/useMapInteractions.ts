import { useEffect, useRef } from 'react';
import type { Map as MapboxMap, MapMouseEvent } from 'mapbox-gl';
import { useAppDispatch } from '@/app/hooks';
import { markerAdded } from '@/features/map/slice/markersSlice';
import { DRAW_MODE, type DrawMode, type LngLat } from '@/features/map/slice/types';

/**
 * Handles map interactions for drawing tools.
 *
 * - Click: adds markers when marker mode is active
 *
 * Uses refs to always access the latest mode and draft state without
 * re-registering Mapbox event listeners on every render.
 * This avoids stale closure issues with Mapbox event handlers.
 */
export function useMapInteractions(
  mapRef: React.RefObject<MapboxMap | null>,
  mode: DrawMode,
  draftVertices: LngLat[],
) {
  const dispatch = useAppDispatch();
  const modeRef = useRef(mode);
  const draftRef = useRef(draftVertices);
  modeRef.current = mode;
  draftRef.current = draftVertices;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;

    const handleMapClick = (e: MapMouseEvent) => {
      const coords: LngLat = [e.lngLat.lng, e.lngLat.lat];
      if (modeRef.current === DRAW_MODE.MARKER) {
        dispatch(markerAdded(coords));
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [mapRef, dispatch]);

  // Reflect the active tool in the cursor.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = mode === DRAW_MODE.IDLE ? '' : 'crosshair';
  }, [mapRef, mode]);
}
