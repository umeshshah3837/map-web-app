import type { DRAW_MODE } from '@/features/map/constants';

export type LngLat = [number, number];

export interface MarkerFeature {
  id: string;
  coordinates: LngLat;
  createdAt: number;
  label?: string;
}

export type DrawMode = (typeof DRAW_MODE)[keyof typeof DRAW_MODE];
