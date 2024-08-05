'use client'

import Notification from '@/components/Notification';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import React, { useCallback, useEffect } from 'react';
import isAuth from '../ProtectedRoute';
import useNotifications from '@/hooks/useNotifications';
import { IProject, setCurrentProject } from '@/store/projects/projects.slice';
import { INotification } from '@/utils/interfaces';
import useProjects from '@/hooks/useProjects';
import ErrorModal from '@/components/modals/ErrorModal';
import useAuth from '@/hooks/useAuth';
import { IUser, setUser, User } from '@/store/auth/auth.slice';
import LoadingModal from '@/components/modals/LoadingModal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { selectIsJoiningProject, selectIsLeavingProject } from '@/store/projects/projects.selectors';
import { getProject } from '@/services/projects.api';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import { setActivities } from '@/store/activity_log/activity_log.slice';
import { ActivityType } from '@/utils/types';
import useActivityLog from '@/hooks/useActivityLog';
import useSocket from '@/hooks/useSocket';
import { setNotifications } from '@/store/notifications/notifications.slice';
import { updateUserData } from '@/services/user.api';
import { Socket } from 'socket.io-client';

const Notifications = () => {
    const {notifications, handleRemoveNotification, getUpdatedNotificationsIds} = useNotifications();
    const {handleJoinProject} = useProjects();
    const {user, userId} = useAuth();
    const isJoiningProject = useAppSelector(selectIsJoiningProject);
    const isLeavingProject = useAppSelector(selectIsLeavingProject);
    const {createNewActivity, activities} = useActivityLog();
    const emitEvent = useSocket(userId as string);

    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleJoin = async (notificationData: Pick<IProject, "projectId" | "title">, notificationId: string, user: IUser) => {
        handleJoinProject(notificationData, user);
        
        const {data: project} = await getProject(notificationData.projectId);

        const activityLog =  await createNewActivity(
            ActivityType.JoinProject,
            user as IUser,
            project as IProject,
            project.projectId as string
        );

        dispatch(setCurrentProject(project));
        dispatch(setActivities([
            ...activities,
            activityLog
        ]));
        
        handleRemoveNotification(notificationId);
        router.push(LINKS.HOME);
    } 

    const getAction = (notification: INotification) => {
        switch (notification.type) {
            case "invitation":
                return () => handleJoin(
                    notification.data as Pick<IProject, "projectId" | "title">,
                    notification.notificationId,
                    user as IUser
                );
            default:
                return () => {}
        }
    }

    const handleNotification = useCallback((newNotification: INotification) => {
        console.log({newNotification})
          dispatch(setNotifications([...notifications, newNotification]));
          updateUserData({
              ...user,
              notifications: getUpdatedNotificationsIds(
                  [...user?.notifications as string[], newNotification.notificationId],
                  [...notifications, newNotification]
              ),
          } as IUser)
              .then(res => dispatch(setUser(res.data)));
    }, [user, notifications, dispatch, getUpdatedNotificationsIds])

    const handleConnect = useCallback(() => {
        if (socket) {
            socket.emit('updateSocketId', {
              userId: userId as string,
              socketId: socket.id as string
            });
        }
        
    }, [socket, userId])

    useEffect(() => {
        if (socket) {
            socket.on('connect', handleConnect);
            socket.on('notification', handleNotification);
        }
    }, [socket, handleNotification, handleConnect])

  return (
    <Container id='notificationsPage'>
        <LoadingModal
            isOpen={isJoiningProject || isLeavingProject}
            text={
                isJoiningProject
                ? 'Joining project...'
                : isLeavingProject
                    ? 'Leaving project...'
                    : ''
            }
        />
        <ErrorModal />
        <Header text='Notifications' />

        {!!notifications.length ? (
            <div className='flex flex-col gap-3 justify-center w-full mt-5'>
                {notifications.map(n =>
                    <Notification
                        key={n.notificationId}
                        notification={n as INotification}
                        withDenyBtn={n.type !== "message"}
                        onDeny={() => handleRemoveNotification(n.notificationId)}
                        action={getAction(n)}
                    />
                )}
            </div>
        ) : (
            <div className='h-[50%] text-center w-full text-3xl flex items-center justify-center'>
                <p>
                    You do not have any notifications
                </p>
            </div>
        )}
    </Container>
  )
}

export default isAuth(Notifications);