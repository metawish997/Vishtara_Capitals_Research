import { io } from 'socket.io-client';

const SOCKET_URL = 'https://vishtaracapitalsresearch.com';

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

export default socket;
