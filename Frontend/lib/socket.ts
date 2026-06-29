import { io, Socket } from 'socket.io-client';
import { api } from '../constants/api';
import { useAuthStore } from '../store/auth.store';

export const socket: Socket = io(api.BASE_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export function connectSocket(token: string) {
  socket.auth = { token };
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

useAuthStore.subscribe((state, prevState) => {
  if (state.token && state.token !== prevState.token) {
    connectSocket(state.token);
  } else if (!state.token && prevState.token) {
    disconnectSocket();
  }
});
