
import { INotification } from "@/utils/interfaces";
import { createSlice } from "@reduxjs/toolkit";

export type NotificationsState = {
    notifications: INotification[];
}

const initialState: NotificationsState = {
    notifications: [],
}

export const notificationsSlice = createSlice({
    name: 'notificationsSlice',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        clearNotifications: (state, action) => {
            state.notifications = [];
        }
    }
})

export const {
    setNotifications,
    clearNotifications,
} = notificationsSlice.actions;