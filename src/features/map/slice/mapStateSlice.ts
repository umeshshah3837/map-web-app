import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DrawMode } from '@/features/map/slice/types';
import { DRAW_MODE } from '@/features/map/constants';

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
