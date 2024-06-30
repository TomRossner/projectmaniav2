import { useMemo } from 'react';
import { useAppSelector } from './hooks';
import { selectINotifications } from '@/store/notifications/notifications.selectors';
import { INotification } from '@/utils/interfaces';
import { isProject } from '@/utils/utils';


const useNotifications = () => {
    const notifications = useAppSelector(selectINotifications);

    const memoizedNotifications = useMemo(() => {
      console.log(notifications)
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

    console.log(memoizedNotifications)

  return {
    notifications: memoizedNotifications
  }
}

export default useNotifications;