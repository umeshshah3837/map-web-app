import {
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Chip,
  Typography,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { markerRemoved, markerSelected } from '@/features/map/slice/markersSlice';

const MarkerList = () => {
  const dispatch = useAppDispatch();
  const markers = useAppSelector((s) => s.markers.items);
  const selectedId = useAppSelector((s) => s.markers.selectedId);

  if (markers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No markers yet. Choose “Add Marker”, then click the map.
      </Typography>
    );
  }
  console.log('markers', markers);

  return (
    <List dense disablePadding>
      {markers.map((m, i) => (
        <ListItemButton
          key={m.id}
          selected={selectedId === m.id}
          onClick={() => dispatch(markerSelected(m.id))}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <Stack
            spacing={1}
            sx={{ direction: 'row', alignItems: 'center', width: '100%', minWidth: 0 }}
          >
            <Chip label={`M${i + 1}`} size="small" color="primary" sx={{ fontWeight: 600 }} />
            <ListItemText
              primary={`${m.coordinates[1].toFixed(5)}, ${m.coordinates[0].toFixed(5)}`}
            />
            <IconButton
              size="small"
              aria-label={`Remove marker ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(markerRemoved(m.id));
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </ListItemButton>
      ))}
    </List>
  );
};

export default MarkerList;
