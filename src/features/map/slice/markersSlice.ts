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
  },
});

export const { markerAdded, markerSelected } = markersSlice.actions;

export default markersSlice.reducer;
