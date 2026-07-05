import { v4 as uuidv4 } from 'uuid';
import * as turf from '@turf/turf';
// import type { LngLat, MarkerFeature, PolygonFeature } from '@/types';
import type {
  LngLat,
  MarkerFeature,
  ParsedGeoJson,
  PolygonFeature,
} from '@/features/map/slice/types';

/**
 * Converts the app's markers + polygons into a single standard
 * GeoJSON FeatureCollection so it can be opened in QGIS, geojson.io, etc.
 */
export function toFeatureCollection(
  markers: MarkerFeature[],
  polygons: PolygonFeature[],
): GeoJSON.FeatureCollection {
  const markerFeatures: GeoJSON.Feature[] = markers.map((m) => ({
    type: 'Feature',
    id: m.id,
    geometry: { type: 'Point', coordinates: m.coordinates },
    properties: { kind: 'marker', id: m.id, createdAt: m.createdAt, label: m.label ?? null },
  }));

  const polygonFeatures: GeoJSON.Feature[] = polygons.map((p) => ({
    type: 'Feature',
    id: p.id,
    geometry: { type: 'Polygon', coordinates: [[...p.vertices, p.vertices[0]]] },
    properties: {
      kind: 'polygon',
      id: p.id,
      createdAt: p.createdAt,
      areaSqMeters: p.areaSqMeters,
      label: p.label ?? null,
    },
  }));

  return {
    type: 'FeatureCollection',
    features: [...markerFeatures, ...polygonFeatures],
  };
}

/** Triggers a browser download of the given GeoJSON as a .geojson file. */
export function downloadFeatureCollection(
  fc: GeoJSON.FeatureCollection,
  filename = 'map-export.geojson',
): void {
  const blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseFeatureCollection(json: unknown): ParsedGeoJson {
  const features: GeoJSON.Feature[] = isFeatureCollection(json)
    ? json.features
    : isFeature(json)
      ? [json]
      : [];

  const markers: MarkerFeature[] = [];
  const polygons: PolygonFeature[] = [];
  let seq = 0;

  for (const feature of features) {
    const geom = feature.geometry;
    if (!geom) continue;

    if (geom.type === 'Point') {
      const coordinates = geom.coordinates as LngLat;
      markers.push({
        id: uuidv4(),
        coordinates,
        createdAt: Date.now() + seq++,
        label: (feature.properties?.label as string | undefined) ?? undefined,
      });
    } else if (geom.type === 'Polygon') {
      // Use the outer ring, dropping the closing point that repeats the first vertex.
      const ring = geom.coordinates[0] as LngLat[];
      const vertices =
        ring.length > 1 && sameCoord(ring[0], ring[ring.length - 1]) ? ring.slice(0, -1) : ring;
      const area = vertices.length >= 3 ? turf.area(turf.polygon([[...vertices, vertices[0]]])) : 0;
      polygons.push({
        id: uuidv4(),
        vertices,
        areaSqMeters: area,
        createdAt: Date.now() + seq++,
        label: (feature.properties?.label as string | undefined) ?? undefined,
      });
    }
  }

  return { markers, polygons };
}

function isFeatureCollection(json: unknown): json is GeoJSON.FeatureCollection {
  return (
    typeof json === 'object' &&
    json !== null &&
    (json as { type?: string }).type === 'FeatureCollection'
  );
}

function isFeature(json: unknown): json is GeoJSON.Feature {
  return (
    typeof json === 'object' && json !== null && (json as { type?: string }).type === 'Feature'
  );
}

function sameCoord(a: LngLat, b: LngLat): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

export function exportGeoJson(markers: MarkerFeature[], polygons: PolygonFeature[]) {
  const fc = toFeatureCollection(markers, polygons);
  downloadFeatureCollection(fc);
}

export async function importGeoJson(file: File): Promise<ParsedGeoJson> {
  const text = await file.text();
  const json = JSON.parse(text);

  return parseFeatureCollection(json);
}
