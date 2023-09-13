import { Backdrop, CircularProgress, Stack, Typography } from '@mui/material';
import { ReadyState } from 'react-use-websocket';

function EstablishConnexion(props: { readyState: ReadyState }) {
  return (
    <Backdrop
      open={props.readyState !== ReadyState.OPEN}
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="body1">Connexion...</Typography>
      </Stack>
    </Backdrop>
  );
}

export default EstablishConnexion