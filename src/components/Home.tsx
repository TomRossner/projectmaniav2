'use client'

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import { IProject, TeamMember, setCurrentProject } from '@/store/projects/projects.slice';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import Container from './common/Container';
import Button from './common/Button';
import Header from './common/Header';
import Image from 'next/image';
import MostRecentProjectSkeleton from './skeletons/MostRecentProjectSkeleton';
import { BsCircleFill } from 'react-icons/bs';
import { getStagesCount, getTotalTasks, setProjectLink } from '@/utils/utils';
import { twMerge } from 'tailwind-merge';
import { TEAM_MEMBERS_COUNT } from '@/utils/constants';
import { getUserById, updateUserData } from '@/services/user.api';
import { INotification } from '@/utils/interfaces';
import { setNotifications } from '@/store/notifications/notifications.slice';
import { IUser, setUser } from '@/store/auth/auth.slice';
import { refreshUser } from '@/services/localStorage';
import { getUserNotifications } from '@/services/notifications.api';
import { getProject } from '@/services/projects.api';
import useSocket from '@/hooks/useSocket';
import useNotifications from '@/hooks/useNotifications';
import LoadingModal from './modals/LoadingModal';
import { selectIsJoiningProject, selectIsLeavingProject } from '@/store/projects/projects.selectors';
import { openModal } from '@/store/modals/modals.slice';
import { fetchSession } from '@/services/auth.api';

