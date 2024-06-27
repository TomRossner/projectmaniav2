'use client'

import Notification, { TNotification } from '@/components/Notification';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import useAuth from '@/hooks/useAuth';
import React from 'react';
import isAuth from '../ProtectedRoute';
import {v4 as uuid} from "uuid";

const Notifications = () => {
    const {user} = useAuth();

    const handleJoinProject = (projectId: string) => {

    }

    const handleAcceptFriendRequest = (senderId: string) => {

    }

    const notifications = [
        {
            id: uuid(),
            type: "invitation",
            from: {
                firstName: "Tom",
                lastName: "Rossner",
                userId: "abc-123"
            },
            to: {
                userId: user?.userId as string,
            },
            isSeen: false,
            data: {
                projectId: 'c0b718c9-7937-40da-a226-24d227887367',
                title: "Bill's Project"
            }
        },
        {
            id: uuid(),
            type: "friend request",
            from: {
                firstName: "Morgan",
                lastName: "Freeman",
                userId: "def-456"
            },
            to: {
                userId: user?.userId as string,
            },
            isSeen: false
        },
        {
            id: uuid(),
            type: "new message",
            from: {
                firstName: "Tom",
                lastName: "Rossner",
                userId: "abc-123"
            },
            to: {
                userId: user?.userId as string,
            },
            isSeen: false
        },
]
  return (
    <Container id='notificationsPage'>
        <Header text='Notifications' />

        <div className='flex flex-col gap-3 justify-center w-full mt-5'>
            {notifications.map(n =>
                <Notification
                    key={n.id}
                    notification={n as TNotification}
                    withDenyBtn={n.type !== "new message"}
                />
            )}
        </div>
    </Container>
  )
}

export default isAuth(Notifications);