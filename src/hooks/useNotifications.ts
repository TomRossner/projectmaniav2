import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectINotifications } from '@/store/notifications/notifications.selectors';
import { INotification, NewNotificationData } from '@/utils/interfaces';
import { setNotifications } from '@/store/notifications/notifications.slice';
import { removeNotification } from '@/services/notifications.api';
import useAuth from './useAuth';
import { updateUserData } from '@/services/user.api';
import { IUser } from '@/store/auth/auth.slice';
import { setErrorMsg } from '@/store/error/error.slice';
import { NotificationData } from '@/utils/types';
import { IProject } from '@/store/projects/projects.slice';

const useNotifications = () => {
    const notifications = useAppSelector(selectINotifications);
    const {user} = useAuth();
    
    const isProject = (data: NotificationData): data is Pick<IProject, "projectId" | "title"> => {
      return (data as Pick<IProject, "projectId" | "title">).title !== undefined;
    }

    const memoizedNotifications = useMemo(() => {
      return notifications.reduce((acc: INotification[], curr: INotification) => {
        const existingNotificationIndex = acc.findIndex(notification =>
          (isProject(notification.data) && isProject(curr.data)) &&
          notification.data?.projectId === curr.data.projectId
        );
    
        if (existingNotificationIndex !== -1) {
          const existingNotification = acc[existingNotificationIndex];
          const existingDate = new Date(existingNotification.createdAt);
          const currentDate = new Date(curr.createdAt);
    
          // Keep the latest notification based on the createdAt value
          if (currentDate > existingDate) {
            acc[existingNotificationIndex] = curr;
          }
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);
    } , [notifications]);

    const dispatch = useAppDispatch();

    const handleRemoveNotification = useCallback(async (notificationId: string) => {
      if (!user) {
        dispatch(setErrorMsg('Failed removing notification'));
        return;
      }

      const updatedUserData = {
        ...user,
        notifications: [
          ...user.notifications.filter(n => n !== notificationId)
        ] as string[],
      } as IUser;

      try {
        await removeNotification(notificationId);

        dispatch(setNotifications([
          ...notifications.filter(n => n.notificationId !== notificationId)
        ]));

        await updateUserData(updatedUserData);
        
      } catch (error) {
        dispatch(setErrorMsg('Failed removing notification'));
        return;
      }
    }, [user, notifications, dispatch]);

    const createNotification = (newNotificationData: NewNotificationData): NewNotificationData => {
      const {
        data,
        sender,
        recipient,
        type
      } = newNotificationData;
    
      return {
        data,
        sender,
        recipient,
        type
      }
    }
    
    const getUpdatedNotificationsIds = (notificationsIds: string[], notifications: INotification[]): string[] => {
      return notificationsIds.filter(n => notifications.some(not => not.notificationId === n));
    }

  return {
    notifications: memoizedNotifications,
    handleRemoveNotification,
    createNotification,
    getUpdatedNotificationsIds,
    isProject,
  }
}

export default useNotifications;