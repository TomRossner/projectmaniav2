import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const getUserNotifications = async (notificationsIds: string[]): Promise<AxiosResponse> =>
    await axios.post(`/notifications/all`, {notificationsIds});

const updateNotificationIsSeen = async (notificationId: string, bool: boolean): Promise<AxiosResponse | void> =>
    await axios.put(`/notifications/${notificationId}/is-seen`, {isSeen: bool});

const removeNotification = async (notificationId: string): Promise<AxiosResponse> =>
    await axios.delete(`/notifications/${notificationId}`);

export {
    getUserNotifications,
    updateNotificationIsSeen,
    removeNotification,
}
