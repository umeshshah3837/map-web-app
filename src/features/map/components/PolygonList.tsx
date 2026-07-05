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
import { polygonRemoved, polygonSelected } from '@/features/map/slice/polygonSlice';
function formatArea(sqMeters: number): string {
  if (sqMeters >= 1_000_000) return `${(sqMeters / 1_000_000).toFixed(2)} km²`;
  return `${Math.round(sqMeters).toLocaleString()} m²`;
}

const PolygonList = () => {
  const dispatch = useAppDispatch();
  const polygons = useAppSelector((s) => s.polygons.items);
  const selectedId = useAppSelector((s) => s.polygons.selectedId);

  if (polygons.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No polygons yet. Choose “Add Vertix”, click to place vertices, then Finish.
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {polygons.map((p, i) => (
        <ListItemButton
          key={p.id}
          selected={selectedId === p.id}
          onClick={() => dispatch(polygonSelected(p.id))}
          sx={{ borderRadius: 1, mb: 0.5 }}
        >
          <Stack
            sx={{ flexDirection: 'row', alignItems: 'center', width: '100%', minWidth: 0, gap: 1 }}
          >
            <Chip label={`P${i + 1}`} size="small" color="secondary" sx={{ fontWeight: 600 }} />
            <ListItemText
              primary={`${p.vertices.length} vertices · ${formatArea(p.areaSqMeters)}`}
            />
            <IconButton
              size="small"
              aria-label={`Remove polygon ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(polygonRemoved(p.id));
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

export default PolygonList;
