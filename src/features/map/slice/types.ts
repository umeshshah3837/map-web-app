import type { DRAW_MODE } from '@/features/map/constants';

export type LngLat = [number, number];

export interface MarkerFeature {
  id: string;
  coordinates: LngLat;
  createdAt: number;
  label?: string;
}

export type DrawMode = (typeof DRAW_MODE)[keyof typeof DRAW_MODE];

export interface PolygonFeature {
  id: string;
  vertices: LngLat[];
  areaSqMeters: number; //Computed via Turf.js, in square meters.
  createdAt: number;
  label?: string;
}

export interface ParsedGeoJson {
  markers: MarkerFeature[];
  polygons: PolygonFeature[];
}
