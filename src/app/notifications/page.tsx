'use client'

import Notification from '@/components/Notification';
import Container from '@/components/common/Container';
import Header from '@/components/common/Header';
import useAuth from '@/hooks/useAuth';
import React from 'react';
import isAuth from '../ProtectedRoute';
import useNotifications from '@/hooks/useNotifications';
import { getProjectById, updateProject } from '@/services/projects.api';
import { IProject } from '@/store/projects/projects.slice';
import { useRouter } from 'next/navigation';
import { LINKS } from '@/utils/links';
import { INotification } from '@/utils/interfaces';

const Notifications = () => {
    const {user} = useAuth();
    const {notifications} = useNotifications();

    const router = useRouter();

    const handleJoinProject = async (projectData: Pick<IProject, "projectId" | "title">) => {
        const {data: project} = await getProjectById(projectData.projectId);

        if (project) {
            const updatedProject = {
                ...project,
                team: [...project.team, {
                    email: user?.email,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    imgSrc: user?.imgSrc,
                    userId: user?.userId,
                }],
            } as IProject;
            
            await updateProject(updatedProject);

            router.push(LINKS['HOME']);
        }
    }

    const handleDenyJoinProject = () => {
        // Set isPending to false
        // Remove invitation
    }

    const handleAcceptFriendRequest = (senderId: string) => {

    }

  return (
    <Container id='notificationsPage'>
        <Header text='Notifications' />

        <div className='flex flex-col gap-3 justify-center w-full mt-5'>
            {notifications.map(n =>
                <Notification
                    key={n.id}
                    notification={n as INotification}
                    withDenyBtn={n.type !== "message"}
                    onDeny={handleDenyJoinProject}
                    action={() => handleJoinProject(n.data as Pick<IProject, "projectId" | "title">)}
                />
            )}
        </div>
    </Container>
  )
}

export default isAuth(Notifications);