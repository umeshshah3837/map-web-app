import { Box } from '@mui/material';
import MapView from '@/features/map/components/MapView';
import './App.css';
function App() {
  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Box component="main" sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <MapView />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
