'use client'

import React, { useEffect } from 'react';
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
import Button from '@/components/common/Button';
import ButtonWithIcon from '@/components/common/ButtonWithIcon';
import { BiPlus } from 'react-icons/bi';
import { openNewProjectModal, setError } from '@/store/app/app.slice';

const Projects = () => {
  const {user} = useAuth();

  const {projects, isFetching} = useProjects();

  const dispatch = useAppDispatch();

  const handleError = (error: any): void => {
    if (error.code === 'ERR_NETWORK') {
      dispatch(setError(`Failed fetching projects - ${error.message}`));
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
            <p className='text-xl text-stone-800 text-center'>Fetching projects...</p>
          </>
        : <div id='projectsContainer' className='grid gap-2'>
            {projects?.length
              ? projects?.map((project: IProject) =>
                  <ProjectItem {...project} key={project.projectId}/>)
              : (
                <>
                  <p>No projects</p>

                  <Button
                    text='Create project'
                    action={handleCreateProject}
                    additionalStyles='py-2 px-4 font-semibold my-12 rounded-bl-lg w-full mx-auto bg-slate-100 hover:bg-slate-200'
                  />
                </>
              )
            }
          </div>
      }
    </div>
  )
}

export default isAuth(Projects);