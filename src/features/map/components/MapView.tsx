import { useRef } from 'react';
import { Box } from '@mui/material';
import { useMapboxMap } from '@/features/map/hooks/useMapboxView';
import { useAppSelector } from '@/app/hooks';
import { useMarkerLayer } from '@/features/map/hooks/useMarkerLayer';
import { useMapInteractions } from '@/features/map/hooks/useMapInteractions';

/**
 * Renders the Mapbox canvas
 */
const MapView = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mapRef } = useMapboxMap(containerRef);
  const markers = useAppSelector((s) => s.markers.items);
  const selectedMarkerId = useAppSelector((s) => s.markers.selectedId);
  const mode = useAppSelector((s) => s.mapUi.mode);
  useMarkerLayer(mapRef, markers, selectedMarkerId);
  useMapInteractions(mapRef, mode, []);
  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        ref={containerRef}
        component="div"
        role="application"
        aria-label="Interactive survey map"
        sx={{ width: '100%', height: '100%' }}
      />
    </Box>
  );
};
export default MapView;
