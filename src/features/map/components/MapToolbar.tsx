import {
  AppBar,
  Toolbar as MuiToolbar,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PentagonOutlinedIcon from '@mui/icons-material/PentagonOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import UndoIcon from '@mui/icons-material/Undo';

import CheckIcon from '@mui/icons-material/Check';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { modeSet, sidebarOpenSet } from '@/features/map/slice/mapStateSlice';
import { type DrawMode } from '@/features/map/slice/types';
import { DRAW_MODE } from '@/features/map/constants';
import { SIDEBAR_WIDTH } from '@/features/map/constants';
import {
  draftCleared,
  draftCommitted,
  draftVertexRemovedLast,
} from '@/features/map/slice/polygonSlice';
const MapToolbar = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.mapUi.mode);
  const sidebarOpen = useAppSelector((s) => s.mapUi.sidebarOpen);
  const draftVertices = useAppSelector((s) => s.polygons.draftVertices);
  const handleModeChange = (_e: React.MouseEvent<HTMLElement>, next: DrawMode | null) => {
    // ToggleButtonGroup passes null when the active button is clicked again
    const nextMode = next ?? DRAW_MODE.IDLE;
    if (mode === DRAW_MODE.POLYGON && nextMode !== DRAW_MODE.POLYGON && draftVertices.length > 0) {
      dispatch(draftCleared());
    }
    dispatch(modeSet(nextMode));
  };
  const finishPolygon = () => {
    if (draftVertices.length < 3) return;
    dispatch(draftCommitted(draftVertices));
    dispatch(modeSet(DRAW_MODE.IDLE));
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: {
          md: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
        },
        ml: {
          md: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
        },
        borderBottom: '1px solid',
        borderColor: 'rgba(255,255,255,0.12)',
      }}
    >
      <MuiToolbar
        variant="dense"
        sx={{ gap: 1, flexWrap: 'wrap', py: 1, justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open sidebar"
            onClick={() => dispatch(sidebarOpenSet(true))}
          >
            <MenuIcon />
          </IconButton>
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
          {mode === 'polygon' && (
            <>
              <Tooltip title="Remove the last point placed">
                <span>
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<UndoIcon />}
                    disabled={draftVertices.length === 0}
                    onClick={() => dispatch(draftVertexRemovedLast())}
                  >
                    Undo
                  </Button>
                </span>
              </Tooltip>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                disabled={draftVertices.length < 3}
                onClick={finishPolygon}
              >
                Finish ({draftVertices.length} pts)
              </Button>
            </>
          )}
        </Box>
      </MuiToolbar>
    </AppBar>
  );
};

export default MapToolbar;
