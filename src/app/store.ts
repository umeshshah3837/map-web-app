import { configureStore } from '@reduxjs/toolkit';
import markersReducer from '@/features/map/slice/markersSlice';
import mapUiReducer from '@/features/map/slice/mapStateSlice';
export const store = configureStore({
  reducer: {
    markers: markersReducer,
    mapUi: mapUiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
