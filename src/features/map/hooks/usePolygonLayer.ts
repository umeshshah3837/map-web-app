import { useEffect } from 'react';
import type { Map as MapboxMap, GeoJSONSource } from 'mapbox-gl';
import { useAppDispatch } from '@/app/hooks';
import { polygonSelected } from '@/features/map/slice/polygonSlice';
import type { LngLat, PolygonFeature } from '@/features/map/slice/types';
const DRAFT_SOURCE_ID = 'draft-polygon';
const POLYGONS_SOURCE_ID = 'saved-polygons';

/** Builds the GeoJSON shown while the user is actively placing polygon vertices. */
function buildDraftGeoJson(vertices: LngLat[]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = vertices.map((coord, i) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: coord },
    properties: { vertexIndex: i },
  }));

  if (vertices.length >= 2) {
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: vertices },
      properties: {},
    });
  }
  if (vertices.length >= 3) {
    features.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [[...vertices, vertices[0]]] },
      properties: {},
    });
  }
  return { type: 'FeatureCollection', features };
}

function formatArea(sqMeters: number): string {
  if (sqMeters >= 1_000_000) return `${(sqMeters / 1_000_000).toFixed(2)} km²`;
  return `${Math.round(sqMeters).toLocaleString()} m²`;
}

/**
 * Owns the two GeoJSON sources/layer sets used to render polygons:
 * one for the in-progress draft (dashed preview), one for committed
 * polygons (filled, with an area label).
 */
export function usePolygonLayers(
  mapRef: React.RefObject<MapboxMap | null>,
  draftVertices: LngLat[],
  polygons: PolygonFeature[],
) {
  const dispatch = useAppDispatch();

  // One-time layer setup, run once the map's style is ready.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setupLayers = () => {
      if (map.getSource(DRAFT_SOURCE_ID)) return; // already set up (e.g. StrictMode double-invoke)

      map.addSource(DRAFT_SOURCE_ID, { type: 'geojson', data: buildDraftGeoJson([]) });
      map.addLayer({
        id: 'draft-fill',
        type: 'fill',
        source: DRAFT_SOURCE_ID,
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'fill-color': '#2F5DE3', 'fill-opacity': 0.15 },
      });
      map.addLayer({
        id: 'draft-line',
        type: 'line',
        source: DRAFT_SOURCE_ID,
        filter: ['!=', ['geometry-type'], 'Point'],
        paint: { 'line-color': '#2F5DE3', 'line-width': 2, 'line-dasharray': [2, 1.5] },
      });
      map.addLayer({
        id: 'draft-points',
        type: 'circle',
        source: DRAFT_SOURCE_ID,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 5,
          'circle-color': '#ffffff',
          'circle-stroke-color': '#2F5DE3',
          'circle-stroke-width': 2,
        },
      });

      map.addSource(POLYGONS_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'polygons-fill',
        type: 'fill',
        source: POLYGONS_SOURCE_ID,
        paint: { 'fill-color': '#C4F135', 'fill-opacity': 0.25 },
      });
      map.addLayer({
        id: 'polygons-outline',
        type: 'line',
        source: POLYGONS_SOURCE_ID,
        paint: { 'line-color': '#3A4550', 'line-width': 2 },
      });
      map.addLayer({
        id: 'polygons-label',
        type: 'symbol',
        source: POLYGONS_SOURCE_ID,
        layout: {
          'text-field': ['get', 'areaLabel'],
          'text-size': 12,
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
        },
        paint: { 'text-color': '#14181B', 'text-halo-color': '#ffffff', 'text-halo-width': 1.5 },
      });

      map.on('click', 'polygons-fill', (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) dispatch(polygonSelected(id));
      });
      map.on('mouseenter', 'polygons-fill', () => (map.getCanvas().style.cursor = 'pointer'));
      map.on('mouseleave', 'polygons-fill', () => (map.getCanvas().style.cursor = ''));
    };

    if (map.isStyleLoaded()) setupLayers();
    else map.on('load', setupLayers);

    return () => {
      map.off('load', setupLayers);
    };
  }, [mapRef, dispatch]);

  // Keep the draft source's data current.
  useEffect(() => {
    const source = mapRef.current?.getSource(DRAFT_SOURCE_ID) as GeoJSONSource | undefined;
    source?.setData(buildDraftGeoJson(draftVertices));
  }, [mapRef, draftVertices]);

  // Keep the committed-polygons source's data current.
  useEffect(() => {
    const source = mapRef.current?.getSource(POLYGONS_SOURCE_ID) as GeoJSONSource | undefined;
    if (!source) return;
    const fc: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: polygons.map((p) => ({
        type: 'Feature',
        id: p.id,
        geometry: { type: 'Polygon', coordinates: [[...p.vertices, p.vertices[0]]] },
        properties: { id: p.id, areaLabel: formatArea(p.areaSqMeters) },
      })),
    };
    source.setData(fc);
  }, [mapRef, polygons]);
}
