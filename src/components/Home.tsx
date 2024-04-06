'use client'

import { useAppDispatch } from '@/hooks/hooks';
import useAuth from '@/hooks/useAuth';
import { getProjectById } from '@/services/projects.api';
import { IProject, setCurrentProject } from '@/store/projects/projects.slice';
import { APP_VERSION } from '@/utils/constants';
import { LINKS } from '@/utils/links';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const {user} = useAuth();

  const [mostRecentProject, setMostRecentProject] = useState<IProject | null>(null);

  const dispatch = useAppDispatch();

  const handleSelectProject = (): void => {
    dispatch(setCurrentProject(mostRecentProject));
  }

  useEffect(() => {
    const getMostRecentProject = async (): Promise<void> => {
      if (user?.mostRecentProject) {
        const {data: project} = await getProjectById(user.mostRecentProject?.projectId as string);
        setMostRecentProject(project);
      }
    }

    if (user) getMostRecentProject();
  }, [user])

  return (
    <main className='text-xl py-5 px-6 flex gap-3 flex-col items-start w-full'>
      <h1 className='text-2xl text-center font-semibold w-full mb-10'>
        {user ? `Welcome back ${user?.firstName}` : `Welcome to ProjectMania v${APP_VERSION} !`}
      </h1>

      {mostRecentProject && (
        <>
          <h2 className='text-3xl font-medium text-stone-800 text-left'>Continue where you left off</h2>
          
          <Link
            href={`${LINKS['PROJECTS']}/${mostRecentProject.projectId}`}
            onClick={handleSelectProject}
            className='w-full border p-4 border-blue-500 rounded-bl-lg shadow-sm hover:shadow-lg transition-shadow h-28 bg-blue-100'
          >
            <p className='text-2xl font-medium text-blue-500'>{mostRecentProject.title}</p>
          </Link>
        </>
      )}

      <div className='w-full flex items-center justify-between mt-10'>
        <h3 className='text-2xl font-medium text-stone-800 text-left'>Recent projects</h3>

        <Link href={LINKS.PROJECTS} className='text-blue-400 hover:text-blue-500 transition-colors'>See all</Link>
      </div>
    </main>
  )
}

export default Home;