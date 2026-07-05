import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { MarkerFeature, LngLat } from '@/features/map/slice/types';

export interface MarkersState {
  items: MarkerFeature[];
  /** id of the marker currently selected in the sidebar / map, if any */
  selectedId: string | null;
}

const initialState: MarkersState = {
  items: [],
  selectedId: null,
};

const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    /** Add a marker at the given coordinates from a map click */
    markerAdded: {
      reducer(state, action: PayloadAction<MarkerFeature>) {
        state.items.push(action.payload);
        state.selectedId = action.payload.id;
      },
      prepare(coordinates: LngLat) {
        return {
          payload: {
            id: uuidv4(),
            coordinates,
            createdAt: Date.now(),
          } satisfies MarkerFeature,
        };
      },
    },

    markerSelected(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    markerRemoved(state, action: PayloadAction<string>) {
      state.items = state.items.filter((m) => m.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    },
    markersLoaded(state, action: PayloadAction<MarkerFeature[]>) {
      state.items = action.payload;
      state.selectedId = null;
    },
    allMarkersCleared(state) {
      state.items = [];
      state.selectedId = null;
    },
  },
});

export const { markerAdded, markerSelected, markerRemoved, markersLoaded, allMarkersCleared } =
  markersSlice.actions;

export default markersSlice.reducer;
