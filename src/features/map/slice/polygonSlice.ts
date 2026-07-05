import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import * as turf from '@turf/turf';
import type { PolygonFeature, LngLat } from './types';

export interface PolygonsState {
  items: PolygonFeature[];
  /** Vertices of the polygon currently being drawn (not yet committed). */
  draftVertices: LngLat[];
  selectedId: string | null;
}

const initialState: PolygonsState = {
  items: [],
  draftVertices: [],
  selectedId: null,
};

/** Computes polygon area in square meters using Turf.js. Requires >= 3 vertices. */
function computeAreaSqMeters(vertices: LngLat[]): number {
  if (vertices.length < 3) return 0;
  const ring = [...vertices, vertices[0]]; // GeoJSON polygons must close the ring
  const polygon = turf.polygon([ring]);
  return turf.area(polygon);
}

const polygonsSlice = createSlice({
  name: 'polygons',
  initialState,
  reducers: {
    /** Add a vertex to the polygon currently being drawn. */
    draftVertexAdded(state, action: PayloadAction<LngLat>) {
      state.draftVertices.push(action.payload);
    },
    /** Remove the most recently added draft vertex (undo last click). */
    draftVertexRemovedLast(state) {
      state.draftVertices.pop();
    },
    /** Discard the in-progress polygon without saving it. */
    draftCleared(state) {
      state.draftVertices = [];
    },
    /** Finalize the draft into a saved polygon, computing its area. */
    draftCommitted: {
      reducer(state, action: PayloadAction<PolygonFeature>) {
        state.items.push(action.payload);
        state.draftVertices = [];
        state.selectedId = action.payload.id;
      },
      prepare(vertices: LngLat[]) {
        return {
          payload: {
            id: uuidv4(),
            vertices,
            areaSqMeters: computeAreaSqMeters(vertices),
            createdAt: Date.now(),
          } satisfies PolygonFeature,
        };
      },
    },
    polygonRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    },
    polygonSelected(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    polygonsLoaded(state, action: PayloadAction<PolygonFeature[]>) {
      state.items = action.payload;
      state.draftVertices = [];
      state.selectedId = null;
    },
    allPolygonsCleared(state) {
      state.items = [];
      state.draftVertices = [];
      state.selectedId = null;
    },
  },
});

export const {
  draftVertexAdded,
  draftVertexRemovedLast,
  draftCleared,
  draftCommitted,
  polygonRemoved,
  polygonSelected,
  polygonsLoaded,
  allPolygonsCleared,
} = polygonsSlice.actions;

export default polygonsSlice.reducer;
