export type LngLat = [number, number];

export interface MarkerFeature {
  id: string;
  coordinates: LngLat;
  createdAt: number;
  label?: string;
}
export const DRAW_MODE = {
  IDLE: 'idle',
  MARKER: 'marker',
  POLYGON: 'polygon',
} as const;

export type DrawMode = (typeof DRAW_MODE)[keyof typeof DRAW_MODE];
