import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DRAW_MODE, type DrawMode } from '@/features/map/slice/types';

export interface MapUiState {
  mode: DrawMode;
}

const initialState: MapUiState = {
  mode: DRAW_MODE.IDLE,
};

const mapStateSlice = createSlice({
  name: 'mapUi',
  initialState,
  reducers: {
    modeSet(state, action: PayloadAction<DrawMode>) {
      state.mode = action.payload;
    },
  },
});

export const { modeSet } = mapStateSlice.actions;
export default mapStateSlice.reducer;
