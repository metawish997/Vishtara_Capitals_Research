import { io } from 'socket.io-client';
import { BASE_URL } from './api';

const SOCKET_URL = BASE_URL;

const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling']
});

export default socket;
