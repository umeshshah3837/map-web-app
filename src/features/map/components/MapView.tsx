import { useRef } from 'react';
import { Box } from '@mui/material';
import { useMapboxMap } from '@/features/map/hooks/useMapboxView';
/**
 * Renders the Mapbox canvas
 */
export default function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { mapRef } = useMapboxMap(containerRef);

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
}
