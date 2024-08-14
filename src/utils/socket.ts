import { io, Socket } from 'socket.io-client';

let socket: Socket | null;

export const initializeSocket = (userId: string) => {
    if (!socket) {
        socket = io('http://localhost:3001', {
            transports: ["websocket"],
            query: { id: userId },
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};