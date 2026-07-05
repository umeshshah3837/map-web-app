import { Button, type ButtonProps } from '@mui/material';

const MPButton = (props: ButtonProps) => {
  return <Button variant={props.variant ?? 'contained'} disableElevation {...props} />;
};
export default MPButton;
