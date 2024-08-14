import { createSlice } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';

type SocketState = {
    socket: Socket | null;
}

const initialState: SocketState = {
    socket: null,
}

export const socketSlice = createSlice({
    name: 'socketSlice',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        clearSocket: (state) => {
            if (state.socket) {
                state.socket.close();
            }
            state.socket = null;
        },
    },
});

export const { setSocket, clearSocket } = socketSlice.actions;