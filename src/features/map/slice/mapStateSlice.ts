import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type DrawMode } from '@/features/map/slice/types';
import { DRAW_MODE } from '@/features/map/constants';

export interface MapUiState {
  mode: DrawMode;
  sidebarOpen: boolean;
}

const initialState: MapUiState = {
  mode: DRAW_MODE.IDLE,
  sidebarOpen: false,
};

const mapStateSlice = createSlice({
  name: 'mapUi',
  initialState,
  reducers: {
    modeSet(state, action: PayloadAction<DrawMode>) {
      state.mode = action.payload;
    },
    sidebarOpenSet(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { modeSet, sidebarOpenSet } = mapStateSlice.actions;
export default mapStateSlice.reducer;
