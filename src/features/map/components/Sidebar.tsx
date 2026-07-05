import { Drawer, Box, Typography, Stack, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { sidebarOpenSet } from '@/features/map/slice/mapStateSlice';
import { SIDEBAR_WIDTH } from '@/features/map/constants';
import MarkerList from '@/features/map/components/MarkerList';
import PolygonList from '@/features/map/components/PolygonList';

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const sidebarOpen = useAppSelector((s) => s.mapUi.sidebarOpen);
  const markerCount = useAppSelector((s) => s.markers.items.length);
  const polygonCount = useAppSelector((s) => s.polygons.items.length);
  const close = () => dispatch(sidebarOpenSet(false));

  return (
    <Drawer
      variant={'temporary'}
      anchor="left"
      open={sidebarOpen}
      onClose={close}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: { md: SIDEBAR_WIDTH },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: SIDEBAR_WIDTH },
          boxSizing: 'border-box',
          border: 'none',
          borderRight: { md: '1px solid' },
          borderColor: 'divider',
        },
      }}
    >
      <Box
        component="aside"
        aria-label="Map data panel"
        sx={{ p: 2.5, overflowY: 'auto', height: '100%' }}
      >
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
              Map Web App
            </Typography>
          </Box>

          <IconButton
            aria-label="Close panel and view map"
            color="inherit"
            onClick={close}
            edge="end"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12, mb: 1 }}
          >
            Markers · {markerCount}
          </Typography>
          <MarkerList />
        </Box>

        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 12, mb: 1 }}
          >
            Polygons · {polygonCount}
          </Typography>
          <PolygonList />
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
