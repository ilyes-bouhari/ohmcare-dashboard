import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MemoryIcon from '@mui/icons-material/Memory';
import { AppBar, Box, Chip, Collapse, Container, IconButton, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Toolbar, Typography } from '@mui/material';
import { Fragment, useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useFetch } from 'usehooks-ts';
import EstablishConnexion from './components/EstablishConnexion';
import TableHead from './components/TableHead';
import { PayloadsContext } from './contexts/PayloadsContext';
import { PayloadState } from './enums';
import { payloadState } from './helpers';

const roomColumns: readonly Column[] = [
  { id: 'collapse', label: '', bg: '#f5f5f5' },
  { id: 'id', label: 'ID', align: 'center', minWidth: 100, bg: '#f5f5f5' },
  { id: 'number', label: 'number', align: 'center', minWidth: 100, bg: '#f5f5f5' },
]

const deviceColumns: readonly Column[] = [
  { id: 'id', label: 'ID', align: 'center', minWidth: 80 },
  { id: 'serial_number', label: 'serial number', align: 'center', minWidth: 100 },
  { id: 'status', label: 'status', align: 'center', minWidth: 100 },
]

function App() {
  const {
    lastJsonMessage,
    readyState,
  }: {
    lastJsonMessage: PresencePayload | FallPayload;
    readyState: ReadyState;
  } = useWebSocket(import.meta.env.VITE_WS_URL, {
    shouldReconnect: () => true,
    retryOnError: true,
  });
  const { data } = useFetch<Room[]>(import.meta.env.VITE_API_URL, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
  });
  const [payloads, setPayloads] = useState<Payloads>();

  useEffect(() => {
    if (!lastJsonMessage) return;

    setPayloads({
      ...payloads,
      [lastJsonMessage.payload.deviceId]: lastJsonMessage,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  return (
    <Fragment>
      <AppBar position='fixed'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <MemoryIcon sx={{ mr: 1 }} />
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1 }}
            >
              Ohmcare
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component='main' sx={{ pt: 10 }} maxWidth='lg'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead columns={roomColumns} />
            <TableBody>
              <PayloadsContext.Provider value={payloads}>
                {data?.map((room: Room) => (
                  <Row key={room._id} room={room} />
                ))}
                {!data && (
                  <TableRow>
                    {roomColumns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        <Skeleton animation='wave' variant='text' />
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </PayloadsContext.Provider>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <EstablishConnexion readyState={readyState} />
    </Fragment>
  );
}

function Row(props: { room: Room }) {
  const { room } = props
  const payloads = useContext(PayloadsContext)
  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{room._id}</TableCell>
        <TableCell align="center">{room.number}</TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Devices
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="purchases">
                  <TableHead columns={deviceColumns} />
                  <TableBody>
                    {room.devices.map((device: Device) => {
                      const state = payloadState(payloads, device)

                      const stateLabel = {
                        [PayloadState.UNKNOWN]: 'N/A',
                        [PayloadState.PRESENCE]: 'Presence',
                        [PayloadState.FALL]: 'Fall',
                      }[state]

                      const stateColor = {
                        [PayloadState.UNKNOWN]: 'default',
                        [PayloadState.PRESENCE]: 'success',
                        [PayloadState.FALL]: 'error',
                      }[state] as 'default' | 'success' | 'error'

                      return (
                        <TableRow hover key={device._id}>
                          <TableCell align="center">{device._id}</TableCell>
                          <TableCell align="center">{device.serialProduct}</TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={<MemoryIcon />}
                              label={stateLabel}
                              color={stateColor}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {room.devices.length === 0 && (<TableRow>
                      <TableCell align="center" colSpan={10}>
                        <Stack direction="row" justifyContent="center" spacing={0.5} alignItems="center">
                          <Typography variant="body2">No</Typography>
                          <Chip
                            icon={<MemoryIcon />}
                            label="device"
                            color="default"
                            size="small"
                          />
                          <Typography variant="body2">found for this room.</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default App
