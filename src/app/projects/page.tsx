'use client'

import React, { useEffect, useState } from 'react';
import isAuth from '../ProtectedRoute';
import { useAppDispatch } from '@/hooks/hooks';
import { IProject, ITeamMember, fetchProjectsAsync, setCurrentProject } from '@/store/projects/projects.slice';
import useAuth from '@/hooks/useAuth';
import useProjects from '@/hooks/useProjects';
import PageHeader from '@/components/PageHeader';
import ProjectItem from '@/components/ProjectItem';
import { createProject } from '@/services/projects.api';
import { DEFAULT_STAGE } from '@/utils/constants';
import Image from 'next/image';
import loadingBlue from "../../assets/loading-blue.png";
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import { openNewProjectModal, setError } from '@/store/app/app.slice';
import LoadingIcon from '@/components/LoadingIcon';

const Projects = () => {
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {projects, isFetching} = useProjects();

  const dispatch = useAppDispatch();

  const handleError = (error: any): void => {
    if (error.code === 'ERR_NETWORK') {
      dispatch(setError(`Failed handling HTTP request - ${error.message.toLowerCase()}`));
      return;
    } else dispatch(setError('Failed fetching projects from API'));
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
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewProject = (): void => {
    dispatch(openNewProjectModal());
  }

  return (
    <div id='projectsPage' className='p-4'>
      <div className='flex items-center justify-between w-full'>
        <PageHeader text='Projects'/>
        <ButtonWithIcon title='New project' action={handleNewProject} icon={<BiPlus/>}/>
      </div>

      {isFetching
        ? <>
            <Image src={loadingBlue} alt='Loading' width={50} height={50} className='aspect-square animate-spin w-fit mx-auto mt-12 mb-4'/>
            <p className='text-xl text-stone-800 text-center'>Loading projects...</p>
          </>
        : <div id='projectsContainer' className={`my-2 grid gap-2 ${projects.length ? 'hover:shadow-md' : ''}`}>
            {projects?.length
              ? projects?.map((project: IProject) =>
                  <ProjectItem {...project} key={project.projectId}/>)
              : (
                <>
                  <p>No projects</p>

                  <button
                      disabled={isLoading}
                      type='button'
                      onClick={handleCreateProject}
                      className='my-5 px-4 pb-2 pt-3 rounded-bl-lg disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-60 bg-blue-400 hover:bg-blue-500 transition-all text-white font-semibold text-xl w-full mx-auto duration-75'
                  >
                      {isLoading
                          ? (
                              <span className='flex gap-3 items-center justify-center max-w-[150px] mx-auto relative'>
                                  <LoadingIcon/>
                                  Loading...
                              </span>
                            )
                          : 'Create project'}
                  </button>
                </>
              )
            }
          </div>
      }
    </div>
  )
}

export default isAuth(Projects);