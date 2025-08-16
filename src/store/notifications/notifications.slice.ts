
import { getUserNotifications } from "@/services/notifications.api";
import { INotification } from "@/utils/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type NotificationsState = {
    notifications: INotification[];
    isFetching: boolean;
}

const initialState: NotificationsState = {
    notifications: [],
    isFetching: false,
}

export const fetchNotificationsAsync = createAsyncThunk('projectsSlice/fetchNotificationsAsync', async (userId: string) => {
    try {
        const {data: notifications} = await getUserNotifications(userId);
        return notifications;
    } catch (error) {
        console.error(error);
        throw error;
    }
})

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotificationsAsync.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.isFetching = false;
            })
            .addCase(fetchNotificationsAsync.pending, (state, action) => {
                state.isFetching = true;
            })
            .addCase(fetchNotificationsAsync.rejected, (state, action) => {
                state.isFetching = false;
                state.notifications = state.notifications;
            })
    }
})

export const {
    setNotifications,
    clearNotifications,
} = notificationsSlice.actions;