const Home = () => {
  const {isAuthenticated, user, getUserInitials, getUserName} = useAuth();
  const {projects, getUserProjects, getMostRecentProject} = useProjects();
  const {socket} = useSocket();
  const {notifications, getUpdatedNotificationsIds} = useNotifications();
  const isJoiningProject = useAppSelector(selectIsJoiningProject);
  const isLeavingProject = useAppSelector(selectIsLeavingProject);

  const dispatch = useAppDispatch();

  const [mostRecentProject, setMostRecentProject] = useState<IProject | null>(null);
    
  const handleSelectProject = (): void => {
    dispatch(setCurrentProject(mostRecentProject));
  }

  const getFirstTeamMembers = (members: TeamMember[], count: number): TeamMember[] => {
    return [...members].filter((_, i) => i <= count);
  }
  const getOtherTeamMembersNames = (members: TeamMember[], count: number): string => {
    return [...members].filter((_, i) => i > count).map(u => `${u.firstName} ${u.lastName}`).join(", ")
  }

  const calculateTeamMembersLeft = (members: TeamMember[], from: number): number => {
    return [...members].filter((_, i) => i > from).length;
  }

  useEffect(() => {
    if (user) {
      if (!!user.mostRecentProject) {
        getMostRecentProject(user.mostRecentProject as Pick<IProject, "projectId" | "title">)
          .then(project => setMostRecentProject(project));
      }
      
      getUserProjects(user.userId);
      getUserNotifications(user.notifications as string[])
        .then((res: { data: INotification[] }) => {console.log(res);dispatch(setNotifications(res.data))});
    }
  }, [user, isJoiningProject, isLeavingProject])

  useEffect(() => {
    if (isAuthenticated && user && socket) {
        const handleConnect = () => {
            console.log("Socket connected");

            socket.emit("online", {
                userId: user?.userId
            });
        }

        const handleOnline = async (data: { userId: string }) => {
            const { data: user } = await getUserById(data.userId);
            console.log(`${user.firstName} is now online`);
        }

        const handleNotification = (newNotification: INotification) => {
            dispatch(setNotifications([...notifications, newNotification]));
            updateUserData({
                ...user,
                notifications: getUpdatedNotificationsIds(
                    [...user.notifications as string[], newNotification.id],
                    [...notifications, newNotification]
                ),
            } as IUser)
                .then(res => dispatch(setUser(res.data)));
        }


        socket.on("connect", handleConnect);
        socket.on("online", handleOnline);
        socket.on("notification", handleNotification);
        // socket.on("confirmedFriendRequest", handleConfirmedFriendRequest);

        return () => {
          // socket.off("connect", handleConnect);
          // socket.off("online", handleOnline);
          // socket.off("notification", handleNotification);
          // socket.off("confirmedFriendRequest", handleConfirmedFriendRequest);
        }
    }
  }, [isAuthenticated, user?.userId, socket]);

  useEffect(() => {
    fetchSession().then(res => dispatch(setUser(res ?? null)));
  }, [])

  return (
    <Container id='homePage' className='text-xl flex gap-3 flex-col items-start w-full'>
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
        <div className='w-full flex flex-col gap-5'>
          <Header text={`Welcome back ${user?.firstName}`} />

          {!!projects.length && (
            <div className='w-full flex flex-col'>
              
              {user?.mostRecentProject && (
                  <>
                    <h3 className='text-2xl font-medium text-stone-800 text-left'>Continue where you left off</h3>
                    
                    {mostRecentProject ? (
                      <Link
                        href={`${LINKS['PROJECTS']}/${mostRecentProject?.projectId}`}
                        onClick={handleSelectProject}
                        className='w-full flex flex-col sm:hover:scale-[1.01] transition-all p-4 rounded-bl-lg shadow-sm hover:shadow-lg h-32 bg-blue-100'
                      >
                        <h4 className='text-2xl font-medium text-blue-500'>{mostRecentProject?.title}</h4>
                        <div className='grow' />

                        <p className='text-md text-blue-400 px-1 pt-1 flex items-center gap-2'>
                          {getStagesCount(mostRecentProject!.stages)}
                          <BsCircleFill className='w-1 pb-1' />
                          {getTotalTasks(mostRecentProject!.stages)}
                        </p>

                        <div className='flex items-center gap-2 w-full'>
                          <p className='text-md text-blue-400 px-1 flex w-fit relative h-9'>
                            {getFirstTeamMembers(mostRecentProject!.team, TEAM_MEMBERS_COUNT).map(
                              (u: TeamMember, idx: number) => {
                                  return u.imgSrc ? (
                                    <span
                                      key={u.userId}
                                      style={{
                                        translate: -(idx * 10)
                                      }}
                                    >
                                      <Image
                                        src={u.imgSrc}
                                        alt={u.firstName}
                                        width={28}
                                        height={28}
                                        className={twMerge(`
                                          rounded-full
                                          w-8
                                          h-8
                                          bg-white
                                        `)}
                                      />
                                    </span>
                                  ) : (
                                    <span
                                      key={u.userId}
                                      style={{
                                        translate: -(idx * 10)
                                      }}
                                      className={twMerge(`
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
                                      `)}
                                    >
                                      {getUserInitials(getUserName(u))}
                                    </span>
                                  )}
                              // }
                            )}
                          </p>
                            {mostRecentProject!.team.length > TEAM_MEMBERS_COUNT && (
                              <span className='z-10 grow text-blue-400 sm:hover:text-blue-500' title={getOtherTeamMembersNames(mostRecentProject.team, TEAM_MEMBERS_COUNT)} style={{translate: -25}}>
                                + {calculateTeamMembersLeft(mostRecentProject!.team, 3)} more
                              </span>
                            )}
                        </div>

                      </Link>
                    ) : <MostRecentProjectSkeleton /> }
                  </>
                )}
            </div>
          )}

          {!!projects?.length ? (
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
            </div>
          ) : (
            <div className='w-full flex flex-col items-center justify-center gap-5 mt-24'>
              <p className='w-full text-center'>You do not have any projects</p>
              <Button
                action={() => dispatch(openModal("newProject"))}
                type='button'
                additionalStyles='rounded-bl-lg bg-blue-400 sm:hover:bg-blue-500 active:bg-blue-500 text-white border-none w-1/2 mx-auto'
              >
                Create one
              </Button>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default Home;