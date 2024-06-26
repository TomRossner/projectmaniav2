'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import { getProjectById } from '@/services/projects.api';
import { IProject, fetchProjectsAsync, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import Container from './common/Container';
import Button from './common/Button';
import Header from './common/Header';
import Image from 'next/image';
import { IUser, setUser } from '@/store/auth/auth.slice';
import MostRecentProjectSkeleton from './skeletons/MostRecentProjectSkeleton';
import { BsCircleFill } from 'react-icons/bs';
import { getAvatarPosition, getStagesCount, getTotalTasks, isProject, setProjectLink, userInitials } from '@/utils/utils';
import useSocket from '@/hooks/useSocket';
import { setNotifications } from '@/store/notifications/notifications.slice';
import useNotifications from '@/hooks/useNotifications';
import { getUserNotifications } from '@/services/notifications.api';
import { INotification, NewNotificationData } from '@/utils/interfaces';

const Home = () => {
  const {isAuthenticated, user} = useAuth();
  const {projects} = useProjects();
  const [mostRecentProject, setMostRecentProject] = useState<IProject | null>(null);
  const {socket} = useSocket();
  const {notifications} = useNotifications();

  const dispatch = useAppDispatch();

  const handleSelectProject = (): void => {
    dispatch(setCurrentProject(mostRecentProject));
  }

  const getUserProjects = async (userId: string) => {
    dispatch(fetchProjectsAsync(userId));
  }

  useEffect(() => {
    const getMostRecentProject = async (): Promise<void> => {
      if (user?.mostRecentProject) {
        const {data: project} = await getProjectById(user.mostRecentProject?.projectId as string);
        setMostRecentProject(project);
      }
    }

    if (user) {
      getMostRecentProject();
      getUserProjects(user.userId as string);
      getUserNotifications(user.notifications as string[])
          .then((res: { data: INotification[] }) => dispatch(setNotifications(res.data)));
    };
  }, [user])

  useEffect(() => {
    if (isAuthenticated) {
      socket.on("connect", () => {
        console.log("Socket connected");

        socket.emit("online", {
          userId: user?.userId
        });

        socket.on("notification", (newNotification: INotification) => {
          console.log({newNotification})

          // const updatedNotificationsIds: string[] = user?.notifications?.filter(nid => notifications.some(n => n.id === nid)) || [];

          // for (const id of user?.notifications as string[]) {
          //   if (!updatedNotificationsIds.some(nid => nid === id)) {
          //     updatedNotificationsIds.push(id);
          //   }
          // }
          // console.log({notifications})
          // console.log({userNotifications: user?.notifications})
          // console.log({updatedNotificationsIds})

          dispatch(setNotifications([...notifications, newNotification]));
          dispatch(setUser({
            ...user,
            notifications: [
              ...user?.notifications as string[],
              newNotification.id
            ]} as IUser));
        });
      });
    }
  }, [isAuthenticated, user?.userId]);

  return (
    <Container id='homePage' className='text-xl flex gap-3 flex-col items-start w-full'>
      {!isAuthenticated ? (
        <div className='gap-10 py-20 flex items-center flex-col w-full'>
          <Header
            text={`Welcome to ProJem!`}
            additionalStyles='text-5xl w-[95%]'
          />

          <Button type='button' additionalStyles='border border-slate-200 bg-blue-400 sm:hover:bg-blue-500 active:bg-blue-500 text-white rounded-bl-lg mx-auto'>
            <Link href={LINKS.SIGN_IN}>Sign in</Link>
          </Button>
        </div>
      ) : (
        <div className='w-full flex flex-col gap-10'>
          <Header text={`Welcome back ${user?.firstName}`} />

          {!!projects.length && (
            <div className='w-full flex flex-col'>
              <h3 className='text-2xl font-medium text-stone-800 text-left'>Continue where you left off</h3>
              
              {mostRecentProject
                ? (
                  <Link
                    href={`${LINKS['PROJECTS']}/${mostRecentProject?.projectId}`}
                    onClick={handleSelectProject}
                    className='w-full flex flex-col sm:hover:scale-[1.01] transition-all p-4 rounded-bl-lg shadow-sm hover:shadow-lg h-32 bg-blue-100'
                  >
                    <h4 className='text-2xl font-medium text-blue-500'>{mostRecentProject?.title}</h4>
                    <div className='grow' />

                    <p className='text-md text-blue-400 px-1 pt-1 flex items-center gap-2'>
                      {getStagesCount(mostRecentProject.stages)}
                      <BsCircleFill className='w-1 pb-1' />
                      {getTotalTasks(mostRecentProject.stages)}
                    </p>
                    
                    <p className='text-md text-blue-400 px-1'>
                      {mostRecentProject.team.map(
                        (u: IUser, idx: number) => (
                          <span key={u.userId} className='relative'>
                            {u.imgSrc ? (
                                <Image
                                  src={u.imgSrc}
                                  alt={u.firstName}
                                  className={`rounded-full w-8 h-8 bg-white ${getAvatarPosition(idx)}`}
                                />
                            ) : (
                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  justify-center
                                  pt-1
                                  rounded-full
                                  w-8
                                  h-8
                                  font-light
                                  border
                                  bg-white
                                  text-stone-300
                                  ${getAvatarPosition(idx)}
                                `}
                              >
                                {userInitials(u)}
                              </span>
                            )}
                          </span>
                        )
                      )}
                    </p>
                  </Link>
                ) : (
                  <MostRecentProjectSkeleton />
                )}
            </div>
          )}

          <div className='w-full flex flex-col'>
            <h3 className='text-xl font-medium text-stone-800 text-left w-full flex items-center justify-between mt-4'>
              Recent projects
              <Link
                href={LINKS.PROJECTS}
                className='font-normal text-blue-400 sm:hover:text-blue-500 active:text-blue-500'
              >
                See all
              </Link>
            </h3>

            {!!projects?.length && (
              <div className='w-full flex flex-col px-3 py-2 bg-slate-100 rounded-bl-lg'>
                {projects.map(p => (
                  <Fragment key={p.projectId}>
                    <Link
                      href={setProjectLink(p.projectId)}
                      onClick={() => dispatch(setCurrentProject(p))}
                      className='text-blue-400 w-full cursor-pointer sm:hover:text-blue-500 active:text-blue-500 pt-1 font-light'
                    >
                      {p.title}
                    </Link>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}

export default Home;