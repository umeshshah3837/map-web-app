import { configureStore } from '@reduxjs/toolkit';
import markersReducer from '@/features/map/slice/markersSlice';
import mapUiReducer from '@/features/map/slice/mapStateSlice';
import polygonReducer from '@/features/map/slice/polygonSlice';

export const store = configureStore({
  reducer: {
    markers: markersReducer,
    mapUi: mapUiReducer,
    polygons: polygonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
