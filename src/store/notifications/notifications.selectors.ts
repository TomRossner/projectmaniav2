import { RootState } from "../store";
import { INotification } from "@/utils/interfaces";

export const selectINotifications = (state: RootState): INotification[] => state.notifications.notifications;