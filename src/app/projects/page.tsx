'use client'

import React, { Suspense, useEffect, useState } from 'react';
import isAuth from '../ProtectedRoute';
import { useAppDispatch } from '@/hooks/hooks';
import { ITeamMember, fetchProjectsAsync, setCurrentProject } from '@/store/projects/projects.slice';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/common/Header';
import { createProject } from '@/services/projects.api';
import { DEFAULT_STAGE } from '@/utils/constants';
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import { openNewProjectModal, setError } from '@/store/app/app.slice';
import LoadingIcon from '@/components/utils/LoadingIcon';
import ProjectsList from '@/components/ProjectsList';
import Container from '@/components/common/Container';
import { AxiosError } from 'axios';
import Loading from '@/components/common/Loading';
import useProjects from '@/hooks/useProjects';

const Projects = () => {
  const {user} = useAuth();
  const {projects} = useProjects();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleError = (error: AxiosError): void => {
    if (error.code === 'ERR_NETWORK') {
        dispatch(setError(`Failed handling HTTP request - ${error.message.toLowerCase()}`));
        return;
    } else dispatch(setError('An error occurred while loading projects'));
  }

  const handleCreateProject = async () => {
    setIsLoading(true);
    
    try {
      const self: ITeamMember = {
        email: user?.email,
        userId: user?.userId,
        firstName: user?.firstName,
        lastName: user?.lastName
      } as ITeamMember;
  
      const newProject = {
        title: `${user?.firstName}'s Project`,
        team: [self],
        stages: [DEFAULT_STAGE]
      }
  
      return await createProject(newProject);
    } catch (error: unknown) {
      handleError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewProject = (): void => {
    dispatch(openNewProjectModal());
  }

  const getProjects = async () => {
      return await dispatch(fetchProjectsAsync(user?.userId as string))
          .unwrap()
          .catch((error) => handleError(error));
  }

  useEffect(() => {
      dispatch(setCurrentProject(null));
      getProjects();
  }, [])

  return (
    <Container id='projectsPage'>
      <div className='flex items-center justify-between w-full'>
        <Header text='Projects' />

        <ButtonWithIcon
          title='New project'
          action={handleNewProject}
          icon={<BiPlus />}
        />
      </div>

      {/* {isFetching
        ? <>
            <Image
              src={loadingBlue}
              alt='Loading'
              width={50}
              height={50}
              className='aspect-square animate-spin w-fit mx-auto mt-12 mb-4'
            />
            <p className='text-xl text-stone-800 text-center'>Loading projects...</p>
          </>
        : 
      } */}
      <>
        <ProjectsList projects={projects} />

        {!projects.length && (
          <p className='text-center w-full font-medium text-gray-400'>No projects</p>
        )}

        {/* <button
          disabled={isLoading}
          type='button'
          onClick={handleCreateProject}
          className={`
            my-5
            px-4
            pb-2
            pt-3
            rounded-bl-lg
            bg-blue-400
            hover:bg-blue-500
            disabled:bg-blue-300
            disabled:opacity-60
            disabled:cursor-not-allowed
            transition-all
            text-white
            font-semibold
            text-xl
            w-full
            mx-auto
            duration-75
          `}
      >
          {isLoading
              ? (
                  <span className='flex gap-3 items-center justify-center max-w-[150px] mx-auto relative'>
                      <LoadingIcon />
                      Loading...
                  </span>
                )
              : 'Create project'}
        </button> */}
      </>
    </Container>
  )
}

export default isAuth(Projects);