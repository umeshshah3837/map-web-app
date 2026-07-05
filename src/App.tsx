import { Box } from '@mui/material';
import MapView from '@/features/map/components/MapView';
import MapToolbar from '@/features/map/components/MapToolbar';
import Sidebar from '@/features/map/components/Sidebar';
import './App.css';
function App() {
  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <MapToolbar />
      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <MapView />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
