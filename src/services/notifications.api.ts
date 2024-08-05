import { INotification, NewNotificationData } from "@/utils/interfaces";
import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const getUserNotifications = async (userId: string): Promise<AxiosResponse> =>
    await axios.get(`/notifications`, {
        params: {
            userId
        }
    });

const createNotification = async (newNotificationData: NewNotificationData) => {
    return await axios.post('/notifications', newNotificationData);
}

const updateNotification = async (notification: INotification): Promise<AxiosResponse | void> =>
    await axios.put(`/notifications/${notification.notificationId}`, notification);

const removeNotification = async (notificationId: string): Promise<AxiosResponse> =>
    await axios.delete(`/notifications/${notificationId}`);

export {
    getUserNotifications,
    updateNotification,
    removeNotification,
    createNotification,
}
