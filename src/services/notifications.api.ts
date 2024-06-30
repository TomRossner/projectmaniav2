import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = 'http://localhost:3001';

const getUserNotifications = async (notificationsIds: string[]): Promise<AxiosResponse> =>
    await axios.post(`/notifications/all`, {notificationsIds});

const updateNotificationIsSeen = async (notificationId: string, bool: boolean): Promise<AxiosResponse | void> =>
    await axios.put(`/notifications/${notificationId}/is-seen`, {isSeen: bool});

export {
    getUserNotifications,
    updateNotificationIsSeen
}
