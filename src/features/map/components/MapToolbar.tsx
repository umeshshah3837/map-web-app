import { AppBar, Toolbar as MuiToolbar, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { modeSet } from '@/features/map/slice/mapStateSlice';
import { type DrawMode } from '@/features/map/slice/types';
import { DRAW_MODE } from '@/features/map/constants';

const MapToolbar = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.mapUi.mode);
  const handleModeChange = (_e: React.MouseEvent<HTMLElement>, next: DrawMode | null) => {
    // ToggleButtonGroup passes null when the active button is clicked again
    const nextMode = next ?? 'idle';
    dispatch(modeSet(nextMode));
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'rgba(255,255,255,0.12)',
      }}
    >
      <MuiToolbar
        variant="dense"
        sx={{ gap: 1, flexWrap: 'wrap', py: 1, justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={mode === 'idle' ? null : mode}
            exclusive
            size="small"
            onChange={handleModeChange}
          >
            <ToggleButton value={DRAW_MODE.MARKER} sx={{ color: 'inherit', gap: 0.5 }}>
              <PlaceIcon fontSize="small" /> Add Marker
            </ToggleButton>
            <ToggleButton value={DRAW_MODE.POLYGON} sx={{ color: 'inherit', gap: 0.5 }}>
              <PentagonOutlinedIcon fontSize="small" /> Add Vertix
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </MuiToolbar>
    </AppBar>
  );
};

export default MapToolbar;
