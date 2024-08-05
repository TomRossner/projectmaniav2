
import { getUserNotifications } from "@/services/notifications.api";
import { INotification } from "@/utils/interfaces";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type NotificationsState = {
    notifications: INotification[];
}

const initialState: NotificationsState = {
    notifications: [],
}

// export const fetchNotificationsAsync = createAsyncThunk('projectsSlice/fetchNotificationsAsync', async (userId: string) => {
//     try {
//         const {data} = await getUserNotifications(userId);
//         return data;
//     } catch (error) {
//         handleError(error as AxiosError<ErrorData>);
//     }
// })

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