import { RootState } from "../store";
import { INotification } from "@/utils/interfaces";

export const selectNotifications = (state: RootState): INotification[] => state.notifications.notifications;

export const selectIsFetchingNotifications = (state: RootState): boolean => state.notifications.isFetching;